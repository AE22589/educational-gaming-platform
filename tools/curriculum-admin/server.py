"""Local Chispitas workbook editor. Run with --help for setup options."""

import argparse
import base64
import hashlib
import importlib
import json
import os
import re
import subprocess
import sys
from http.server import BaseHTTPRequestHandler, HTTPServer
from io import BytesIO
from pathlib import Path
from tempfile import NamedTemporaryFile
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from openpyxl import load_workbook


def rows(sheet):
    header, *values = sheet.values
    return {number: dict(zip(header, (str(value).strip() if value is not None else ""
                                      for value in row)))
            for number, row in enumerate(values, start=2)}


def columns(sheet):
    return {cell.value: cell.column for cell in sheet[1] if cell.value}


def git_blob(data):
    return hashlib.sha1(f"blob {len(data)}\0".encode() + data).hexdigest()


class WorkbookEditor:
    def __init__(self, importer, path, public, tracked):
        self.importer = importer
        self.path = path
        self.public = public.resolve()
        data = path.read_bytes()
        self.revision = hashlib.sha256(data).hexdigest()
        self.blob = git_blob(data)
        self.book = load_workbook(BytesIO(data))
        self.catalog = self.book["Books_main_sub_sections"]
        self.vocabulary = self.book["vocabulary_list"]
        game_names = [str(row[0]).strip() for row in self.book["list_of_games"].values if row[0]]
        self.sections = {}
        for number, row in rows(self.catalog).items():
            flag = row["Sub Section Yes/No"].casefold()
            if not row["Section ID"] or flag not in {"yes", "no"}:
                continue
            section, topic = row["Section ID"], row["Sub Section ID"]
            if topic:
                allowed = set(importer.PRACTICE_GAMES.values())
                if topic == "science-2-b2-s02-04":
                    allowed.update(importer.FOOD_GROUP_GAMES)
            else:
                allowed = importer.IMPLEMENTED.get(section, ())
            games = [part.strip() for part in row["GameTypes"].split(";") if part.strip()]
            self.sections[number] = dict(id=number, section=section, topic=topic,
                subject=row["Subject"], grade=row["Grade"], book=row["Book Reference"],
                title=row["Sub Section Name English"] if topic else row["Section Name English"],
                games=games, available=[name for name in game_names if name in allowed or name in games])
        self.game_names = game_names
        self.words = {}
        self.source_images = set()
        for number, row in rows(self.vocabulary).items():
            if not row["English word"]:
                continue
            word = dict(id=number, section=row["Section ID"], topic=row["Sub Section ID"],
                        english=row["English word"], spanish=row["Spanish translation"])
            self.words[number] = word
            path = (self.public / row["ImagePath"].lstrip("/")).resolve()
            if (path.is_relative_to(self.public) and path.suffix.lower() == ".webp"
                    and f"public/{path.relative_to(self.public).as_posix()}" in tracked):
                self.source_images.add(number)

    def data(self):
        return dict(revision=self.revision, locations=list(self.sections.values()),
                    words=list(self.words.values()), imageRows=sorted(self.source_images),
                    gameNames=self.game_names, publishReady=bool(os.getenv("CHISPITAS_GITHUB_TOKEN")))

    def save(self, changes):
        if changes["revision"] != self.revision:
            raise ValueError("The workbook changed. Reload the page to get the latest version.")
        catalog_columns = columns(self.catalog)
        word_columns = columns(self.vocabulary)
        for key, games in changes["games"].items():
            location = self.sections[int(key)]
            if len(games) != len(set(games)) or any(game not in location["available"] for game in games):
                raise ValueError("Choose games available for this location.")
            self.catalog.cell(int(key), catalog_columns["GameTypes"]).value = "; ".join(games) or None
        for number in set(changes["removed"]):
            if number not in self.words:
                raise ValueError("A selected word could not be found.")
            for cell in self.vocabulary[number]:
                cell.value = None
        for word in changes["added"]:
            location = self.sections[word["location"]]
            english, spanish = (word[key].strip() for key in ("english", "spanish"))
            if not english or not spanish or max(len(english), len(spanish)) > 200:
                raise ValueError("Enter an English word and a Spanish translation, up to 200 characters each.")
            number = self.vocabulary.max_row + 1
            values = {"Section ID": location["section"], "Sub Section ID": location["topic"],
                      "Sub Section Name English": location["title"] if location["topic"] else "",
                      "English word": english, "Spanish translation": spanish}
            for header, value in values.items():
                cell = self.vocabulary.cell(number, word_columns[header], value or None)
                if value:
                    cell.data_type = "s"
        with NamedTemporaryFile(dir=self.path.parent, suffix=".xlsx", delete=False) as temporary:
            candidate = Path(temporary.name)
        try:
            self.book.save(candidate)
            self.importer.export(candidate)
            if hashlib.sha256(self.path.read_bytes()).hexdigest() != self.revision:
                raise ValueError("The workbook changed during the save. Reload the page and try again.")
            os.replace(candidate, self.path)
        finally:
            candidate.unlink(missing_ok=True)


def publish_workbook(workbook, editor, remote, branch, baseline):
    token = os.getenv("CHISPITAS_GITHUB_TOKEN")
    if not token:
        raise ValueError("Publishing requires CHISPITAS_GITHUB_TOKEN on the local server.")
    url = f"https://api.github.com/repos/{remote}/contents/docs/SectionList.xlsx"
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}
    try:
        with urlopen(Request(f"{url}?ref={branch}", headers=headers), timeout=15) as response:
            latest = json.load(response)["sha"]
        if latest == editor.blob:
            baseline.write_text(latest, encoding="utf-8")
            return {"message": "The saved workbook is already on GitHub."}
        if latest != baseline.read_text(encoding="utf-8").strip():
            raise ValueError("GitHub has a newer workbook. Reconcile it with your local draft before publishing.")
        content = workbook.read_bytes()
        if hashlib.sha256(content).hexdigest() != editor.revision:
            raise ValueError("The local workbook changed. Reload before publishing.")
        body = json.dumps({"message": "Update Chispitas curriculum workbook", "branch": branch,
                           "sha": latest, "content": base64.b64encode(content).decode()}).encode()
        with urlopen(Request(url, data=body, method="PUT", headers={**headers, "Content-Type": "application/json"}), timeout=20) as response:
            result = json.load(response)
    except HTTPError as error:
        raise ValueError(f"GitHub rejected publishing (HTTP {error.code}). Check repository access and branch rules.") from error
    baseline.write_text(result["content"]["sha"], encoding="utf-8")
    return {"message": "Published one workbook commit to GitHub.", "url": result["commit"]["html_url"]}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project", required=True, type=Path, help="Chispitas checkout with public assets and importer")
    parser.add_argument("--workbook", required=True, type=Path, help="Local SectionList.xlsx to edit")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--repository", default="AE22589/educational-gaming-platform")
    args = parser.parse_args()
    if not re.fullmatch(r"[\w.-]+/[\w.-]+", args.repository):
        parser.error("--repository must be in owner/repository format")
    sys.path.insert(0, str((args.project / "scripts").resolve()))
    importer = importlib.import_module("import-curriculum")
    workbook = args.workbook.resolve()
    public = args.project / "public"
    def git(*arguments):
        return subprocess.check_output(["git", "-C", str(args.project), *arguments])

    tracked = set(git("ls-tree", "-r", "--name-only", "HEAD", "public").decode().splitlines())
    source_commit = git("rev-parse", "--short", "HEAD").decode().strip()
    baseline = workbook.with_suffix(".github-base")
    if not baseline.exists():
        base = git("rev-parse", "HEAD:docs/SectionList.xlsx").decode().strip()
        if git_blob(workbook.read_bytes()) != base:
            parser.error("Start with a fresh copy of docs/SectionList.xlsx from this checkout, or restore the draft's .github-base file.")
        baseline.write_text(base, encoding="utf-8")
    ui = Path(__file__).with_name("index.html")
    host = f"127.0.0.1:{args.port}"

    class Handler(BaseHTTPRequestHandler):
        def send(self, status, kind, body):
            self.send_response(status)
            self.send_header("Content-Type", kind)
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            self.wfile.write(body)

        def json(self, status, data):
            self.send(status, "application/json; charset=utf-8", json.dumps(data).encode())

        def editor(self):
            return WorkbookEditor(importer, workbook, public, tracked)

        def workbook_data(self):
            return {**self.editor().data(), "sourceCommit": source_commit}

        def do_GET(self):
            if self.headers.get("Host") != host:
                return self.send_error(403)
            if self.path in {"/", "/admin", "/admin/"}:
                return self.send(200, "text/html; charset=utf-8", ui.read_bytes())
            if self.path != "/api/workbook":
                return self.send_error(404)
            try:
                self.json(200, self.workbook_data())
            except (ValueError, OSError, KeyError) as error:
                self.json(400, {"error": str(error)})

        def do_POST(self):
            if self.path not in {"/api/workbook", "/api/publish"}:
                return self.send_error(404)
            if (self.headers.get("Host") != host or self.headers.get("Origin") != f"http://{host}"
                    or self.headers.get_content_type() != "application/json"):
                return self.send_error(403)
            try:
                length = int(self.headers.get("Content-Length", 0))
                if not 0 < length <= 256_000:
                    raise ValueError("Invalid save request size.")
                payload = json.loads(self.rfile.read(length))
                editor = self.editor()
                if self.path == "/api/publish":
                    if payload["revision"] != editor.revision:
                        raise ValueError("The local workbook changed. Reload before publishing.")
                    importer.export(workbook)
                    return self.json(200, publish_workbook(workbook, editor, args.repository, "main", baseline))
                editor.save(payload)
                self.json(200, self.workbook_data())
            except (ValueError, TypeError, OSError, KeyError) as error:
                self.json(400, {"error": str(error)})

    print(f"Editing {workbook}\nhttp://{host}/admin/", flush=True)
    HTTPServer(("127.0.0.1", args.port), Handler).serve_forever()


if __name__ == "__main__":
    main()
