# Workbook curriculum

The public reference workbook is `docs/SectionList.xlsx`. Copy it outside the
repository before editing or importing. From the repository root, using Python
3.10 or later, run:

```powershell
python -X utf8 scripts/import-curriculum.py "C:\path\to\SectionList.xlsx"
```

The importer reads a standard, unencrypted XLSX. It validates IDs, book
references, subject/route pairs and local WebP paths, and joins vocabulary to units
by `Section ID`. Errors name the workbook cell when available and leave the previous
export in place. The only generated file to track is
`src/features/curriculum/curriculum.generated.json`. It contains a fixed set of
public fields. Add private columns only to the private source. Review the generated
diff before committing, especially free-text cells.

## Add a unit

1. Add a row to `Books_sections_games`. Use `English` with `englishworld` or
   `Science` with `scienceworld`. Set `Grade` to `Primary 1` through `Primary 6`,
   `Book Reference` to e.g. `Book1`, and `Book ID` to the matching
   subject-grade-book ID, e.g. `english-2-b1`. Books are inferred from these
   columns because the workbook has no independent book table.
2. Set a unique, stable `Section ID` prefixed with the book ID and a hyphen.
   Fill in `Section Name` and optionally `Section Description in Spanish`.
   Arrange rows in display order within each book. The workbook has no order
   column. Titles default to English, independently of `Subject`. Add the
   optional `Content Language` column with `es` for Spanish titles or `en`
   for English.
3. Place a lossless WebP in the matching `public/englishworld/` or
   `public/scienceworld/` directory and register it in `docs/assets.md`.
   Enter its public path, e.g. `/englishworld/my-unit.webp`, in `Section ImagePath`.
   This column is optional. For vocabulary, enter individual image paths in
   `vocabulary_list.ImagePath`. A composite illustration does not identify a
   single vocabulary item.
4. Add vocabulary rows to `vocabulary_list` with the unit's `Section ID`,
   the `English word`, and optional `Spanish translation` and `Sub Section`.
   Existing records also include full phrases. Correct the repeated entry at
   `vocabulary_list!C305` if it is unintended.
5. List implemented game names in `GameTypes`, separated by semicolons.
   The importer reports names without an implementation. Units without a
   playable game show a coming-soon message. The existing body-parts mission
   retains its original vocabulary, interactive targets and saved progress.
6. Run the import again and preview with `npm run dev` at
   http://127.0.0.1:3000/englishworld/ or /scienceworld/. The current workbook
   has one grade and one book per subject. Students choose from the illustrated homepage
   grade cards, with only Primaria 2 enabled. The navigation shows their choice. Each world opens its matching
   book automatically. Each imported unit is statically
   exported at `/unit/<Section ID>/`. Existing subject and legacy game links
   continue to work.

For a Pages preview in PowerShell, set `$env:GITHUB_ACTIONS = "true"`, run
`npm run build`, then `npm run start`. Open
http://127.0.0.1:3000/educational-gaming-platform/englishworld/. Commit the
generated JSON with its code and registered assets when approved. GitHub Actions
builds and publishes `out/` from the repository. Keep private workbook copies
and `out/` out of Git. The reference workbook is stored under `docs/`
and stays outside the Pages artifact.

Sections with subsections use the Yes/No flag and the ordered List of Sub Sections column. For older workbooks without the list, the importer uses the order of the vocabulary groups. The world catalog links to the section, which links to each subsection’s game page.
