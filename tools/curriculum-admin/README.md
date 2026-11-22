# Local curriculum admin

Run the editor from the repository root with Python 3.10 or newer. Start from a
clean checkout of the latest `main` when creating a new draft. If you collaborate
on the workbook, keep a separate draft until you are ready to publish.

```powershell
python -m pip install openpyxl==3.1.5
$draft = Join-Path $env:TEMP 'Chispitas-SectionList.xlsx'
if (!(Test-Path $draft)) { Copy-Item docs/SectionList.xlsx $draft }
python tools/curriculum-admin/server.py --project . --workbook $draft
```

Open `http://127.0.0.1:8765/admin/`. Choose a subject and book, then choose a
section or subsection. The game library shows what can be assigned there. Use
**Whole section** to include subsection vocabulary. A tick marks artwork tracked
in the checkout. Hover over the workbook name to see the checkout revision.

Use **Paste a vocabulary table** to add multiple rows from Excel or Google
Sheets. Copy English words in the left column and Spanish translations in the
right column. Select **Add pasted words**, then **Save** to validate and save the
local draft. You can save repeatedly across sections before publishing.

**Publish** commits the saved workbook to GitHub `main` in one request. Start
the server with `CHISPITAS_GITHUB_TOKEN` set in its environment to enable the
button. Use a repository-scoped token with Contents write access and permission
to commit to `main`. The token stays in the server process. The editor stops if
the remote workbook changed after the draft's base revision. Keep the draft and
its `.github-base` file together. To refresh image checks, start from the latest
checkout and use a fresh workbook copy when you have finished the previous draft.

The admin server only listens on loopback. The GitHub Pages build continues to
serve the public learning site.
