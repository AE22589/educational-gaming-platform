# Workbook curriculum

The editable source is `docs/SectionList.xlsx`. Run `npm run import:curriculum`
from the repository root with Python 3.10 or later on PATH. `npm run build` runs
the same import before the static export, including for GitHub Pages.

Errors identify the workbook cell where possible and leave the previous
`src/features/curriculum/curriculum.generated.json` in place. Review the workbook
and generated public fields before release.

## Sections and subsections

Use the `Books_main_sub_sections` tab and keep rows in display order.

1. Add a main row for each section. Set `Subject` and `Path` to `English` and
   `englishworld`, or `Science` and `scienceworld`. Enter the `Grade`
   (for example, `Primary 2`), `Book Reference` (for example, `Book1`), and
   matching `Book ID` (for example, `english-2-b1`).
2. Set a stable `Section ID` starting with the book ID and a hyphen. Enter
   `Section Number`, `Section Name English`, `Section Name Spanish` and
   optionally `Section Description in Spanish`. Set `Sub Section Yes/No` to
   `No` and leave the subsection fields blank. Both world catalogs show
   `Section Number` on their cards. Zero is valid.
3. For each subsection, add a row with the same book and section details.
   Set `Sub Section Yes/No` to `Yes` and fill in `Sub Section ID`,
   `Sub Section Name English` and `Sub Section Name Spanish`. Keep the
   subsection ID stable, for example `science-2-b2-s02-02`. The worksheets
   page shows section titles in Spanish and English in workbook row order.
   It selects the book automatically when the grade has only one available.
   Its subject and section buttons use the homepage's Science green and English purple.
4. Enter a public WebP path in `ImagePath` for a section card or subsection
   page, for example `/scienceworld/healthy-habits.webp`. Leave the cell blank
   if there is no image. Register new assets in [the asset register](assets.md).
5. Enter supported games in `GameTypes` on the section or subsection row.
   Separate them with semicolons in the order they should appear. Older
   workbooks with no inline subsection games can still use `subsection_games`.

Units export at `/unit/<Section ID>/`. Topic game pages use
`/unit/<Section ID>/subsection/<English-title-slug>/`. The current world
catalogs display their corresponding Primaria 2 book.

## Vocabulary and pictures

In `vocabulary_list`, use `Section ID`, `Sub Section ID`,
`Sub Section Name English`, `English word`, `Spanish translation` and
`ImagePath`. The subsection ID links a vocabulary row to its topic. Leave
the subsection fields blank for general section vocabulary.

Use public WebP paths such as `/vocabulary/<subject>/<Section ID>/<topic-or-general>/<word>.webp`.
Blank, `No image` and `Find` provide no image of their own. Picture Match uses
entries with images. Other practice games can use the Spanish clue. See the
[OpenMoji image mapping](vocabulary-image-map.md) for earlier sourced artwork.
Keep duplicate vocabulary rows. Reuse the same image path for the same word
and meaning. The importer shares the first available image across rows with
the same English term and Spanish translation, ignoring case and alternatives
such as `Enfadado/a` versus `Enfadado`. Distinct senses use distinct translations,
for example `Naranja (color)` and `Naranja`.

## Printable worksheets

Put files in `public/worksheets/<subject>/<Section ID>/<topic-or-general>/`
and register them in [the asset register](assets.md). Use `english` or
`science` for the subject and lowercase `.pdf` or `.docx` filenames with
letters, digits, hyphens or underscores.

Fill in `Worksheets Path` on the main section row or subsection row. Leave
it blank when no file is available. Separate multiple paths with semicolons
or line breaks. The site adds the GitHub Pages base path.

| Section ID | Sub Section ID | Worksheets Path |
| --- | --- | --- |
| `science-2-b2-s02` | `science-2-b2-s02-02` | `/worksheets/science/science-2-b2-s02/healthcare-and-illnesses/healthcare-and-illnesses.pdf` |
| `science-2-b2-s02` | *(blank)* | `/worksheets/science/science-2-b2-s02/general/repaso-habitos.pdf` |
| `english-2-b1-s01` | *(blank)* | `/worksheets/english/english-2-b1-s01/general/deportes.docx` |

The first example is in the workbook. Add the other paths only after the
files exist. Use the topic's English-title slug or stable subsection ID
as its folder. Use `general` on a main section row.

The whole-section view includes all topic worksheets and files assigned
directly to the section. Each topic view shows its own files. PDFs open
in the browser's print-capable viewer. Word files download for opening
and printing in a compatible editor.

Commit the worksheet file and the updated `docs/SectionList.xlsx` together.
The next site build imports the workbook and lists the worksheet on the
Worksheets page. Section and topic game screens use that same import for the
printer icon and “Imprimir fichas” link. One matching PDF opens in a new tab.
Multiple matching PDFs open the Worksheets page with the section or topic
already selected.

Older workbooks using `Books_sections_games` can still be imported.
Their optional `worksheets` tab uses `Section ID`, `Subsection ID`,
`Worksheet Title` and `Worksheet Path`.

To preview the GitHub Pages export in PowerShell, set
`$env:GITHUB_ACTIONS = "true"`, run `npm run build`, then `npm run start`.
Open http://127.0.0.1:3000/educational-gaming-platform/worksheets/.
