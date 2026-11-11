# Asset Register

## Rules for artwork and media in `public/`

- **Format:** raster images are WebP. GIF, PNG and JPEG files are not allowed in
  `public/`. Animated images (GIF sources) must be **lossless animated WebP**;
  PNG and JPEG sources should be converted to lossless WebP too, so no further
  quality is lost. Convert with `node scripts/to-lossless-webp.mjs <file>`
  (needs ffmpeg), then delete the original. Keep a GIF's playback: a GIF without
  a loop extension plays once, and the converter keeps that behavior. Never
  resize or re-compress an image only to save bytes without the owner's approval.
- **Register:** every file in `public/` has a row below (path in backticks).
  `node scripts/check-assets.mjs` fails CI when a file is missing from this
  register, is not WebP, is a lossy animated WebP, or when a row points to a file
  that does not exist.
- **Approval:** the owner approves artwork in the development chat before it is
  merged; artwork that is on `main` is treated as owner-approved. Older rows that
  still say "owner visual review pending" are superseded by this rule.
- **Rights:** most artwork was generated with AI tools from owner-supplied
  references. Third-party rights have not been independently assessed. That
  assessment is one open prerequisite before a child pilot or wider publication,
  not a per-image gate during development.
- **Loading:** large animations are fetched in the background before use (see the
  cave) so they start instantly on slow mobile connections.


## Body-parts mission

The progress character is a transparent WebP adapted from the dragon image
provided by the owner. The checkerboard background was removed while preserving
the character, then the image was resized and converted locally for web use.
No external media or runtime image service is used. Owner visual review and
rights review remain pending before any child pilot.

The adventure path is a shallow crop from the landscape illustration supplied
by the owner (`Bild-3.png`), converted locally to WebP. The original flag and
label are replaced by a round origin marker; seven path stations and the cave
remain visible. The image is decorative; the
accessible progressbar exposes the game-completion position. No external media
is used.

The round-two full-body girl was generated with Codex ImageGen using the
owner-provided homepage girl as the character and style reference. The
transparent local image keeps the same pink hoodie and blue backpack straps,
with arms extended horizontally and legs apart for separate body-part targets.
The owner approved this illustration. Third-party rights have not been
independently assessed; review the asset before any child pilot.

| Asset | Local path | Type | Locale | Accessible description | Review status |
|---|---|---|---|---|---|
| Adventure progress path | `public/learning/adventure-progress-path.webp` | Cropped progress-bar background | None | Decorative landscape with a start marker, seven path stations, and a cave; progress is also exposed as a semantic progressbar. | Owner-provided source; local crop; visual review pending. |
| Dragon progress character | `public/learning/dragon-progress.webp` | Transparent progress illustration | None | The owner's purple baby dragon sits on the mission path and moves forward as words are placed. | Owner-provided source image; owner visual and rights review pending before any child pilot. |
| Round-two body figure | `public/learning/body-parts-girl.webp` | Transparent full-body character illustration | None | The homepage girl stands front-facing with arms stretched to the sides and legs apart. | Generated with Codex ImageGen from the owner-provided girl reference; owner approved; independent rights review pending before any child pilot. |

## Companion cave preview

These empty base backgrounds were generated with Codex ImageGen from the
owner-approved purple baby dragon style reference. No external media files were
used. Future dragon, furniture and decor images are intended to remain separate
overlays. Rights and visual review remain pending before any child pilot.

| Asset | Local path | Type | Locale | Accessible description | Review status |
|---|---|---|---|---|---|
| Companion cave day | `public/dragon-cave/cave-day.webp` | Room background | None | Violet crystal cave interior in bright daylight, with blue sky visible through the cave opening. | Owner requested; owner visual and rights review pending. |
| Companion cave night | `public/dragon-cave/cave-night.webp` | Room background | None | Violet crystal cave interior at night, with a crescent moon and stars visible through the cave opening. | Owner requested; owner visual and rights review pending. |
| Dragon eating an apple | `public/dragon-cave/dragon-eats-shop-apple.webp` | Transparent animated overlay (lossless animated WebP, plays once, about 4 s) | None | Purple dragon eating an apple; replaces the sleeping overlay while feeding. | Owner-supplied animation; converted from GIF to lossless WebP on 2026-11-05. Third-party rights not independently assessed. |
| Dragon drinking water | `public/dragon-cave/dragon-drinks-shop-water.webp` | Transparent animated overlay (lossless animated WebP, plays once, 3 s) | None | Purple dragon drinking water; replaces the sleeping overlay while drinking. | Owner-supplied animation; converted from GIF to lossless WebP on 2026-11-05. Third-party rights not independently assessed. |
| Sleeping dragon overlay | `public/dragon-cave/dragon-sleep.webp` | Transparent animated character overlay | None | Purple dragon curled up asleep on the cave floor; the adjacent cave scene supplies its setting. | Generated locally from the owner's character reference; owner visual and rights review pending before any child pilot. |

The owner reviewed the rendered homepage at 390, 630, 800 and 1440 pixels and
authorized this visual release for deployment on 2026-11-01. Owner visual review
and media-rights review remain required before any child pilot.

## Illustrated homepage tiles

The homepage illustrations were generated with Codex ImageGen from owner
references. No external media files were used. Third-party rights have not been
independently assessed; review the assets before any child pilot.

| Asset | Local path | Type | Locale | Accessible description | Review status |
|---|---|---|---|---|---|
| Enchanted valley panorama | `public/homepage/enchanted-valley-panorama-v2.webp` | Full-width homepage background | None | Decorative panoramic landscape with the explorer's face and castle kept clear of the overlaid cards; adjacent HTML provides the heading. | Owner design reference received; Owner visual review pending. |
| Enchanted valley mobile scene | `public/homepage/enchanted-valley-mobile.webp` | Fixed portrait background for phone layouts | None | Decorative portrait scene keeps the explorer, star and castle in view behind scrolling cards. | Owner visual review pending. |
| Science garden | `public/homepage/science-garden.webp` | Tile illustration | None | Decorative smiling flask among leaves; tile is labelled as coming soon. | Owner visual review pending; preview only. |
| English book | `public/homepage/english-book.webp` | Tile illustration | English learning subject | Decorative open picture book with letter blocks; adjacent HTML identifies the learning tile. | Owner visual review pending. |
| Little friend dragon | `public/homepage/my-little-friend-dragon.webp` | Tile illustration | None | Decorative purple baby dragon; adjacent HTML names the companion tile. | Generated from the owner's supplied dragon reference; Owner visual review pending. |
| Adventure map | `public/homepage/adventure-map.webp` | Tile illustration | None | Decorative illustrated trail map; tile opens the Adventure Map preview. | Owner visual review pending; preview only. |
| Homepage girl face | `public/homepage/avatar-girl.webp` | Illustration used as the face figure in round one of the body-parts mission | None | The homepage girl's face, front view; the mission provides the alternative text. | Derived from the owner-approved homepage artwork. Source details not recorded; third-party rights not independently assessed. |
| Shop apple | `public/shop/apple.webp` | Shop product illustration | None | Decorative apple; the adjacent product name and price are in HTML. | Source not recorded; owner-approved by presence on `main`. Third-party rights not independently assessed. |
| Shop water | `public/shop/water.webp` | Shop product illustration | None | Decorative drinking water; the adjacent product name and price are in HTML. | Source not recorded; owner-approved by presence on `main`. Third-party rights not independently assessed. |
| Shop leaf bed | `public/shop/leaf-bed.webp` | Shop product illustration (upcoming item) | None | Decorative leaf bed for the cave; labelled as coming soon. | Source not recorded; owner-approved by presence on `main`. Third-party rights not independently assessed. |
| Shop glow plant | `public/shop/glow-plant.webp` | Shop product illustration (upcoming item) | None | Decorative glowing plant for the cave; labelled as coming soon. | Source not recorded; owner-approved by presence on `main`. Third-party rights not independently assessed. |
| Mission clipboard | `public/homepage/daily-missions.webp` | Support illustration | None | Decorative checked clipboard; adjacent HTML links to the body-parts mission. | Owner visual review pending. |
| Star chest | `public/homepage/star-chest.webp` | Support illustration | None | Decorative chest of stars; adjacent HTML describes future collection use without inventing a balance. | Owner visual review pending. |
| Turtle companion | `public/homepage/turtle-companion.webp` | Support illustration | None | Decorative smiling turtle mascot; adjacent HTML provides the encouragement message. | Owner visual review pending. |

## Navigation illustrations

The transparent WebP illustrations below are decorative because each
navigation item has a text label. The top navigation includes a conditional
Home link on non-home pages, About Chispitas, Contact Us and a non-interactive
Log in/Register preview.

| Asset | Local path | Type | Accessible description | Review status |
|---|---|---|---|---|
| Home house | `public/homepage/nav-home.webp` | Navigation illustration (lossless WebP with alpha, 1328 × 1184 px) | Decorative purple house with a star on its door; the adjacent "Home" label names the link. | Supplied by the owner and converted from PNG to lossless WebP on 2026-11-07; third-party rights not independently assessed. |
| Learner portrait | `public/homepage/nav-profile.webp` | Navigation illustration | Decorative smiling learner portrait; the adjacent label identifies the non-interactive Log in/Register preview. | Owner visual review pending. |
| English book | `public/homepage/nav-learn.webp` | Navigation illustration | Decorative open book with a UK flag bookmark; the adjacent label identifies English learning. | Owner visual review pending. |
| Smiling star mascot | `public/homepage/nav-shop.webp` | Brand mascot and navigation illustration | Decorative smiling golden star; adjacent brand text names CHISPITAS and the navigation label identifies About Chispitas. | Owner visual review pending. |
| Contact dragon | `public/homepage/contact-dragon.webp` | Navigation illustration (lossless WebP, 256 × 256 px; downscaled from the 1254 px original with the owner's approval on 2026-11-05, the original stays in the Git history) | None | Decorative purple dragon icon; the adjacent label "Contact Us / Contacto" identifies the link. | Added by Feduta; owner-approved. Third-party rights not independently assessed. |
| Adventure map | `public/homepage/nav-map.webp` | Navigation illustration | Decorative folded map with a location pin; the adjacent label identifies the coming-soon map preview. | Owner visual review pending; preview only. |
| Adventure world overview | `public/homepage/adventure-world-overview.webp` | Shared map overview | Fantasy world with five named sections and a green play control for Bosque Encantado. | Owner-supplied visual; converted to lossless WebP. Rights not independently assessed. |
| Bosque Encantado detail | `public/homepage/adventure-forest-detail.webp` | First section map detail | Fantasy forest with five numbered checkpoints and star illustrations. | Owner-supplied visual; converted to lossless WebP. Rights not independently assessed. |

## English World unit illustrations

Separate generated, text-free illustrations for the ten unit cards, cropped from a consistent 3D storybook-style sheet.

| Asset | Local path | Type | Accessible description | Review status |
|---|---|---|---|---|
| English World basics | `public/englishworld/basics.webp` | Decorative unit illustration | Colored building blocks; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World sports | `public/englishworld/sports.webp` | Decorative unit illustration | Sports balls; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| Sports bat | `public/englishworld/sports-equipment/bat.webp` | Vocabulary picture | Wooden baseball bat with a black grip. | Generated artwork, not independently rights-reviewed. |
| Sports knee pads | `public/englishworld/sports-equipment/knee.webp` | Vocabulary picture | Blue knee pads, one worn on a bent leg. | Generated artwork, not independently rights-reviewed. |
| Sports elbow pads | `public/englishworld/sports-equipment/elbow.webp` | Vocabulary picture | Orange elbow pads, one worn on a bent arm. | Generated artwork, not independently rights-reviewed. |
| Sports park | `public/englishworld/sports-equipment/park.webp` | Look & Find scene | A sunny playground with children, animals, sports equipment, toys, and picnic objects. | Generated artwork, not independently rights-reviewed. |
| English World seasons | `public/englishworld/seasons.webp` | Decorative unit illustration | Sun, rain cloud and snowflake; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World animals | `public/englishworld/animals.webp` | Decorative unit illustration | Lion, elephant and giraffe; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World world-and-fruit | `public/englishworld/world-and-fruit.webp` | Decorative unit illustration | Globe and healthy fruit; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World places-and-activities | `public/englishworld/places-and-activities.webp` | Decorative unit illustration | Theme park and city buildings; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World beach | `public/englishworld/beach.webp` | Decorative unit illustration | Beach umbrella and sandcastle; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World safe-travel | `public/englishworld/safe-travel.webp` | Decorative unit illustration | Airplane, bus and car; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World home | `public/englishworld/home.webp` | Decorative unit illustration | Cozy house, books and toys; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |
| English World family | `public/englishworld/family.webp` | Decorative unit illustration | Picnic basket and photo album; the adjacent unit title identifies the card. | Generated artwork, not independently rights-reviewed. |

## Science World unit illustrations

Six owner-provided illustrations cropped from the supplied educational sticker sheet. Each crop is a lossless WebP at 512 x 512 pixels. The adjacent unit title identifies each card.

| Asset | Local path | Type | Accessible description | Review status |
|---|---|---|---|---|
| My Amazing Body | `public/scienceworld/body.webp` | Decorative unit illustration | Child with a diagram of the human body; the adjacent unit title identifies the card. | Owner-provided source, converted and cropped to lossless WebP. Third-party rights not independently assessed. |
| Healthy Habits | `public/scienceworld/healthy-habits.webp` | Decorative unit illustration | Water, heart, fruit and exercise shoe; the adjacent unit title identifies the card. | Owner-provided source, converted and cropped to lossless WebP. Third-party rights not independently assessed. |
| Animal Kingdom | `public/scienceworld/animal-kingdom.webp` | Decorative unit illustration | Giraffe, elephant, tiger, penguin and turtle; the adjacent unit title identifies the card. | Owner-provided source, converted and cropped to lossless WebP. Third-party rights not independently assessed. |
| Growing Plants | `public/scienceworld/plants.webp` | Decorative unit illustration | Growing plant, sun and watering can; the adjacent unit title identifies the card. | Owner-provided source, converted and cropped to lossless WebP. Third-party rights not independently assessed. |
| Save Our Planet | `public/scienceworld/planet.webp` | Decorative unit illustration | Earth held in hands with a recycling symbol; the adjacent unit title identifies the card. | Owner-provided source, converted and cropped to lossless WebP. Third-party rights not independently assessed. |
| Everyday Technology | `public/scienceworld/technology.webp` | Decorative unit illustration | Robot with computer devices; the adjacent unit title identifies the card. | Owner-provided source, converted and cropped to lossless WebP. Third-party rights not independently assessed. |
