"""Export the public Chispitas curriculum from a private workbook."""
import argparse
import json
from pathlib import Path
import re
import sys
from tempfile import NamedTemporaryFile
from zipfile import BadZipFile

from curriculum_xlsx import worksheets

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/features/curriculum/curriculum.generated.json"
CATALOG = "Books_sections_games"
VOCABULARY = "vocabulary_list"
WORLDS = {"English": "englishworld", "Science": "scienceworld"}
COMMON_GAMES = {
    "Picture Match", "Mystery Word", "Build a Phrase", "See It, Hear It, Spell It",
    "Letter Scramble", "Word Hunt", "Look & Find",
}
IMPLEMENTED = {
    "english-2-b1-s01": COMMON_GAMES | {"Play, Go, Do, Wear?"},
    "english-2-b1-s02": COMMON_GAMES | {"Weather, Season or Activity?"},
    "science-2-b2-s01": {"Misión: partes del cuerpo"},
}


def records(rows, sheet, required, optional):
    headers = {}
    for column, name in rows.get(1, {}).items():
        if name in required or name in optional:
            if name in headers:
                raise ValueError(f"{sheet}!{column}1: duplicate header {name!r}")
            headers[name] = column
    missing = sorted(set(required) - headers.keys())
    if missing:
        raise ValueError(f"{sheet}!1: missing columns: {', '.join(missing)}")
    for number, cells in rows.items():
        if number == 1:
            continue
        fields = {name: cells.get(column, "") for name, column in headers.items()}
        if not any(fields.values()):
            continue

        def location(name):
            return f"{sheet}!{headers.get(name, '')}{number} ({name})"

        for name in required:
            if not fields[name]:
                raise ValueError(f"{location(name)}: required value")
        yield fields, location


def image_path(value, location):
    if not value:
        return ""
    value = value.removeprefix("/")
    if not re.fullmatch(r"[a-z0-9_-]+(?:/[a-z0-9_-]+)*\.webp", value):
        raise ValueError(f"{location}: use a WebP path relative to public/")
    asset = (ROOT / "public" / value).resolve()
    if not asset.is_relative_to(ROOT / "public") or not asset.is_file():
        raise ValueError(f"{location}: image file does not exist: {value}")
    return "/" + value


def export(workbook):
    sheets = {name: rows for name, _, rows in worksheets(workbook)}
    if CATALOG not in sheets:
        raise ValueError(f"Missing worksheet {CATALOG}")
    books, units = {}, {}
    required = ("Subject", "Path", "Book Reference", "Book ID", "Grade", "Section ID", "Section Name")
    optional = ("Section Description in Spanish", "Section ImagePath", "GameTypes", "Content Language")
    for fields, at in records(sheets[CATALOG], CATALOG, required, optional):
        subject, path, reference, book_id, grade, unit_id, title = (fields[key] for key in required)
        world = WORLDS.get(subject)
        if world is None or world != path:
            raise ValueError(f"{at('Subject')}: unrecognized subject or mismatched Path")
        level = re.fullmatch(r"(?:Primary|Primaria) ([1-6])", grade)
        if not level:
            raise ValueError(f"{at('Grade')}: use Primary 1 through Primary 6")
        level = int(level[1])
        number = re.fullmatch(r"Book\s*([1-9]\d*)", reference)
        if not number or book_id != f"{subject.lower()}-{level}-b{number[1]}":
            raise ValueError(f"{at('Book ID')}: unknown book ID for this subject, grade and Book Reference")
        if unit_id in units:
            raise ValueError(f"{at('Section ID')}: duplicate unit ID {unit_id!r}")
        if not re.fullmatch(re.escape(book_id) + r"-[a-z0-9]+(?:-[a-z0-9]+)*", unit_id):
            raise ValueError(f"{at('Section ID')}: unit ID must start with its Book ID and a hyphen")
        language = fields.get("Content Language") or "en"
        if language not in {"en", "es"}:
            raise ValueError(f"{at('Content Language')}: use en or es")
        books.setdefault(book_id, {"id": book_id, "world": world, "grade": level, "title": f"Libro {number[1]}"})
        games = [game.strip() for game in fields.get("GameTypes", "").split(";") if game.strip()]
        if len(games) != len(set(games)):
            raise ValueError(f"{at('GameTypes')}: duplicate game")
        for game in games:
            if game not in IMPLEMENTED.get(unit_id, ()):
                print(f"{at('GameTypes')}: game has no implementation: {game}", file=sys.stderr)
        units[unit_id] = {
            "id": unit_id, "bookId": book_id, "title": title, "language": language,
            "description": fields.get("Section Description in Spanish", ""),
            "image": image_path(fields.get("Section ImagePath"), at("Section ImagePath")),
            "games": games, "vocabulary": [],
        }

    seen = set()
    if VOCABULARY in sheets:
        for fields, at in records(sheets[VOCABULARY], VOCABULARY, ("Section ID", "English word"),
                                  ("Sub Section", "Spanish translation", "ImagePath")):
            unit_id = fields["Section ID"]
            if unit_id not in units:
                raise ValueError(f"{at('Section ID')}: unknown unit ID {unit_id!r}")
            word = " ".join(fields["English word"].split())
            subsection = fields.get("Sub Section", "")
            key = (unit_id, subsection.casefold(), word.casefold())
            if key in seen:
                print(f"{at('English word')}: repeated word in the same unit and subsection", file=sys.stderr)
            seen.add(key)
            units[unit_id]["vocabulary"].append({
                "word": word, "translation": fields.get("Spanish translation", ""),
                "subsection": subsection, "image": image_path(fields.get("ImagePath"), at("ImagePath")),
            })
    for unit in units.values():
        if unit["id"] in {"english-2-b1-s01", "english-2-b1-s02"} and unit["games"]:
            if len({row["word"].casefold() for row in unit["vocabulary"]}) < 4:
                raise ValueError(f"{VOCABULARY}: add at least four distinct terms for {unit['id']}")
    return {"books": list(books.values()), "units": list(units.values())}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook", type=Path)
    args = parser.parse_args()
    workbook = args.workbook.resolve()
    if workbook.is_relative_to(ROOT):
        parser.error("Store the source workbook outside the repository.")
    try:
        data = export(workbook)
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        with NamedTemporaryFile(dir=OUTPUT.parent, encoding="utf-8", mode="w", delete=False) as temp:
            temp_path = Path(temp.name)
            try:
                temp.write(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
                temp.close()
                temp_path.replace(OUTPUT)
            finally:
                temp_path.unlink(missing_ok=True)
        print(f"Exported {len(data['books'])} books and {len(data['units'])} units to {OUTPUT.relative_to(ROOT)}")
    except (OSError, ValueError, BadZipFile, KeyError) as error:
        parser.exit(1, f"Curriculum import failed: {error}\n")


if __name__ == "__main__":
    main()
