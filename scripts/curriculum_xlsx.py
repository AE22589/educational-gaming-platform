"""Read values and cell coordinates from an Office Open XML workbook."""
import posixpath
import re
from xml.etree import ElementTree as ET
from zipfile import ZipFile

MAIN = "{http://schemas.openxmlformats.org/spreadsheetml/2006/main}"
REL = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"


def worksheets(path):
    with ZipFile(path) as archive:
        relationships = {
            entry.get("Id"): entry.get("Target")
            for entry in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))
        }
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = [text_nodes(node) for node in ET.fromstring(archive.read("xl/sharedStrings.xml"))]
        sheets = ET.fromstring(archive.read("xl/workbook.xml")).find(f"{MAIN}sheets")
        for sheet in sheets:
            target = relationships[sheet.get(f"{REL}id")]
            member = target.lstrip("/") if target.startswith("/") else posixpath.normpath(posixpath.join("xl", target))
            rows = {}
            for row in ET.fromstring(archive.read(member)).iterfind(f"{MAIN}sheetData/{MAIN}row"):
                values = {}
                for cell in row:
                    column = re.match("[A-Z]+", cell.get("r")).group()
                    value = cell.findtext(f"{MAIN}v", "")
                    if cell.get("t") == "s":
                        value = strings[int(value)]
                    elif cell.get("t") == "inlineStr":
                        value = text_nodes(cell.find(f"{MAIN}is"))
                    values[column] = value.strip()
                rows[int(row.get("r"))] = values
            yield sheet.get("name"), member, rows


def text_nodes(node):
    return "".join(text.text or "" for text in node.iter(f"{MAIN}t"))
