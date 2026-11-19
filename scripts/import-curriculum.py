"""Export the public Chispitas curriculum from a private workbook."""
import argparse
import json
from pathlib import Path
import re
import sys
import unicodedata
from tempfile import NamedTemporaryFile
from zipfile import BadZipFile

from curriculum_xlsx import worksheets

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "src/features/curriculum/curriculum.generated.json"
CATALOG = "Books_sections_games"
ROW_CATALOG = "Books_main_sub_sections"
VOCABULARY = "vocabulary_list"
SUBSECTION_GAMES = "subsection_games"
PRINTABLES = "worksheets"
WORLDS = {"English": "englishworld", "Science": "scienceworld"}
HEALTHY_HABITS = "science-2-b2-s02"
PRACTICE_GAMES = {
    "match": "Picture Match", "mystery": "Mystery Word", "phrase": "Build a Phrase",
    "spell": "See It, Hear It, Spell It", "scramble": "Letter Scramble", "hunt": "Word Hunt",
}
COMMON_GAMES = {
    *PRACTICE_GAMES.values(), "Look & Find",
}
IMPLEMENTED = {
    "english-2-b1-s01": COMMON_GAMES | {"Play, Go, Do, Wear?"},
    "english-2-b1-s02": COMMON_GAMES | {"Weather, Season or Activity?"},
    HEALTHY_HABITS: set(PRACTICE_GAMES.values()),
    "science-2-b2-s01": {"Misión: partes del cuerpo"},
}


def records(rows, sheet, required, optional, allow_empty=()):
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
            if not fields[name] and name not in allow_empty:
                raise ValueError(f"{location(name)}: required value")
        yield fields, location


def image_path(value, location):
    if not value or value.strip().casefold() in {"no image", "find"}:
        return ""
    value = value.removeprefix("/")
    if not re.fullmatch(r"[a-z0-9_-]+(?:/[a-z0-9_-]+)*\.webp", value):
        raise ValueError(f"{location}: use a WebP path relative to public/")
    asset = (ROOT / "public" / value).resolve()
    if not asset.is_relative_to(ROOT / "public") or not asset.is_file():
        raise ValueError(f"{location}: image file does not exist: {value}")
    return "/" + value


def subsection_slug(name):
    text = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def export_printables(rows, units, books):
    columns = ("Section ID", "Subsection ID", "Worksheet Title", "Worksheet Path")
    mappings = []
    for fields, at in records(rows, PRINTABLES, columns, (), allow_empty=("Subsection ID",)):
        section, topic, title, path = (fields[column] for column in columns)
        unit = units.get(section)
        if unit is None:
            raise ValueError(f"{at('Section ID')}: unknown section ID {section!r}")
        subsection = find_subsection(unit, topic) if topic else None
        if topic and not subsection:
            raise ValueError(f"{at('Subsection ID')}: unknown subsection {topic!r} for {section!r}")
        mappings.append((section, subsection, title, path, at("Worksheet Path")))
    return validate_printables(mappings, units, books)


def validate_printables(mappings, units, books):
    printables = []
    seen = set()
    for section, subsection, title, path, location in mappings:
        unit = units[section]
        world = books[unit["bookId"]]["world"]
        subject = next(subject.lower() for subject, route in WORLDS.items() if route == world)
        folder = subsection["id"] if subsection else "general"
        directory = f"worksheets/{subject}/{section}/{folder}/"
        allowed_directories = [directory]
        if subsection and subsection.get("stableId"):
            allowed_directories.append(f"worksheets/{subject}/{section}/{subsection['stableId']}/")
        path = path.removeprefix("/")
        parent, _, filename = path.rpartition("/")
        if parent + "/" not in allowed_directories or not re.fullmatch(
            r"[a-z0-9]+(?:[-_][a-z0-9]+)*\.(?:pdf|docx)", filename
        ):
            raise ValueError(f"{location}: use /{directory}<file>.pdf or .docx")
        public = (ROOT / "public").resolve()
        asset = (public / path).resolve()
        if not asset.is_relative_to(public) or not asset.is_file():
            raise ValueError(f"{location}: file does not exist: {path}")
        if path in seen:
            raise ValueError(f"{location}: duplicate worksheet path {path!r}")
        seen.add(path)
        printables.append({"sectionId": section, "subsectionId": subsection.get("stableId", folder) if subsection else "",
                           "title": title, "path": "/" + path})
    return printables


def export_row_printables(rows, units, books):
    mappings = []
    for location, (section, topic, fields) in rows.items():
        subsection = find_subsection(units[section], topic) if topic else None
        if subsection:
            title = subsection["spanishTitle"] or subsection["title"]
        else:
            title = units[section]["spanishTitle"] or units[section]["title"]
        paths = [path.strip() for path in re.split(r"[;\n]+", fields["Worksheets Path"]) if path.strip()]
        for path in paths:
            label = title
            if len(paths) > 1:
                label = f"{title} ({re.sub(r'[-_]+', ' ', Path(path).stem)})"
            mappings.append((section, subsection, label, path, location))
    return validate_printables(mappings, units, books)


def find_subsection(unit, reference):
    slug = subsection_slug(reference)
    return next((topic for topic in unit["subsections"]
                 if topic.get("stableId") == reference or topic["id"] == slug), None)


def read_row_catalog(rows):
    required = ("Subject", "Path", "Book Reference", "Book ID", "Grade", "Section ID",
                "Section Number", "Section Name English", "Section Name Spanish",
                "Sub Section Yes/No", "Sub Section ID", "Sub Section Name English",
                "Sub Section Name Spanish", "ImagePath", "Worksheets Path")
    optional = ("Section Description in Spanish", "GameTypes")
    section_rows, topics, mappings = {}, {}, {}
    for fields, at in records(rows, ROW_CATALOG, required, optional, allow_empty=required[6:]):
        section = fields["Section ID"]
        flag = fields["Sub Section Yes/No"].casefold()
        number = fields["Section Number"]
        title = fields["Section Name English"]
        if not re.fullmatch(r"0|[1-9][0-9]*", number):
            raise ValueError(f"{at('Section Number')}: use a nonnegative integer")
        if not title:
            raise ValueError(f"{at('Section Name English')}: required value")
        topic, topic_title = fields["Sub Section ID"], fields["Sub Section Name English"]
        if flag == "yes":
            if not topic.startswith(section + "-") or not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", topic):
                raise ValueError(f"{at('Sub Section ID')}: use a stable ID starting with {section}-")
            if not topic_title:
                raise ValueError(f"{at('Sub Section Name English')}: required value")
            entries = topics.setdefault(section, {})
            if topic in entries:
                raise ValueError(f"{at('Sub Section ID')}: duplicate ID {topic!r}")
            entries[topic] = (fields, at)
        elif flag == "no" and not (topic or topic_title):
            if section in section_rows:
                raise ValueError(f"{at('Section ID')}: duplicate main section row {section!r}")
            section_rows[section] = (fields, at)
        elif not flag and not any(fields.get(key) for key in (
            "Sub Section ID", "Sub Section Name English", "Sub Section Name Spanish",
            "ImagePath", "Worksheets Path", "GameTypes", "Section Description in Spanish",
        )):
            continue
        else:
            raise ValueError(f"{at('Sub Section Yes/No')}: use No for a section or Yes for a subsection")
        if fields["Worksheets Path"]:
            mappings[at("Worksheets Path")] = (section, topic, fields)

    headers = rows[1].copy()
    renamed = {"Section Name English": "Section Name", "ImagePath": "Section ImagePath"}
    headers = {column: renamed.get(name, name) for column, name in headers.items()}
    projected = {1: headers}
    flag_column = next(column for column, name in headers.items() if name == "Sub Section Yes/No")
    for index, row in rows.items():
        if index != 1 and row.get(flag_column, "").casefold() == "no":
            projected[index] = row
    for section, entries in topics.items():
        for fields, at in entries.values():
            if section not in section_rows:
                raise ValueError(f"{at('Section ID')}: missing main section row {section!r}")
            main, _ = section_rows[section]
            for column in ("Subject", "Path", "Book Reference", "Book ID", "Grade", "Section Number"):
                if fields[column] != main[column]:
                    raise ValueError(f"{at(column)}: does not match main section {section!r}")
    return projected, section_rows, topics, mappings


def assign_subsection_games(rows, units):
    required = ("Section ID", "Subsection ID", "Game Type ID", "Display Order")
    topics = {(unit["id"], topic["id"]): topic for unit in units.values() for topic in unit["subsections"]}
    assignments = {}
    for fields, at in records(rows, SUBSECTION_GAMES, required, ()):
        unit_id, topic_name, game_id, order = (fields[key] for key in required)
        topic = find_subsection(units[unit_id], topic_name) if unit_id in units else None
        key = (unit_id, topic["id"] if topic else "")
        if key not in topics:
            raise ValueError(f"{at('Subsection ID')}: unknown subsection {topic_name!r} for {unit_id!r}")
        game = PRACTICE_GAMES.get(game_id, game_id)
        if game not in PRACTICE_GAMES.values():
            raise ValueError(f"{at('Game Type ID')}: unsupported subsection game {game_id!r}")
        if not re.fullmatch(r"[1-9][0-9]*", order):
            raise ValueError(f"{at('Display Order')}: use a positive integer")
        order = int(order)
        menu = assignments.setdefault(key, {})
        if order in menu:
            raise ValueError(f"{at('Display Order')}: duplicate order for this subsection")
        if game in menu.values():
            raise ValueError(f"{at('Game Type ID')}: duplicate game for this subsection")
        menu[order] = game
    for key, menu in assignments.items():
        topics[key]["games"] = [menu[order] for order in sorted(menu)]


def inline_subsection_games(value, location):
    names = [name.strip() for name in value.split(";") if name.strip()]
    games = [PRACTICE_GAMES.get(name, name) for name in names]
    if any(game not in PRACTICE_GAMES.values() for game in games):
        raise ValueError(f"{location}: unsupported subsection game")
    if len(set(games)) != len(games):
        raise ValueError(f"{location}: duplicate subsection game")
    return games


def reuse_vocabulary_images(units):
    def image_key(row):
        translation = re.sub(r"([oa])/[oa]\b", r"\1", row["translation"].casefold())
        return row["word"].casefold(), translation

    images = {}
    rows = [row for unit in units.values() for row in unit["vocabulary"]]
    for row in rows:
        if row["image"]:
            images.setdefault(image_key(row), row["image"])
    for row in rows:
        row["image"] = images.get(image_key(row), "")


def export(workbook):
    sheets = {name: rows for name, _, rows in worksheets(workbook)}
    catalog = ROW_CATALOG if ROW_CATALOG in sheets else CATALOG
    if catalog not in sheets:
        raise ValueError(f"Missing worksheet {CATALOG}")
    section_rows, row_topics, row_mappings = {}, {}, {}
    catalog_rows = sheets[catalog].copy()
    if catalog == ROW_CATALOG:
        catalog_rows, section_rows, row_topics, row_mappings = read_row_catalog(catalog_rows)
    books, units = {}, {}
    required = ("Subject", "Path", "Book Reference", "Book ID", "Grade", "Section ID", "Section Name")
    flag_column = "Sub Section Yes/No"
    list_column = "List of Sub Sections"
    optional = ("Section Description in Spanish", "Section ImagePath", "GameTypes", "Content Language",
                flag_column, list_column)
    subsection_headers = {name.casefold(): name for name in (flag_column, list_column)}
    catalog_rows[1] = {column: subsection_headers.get(name.casefold(), name)
                       for column, name in catalog_rows.get(1, {}).items()}
    has_subsection_list = list_column in catalog_rows[1].values()
    legacy_subsections = set()
    for fields, at in records(catalog_rows, catalog, required, optional):
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
        flag = fields.get(flag_column, "").casefold()
        if flag not in {"", "yes", "no"}:
            raise ValueError(f"{at(flag_column)}: use Yes or No")
        subsection_names = [name.strip() for name in re.split(r"[;,\n]+", fields.get(list_column, "")) if name.strip()]
        if flag == "yes" and not has_subsection_list:
            legacy_subsections.add(unit_id)
        elif flag == "yes" and not subsection_names:
            raise ValueError(f"{at(list_column)}: list the subsection names")
        units[unit_id] = {
            "id": unit_id, "bookId": book_id, "title": title, "language": language,
            "description": fields.get("Section Description in Spanish", ""),
            "image": image_path(fields.get("Section ImagePath"), at("Section ImagePath")),
            "games": games, "subsections": subsection_names if flag == "yes" else [], "vocabulary": [],
        }
        if unit_id in section_rows:
            section, _ = section_rows[unit_id]
            units[unit_id]["number"] = int(section["Section Number"])
            units[unit_id]["spanishTitle"] = section["Section Name Spanish"]

    has_inline_games = any(fields.get("GameTypes") for topics in row_topics.values() for fields, _ in topics.values())
    if VOCABULARY in sheets:
        for fields, at in records(sheets[VOCABULARY], VOCABULARY, ("Section ID", "English word"),
                                  ("Sub Section", "Sub Section ID", "Sub Section Name English", "Spanish translation", "ImagePath"),
                                  allow_empty=("English word",)):
            unit_id = fields["Section ID"]
            if unit_id not in units:
                raise ValueError(f"{at('Section ID')}: unknown unit ID {unit_id!r}")
            word = " ".join(fields["English word"].split())
            if not word:
                if unit_id != HEALTHY_HABITS or not (has_inline_games or SUBSECTION_GAMES in sheets):
                    raise ValueError(f"{at('English word')}: required value")
                print(f"{at('English word')}: skipped vocabulary row without an English term", file=sys.stderr)
                continue
            subsection = fields.get("Sub Section", "")
            topic_id = fields.get("Sub Section ID", "")
            if topic_id:
                topic = row_topics.get(unit_id, {}).get(topic_id)
                if not topic:
                    raise ValueError(f"{at('Sub Section ID')}: unknown subsection {topic_id!r} for {unit_id!r}")
                subsection = topic[0]["Sub Section Name English"]
            elif fields.get("Sub Section Name English"):
                raise ValueError(f"{at('Sub Section ID')}: required for a vocabulary row with a subsection")
            units[unit_id]["vocabulary"].append({
                "word": word, "translation": fields.get("Spanish translation", ""),
                "subsection": subsection, "image": image_path(fields.get("ImagePath"), at("ImagePath")),
            })
    reuse_vocabulary_images(units)
    for unit in units.values():
        names = unit["subsections"]
        entries = list(row_topics.get(unit["id"], {}).items())
        if entries:
            names = [fields["Sub Section Name English"] for _, (fields, _) in entries]
        if unit["id"] in legacy_subsections:
            names = list(dict.fromkeys(row["subsection"] for row in unit["vocabulary"] if row["subsection"]))
        subsections = []
        slugs = set()
        for index, name in enumerate(names):
            slug = subsection_slug(name)
            if not slug or slug in slugs:
                raise ValueError(f"{unit['id']}: subsection name {name!r} must have a unique URL")
            slugs.add(slug)
            subsections.append({"id": slug, "title": name})
            if entries:
                stable_id, (fields, at) = entries[index]
                subsections[-1].update(stableId=stable_id, spanishTitle=fields["Sub Section Name Spanish"],
                                       image=image_path(fields["ImagePath"], at("ImagePath")))
                if has_inline_games:
                    subsections[-1]["games"] = inline_subsection_games(fields.get("GameTypes", ""), at("GameTypes"))
        unit["subsections"] = subsections
        if unit["id"] in {"english-2-b1-s01", "english-2-b1-s02", "science-2-b2-s02"} and unit["games"]:
            if len({row["word"].casefold() for row in unit["vocabulary"]}) < 4:
                raise ValueError(f"{VOCABULARY}: add at least four distinct terms for {unit['id']}")
    if SUBSECTION_GAMES in sheets and not has_inline_games:
        assign_subsection_games(sheets[SUBSECTION_GAMES], units)
    printables = export_printables(sheets[PRINTABLES], units, books) if catalog == CATALOG and PRINTABLES in sheets else []
    if row_mappings:
        printables = export_row_printables(row_mappings, units, books)
    return {"books": list(books.values()), "units": list(units.values()), "worksheets": printables}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("workbook", type=Path)
    args = parser.parse_args()
    workbook = args.workbook.resolve()
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
        print(f"Exported {len(data['books'])} books, {len(data['units'])} units and "
              f"{len(data['worksheets'])} worksheet files to {OUTPUT.relative_to(ROOT)}")
    except (OSError, ValueError, BadZipFile, KeyError) as error:
        parser.exit(1, f"Curriculum import failed: {error}\n")


if __name__ == "__main__":
    main()
