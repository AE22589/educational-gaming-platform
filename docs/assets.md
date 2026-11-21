# Asset Register

## Printable worksheets

| Public file | Source |
| --- | --- |
| `public/worksheets/science/science-2-b2-s02/healthcare-and-illnesses/healthcare-and-illnesses.pdf` | Existing revised Chispitas worksheet. OpenMoji illustrations are credited on the page under CC BY-SA 4.0. |

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
| Enchanted valley panorama | `public/homepage/enchanted-valley-panorama-v2.webp` | Previous desktop homepage background | None | Decorative panoramic landscape with the explorer, star and castle. | Retained as prior artwork. |
| Enchanted valley mobile scene | `public/homepage/enchanted-valley-mobile.webp` | Previous mobile homepage background | None | Decorative portrait scene with the explorer, star and castle. | Retained as prior artwork. |
| Tall enchanted valley | `public/homepage/enchanted-valley-tall.webp` | Scrolling homepage background | None | Decorative portrait landscape with the explorer, star, castle, waterfalls and a meadow. | Owner-supplied artwork; visual review pending. |
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
| Printable worksheet activities | `public/homepage/worksheet-activities.webp` | Homepage card and worksheets page illustration | None | Decorative illustration of a parent and child doing printed activities together. | AI-generated for Chispitas from the owner-provided visual reference. |

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
| Contact dragon with envelope | `public/homepage/contact-dragon-envelope.webp` | Lossless WebP, 256 × 256 px | None | Decorative illustration for the Contact Us navigation button and contact page. | Generated from the little friend dragon. |
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

## Primary grade card illustrations

Original artwork generated for Chispitas using the owner's supplied image as a
style reference. The six square crops are lossless WebP at 512 × 512 pixels.
Each illustration is decorative because the card carries a visible grade label.

| Asset | Local path | Subject |
|---|---|---|
| Primaria 1 | `public/homepage/grades/primaria-1.webp` | Enchanted pencil and building blocks |
| Primaria 2 | `public/homepage/grades/primaria-2.webp` | Storybook, wizard hat and star wand |
| Primaria 3 | `public/homepage/grades/primaria-3.webp` | Headphones and crystal microphone |
| Primaria 4 | `public/homepage/grades/primaria-4.webp` | Microscope and glowing flask |
| Primaria 5 | `public/homepage/grades/primaria-5.webp` | Treasure map, compass and ruby |
| Primaria 6 | `public/homepage/grades/primaria-6.webp` | Telescope, ringed planet and crystals |

## Vocabulary pictures

Existing lossless WebP artwork copied without recompression into curriculum-specific paths. `general` denotes section-level vocabulary without a subsection. The original paths remain in use elsewhere.

| Asset | Local path | Type | Accessible description |
|---|---|---|---|
| Bat | `public/vocabulary/english/english-2-b1-s01/general/bat.webp` | Vocabulary picture | Wooden sports bat with a black grip. |
| Knee pads | `public/vocabulary/english/english-2-b1-s01/general/knee-pads.webp` | Vocabulary picture | Blue and black protective knee pads, one worn on a leg. |
| Elbow pads | `public/vocabulary/english/english-2-b1-s01/general/elbow-pads.webp` | Vocabulary picture | Black and orange protective elbow pads, one worn on an arm. |
| Apple | `public/vocabulary/science/science-2-b2-s01/general/apple.webp` | Vocabulary picture | Red apple with a green leaf. |
| Water | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/water.webp` | Vocabulary picture | Blue bottle of water with a cork and water droplet charm. |
| Apple | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/apple.webp` | Vocabulary picture | Red apple with a green leaf. |
| Knee pads | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/knee-pads.webp` | Vocabulary picture | Blue and black protective knee pads, one worn on a leg. |

## OpenMoji vocabulary icons

These 46 transparent icons come from [OpenMoji](https://openmoji.org/) and are licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The original 72 x 72 PNGs were converted without resizing to lossless WebP with `scripts/to-lossless-webp.mjs`; the WebP adaptations retain that license. Source filenames use the OpenMoji code points listed below. The website footer carries the attribution.

| Word | Local path | Type | Accessible description | Source |
|---|---|---|---|---|
| Body | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/body.webp` | Vocabulary picture | Standing person. | [OpenMoji 1F9CD](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F9CD.png) |
| Sick person | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/sick-person.webp` | Vocabulary picture | Face with thermometer. | [OpenMoji 1F912](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F912.png) |
| Bones | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/bones.webp` | Vocabulary picture | Bone. | [OpenMoji 1F9B4](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F9B4.png) |
| Doctor | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/doctor.webp` | Vocabulary picture | Doctor with stethoscope. | [OpenMoji E300](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/E300.png) |
| Nurse | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/nurse.webp` | Vocabulary picture | Nurse in uniform. | [OpenMoji E302](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/E302.png) |
| Medicine | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/medicine.webp` | Vocabulary picture | Pill. | [OpenMoji 1F48A](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F48A.png) |
| Vaccination | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/vaccination.webp` | Vocabulary picture | Syringe. | [OpenMoji 1F489](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F489.png) |
| Sleep | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/sleep.webp` | Vocabulary picture | Sleeping face. | [OpenMoji 1F634](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F634.png) |
| Back pain | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/back-pain.webp` | Vocabulary picture | Person holding a painful back. | [OpenMoji E321](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/E321.png) |
| Toothbrush | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/toothbrush.webp` | Vocabulary picture | Toothbrush. | [OpenMoji 1FAA5](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1FAA5.png) |
| Soap | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/soap.webp` | Vocabulary picture | Soap. | [OpenMoji 1F9FC](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F9FC.png) |
| Milk | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/milk.webp` | Vocabulary picture | Glass of milk. | [OpenMoji 1F95B](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F95B.png) |
| Lettuce | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/lettuce.webp` | Vocabulary picture | Leafy green. | [OpenMoji 1F96C](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F96C.png) |
| Bread | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/bread.webp` | Vocabulary picture | Bread. | [OpenMoji 1F35E](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F35E.png) |
| Potatoes | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/potatoes.webp` | Vocabulary picture | Potato. | [OpenMoji 1F954](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F954.png) |
| Watermelon | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/watermelon.webp` | Vocabulary picture | Watermelon. | [OpenMoji 1F349](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F349.png) |
| Tomato | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/tomato.webp` | Vocabulary picture | Tomato. | [OpenMoji 1F345](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F345.png) |
| Rice | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/rice.webp` | Vocabulary picture | Cooked rice. | [OpenMoji 1F35A](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F35A.png) |
| Orange | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/orange.webp` | Vocabulary picture | Orange. | [OpenMoji 1F34A](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F34A.png) |
| Broccoli | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/broccoli.webp` | Vocabulary picture | Broccoli. | [OpenMoji 1F966](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F966.png) |
| Pasta | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/pasta.webp` | Vocabulary picture | Spaghetti. | [OpenMoji 1F35D](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F35D.png) |
| Eggs | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/eggs.webp` | Vocabulary picture | Egg. | [OpenMoji 1F95A](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F95A.png) |
| Fish | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/fish.webp` | Vocabulary picture | Fish. | [OpenMoji 1F41F](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F41F.png) |
| Pepper | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/pepper.webp` | Vocabulary picture | Bell pepper. | [OpenMoji 1FAD1](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1FAD1.png) |
| Meat | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/meat.webp` | Vocabulary picture | Meat on bone. | [OpenMoji 1F356](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F356.png) |
| Banana | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/banana.webp` | Vocabulary picture | Banana. | [OpenMoji 1F34C](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F34C.png) |
| Cheese | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/cheese.webp` | Vocabulary picture | Cheese wedge. | [OpenMoji 1F9C0](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F9C0.png) |
| Cake | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/cake.webp` | Vocabulary picture | Slice of cake. | [OpenMoji 1F370](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F370.png) |
| Chips | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/chips.webp` | Vocabulary picture | French fries. | [OpenMoji 1F35F](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F35F.png) |
| Pear | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/pear.webp` | Vocabulary picture | Pear. | [OpenMoji 1F350](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F350.png) |
| Sandwich | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/sandwich.webp` | Vocabulary picture | Sandwich. | [OpenMoji 1F96A](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F96A.png) |
| Soup | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/soup.webp` | Vocabulary picture | Pot of food. | [OpenMoji 1F372](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F372.png) |
| Hamburger | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/hamburger.webp` | Vocabulary picture | Hamburger. | [OpenMoji 1F354](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F354.png) |
| A piece of cake | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/a-piece-of-cake.webp` | Vocabulary picture | Slice of cake. | [OpenMoji 1F370](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F370.png) |
| Electric cables | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/electric-cables.webp` | Vocabulary picture | Electrical wire. | [OpenMoji E1D4](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/E1D4.png) |
| Shower | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/shower.webp` | Vocabulary picture | Shower. | [OpenMoji 1F6BF](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F6BF.png) |
| Stairs | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/stairs.webp` | Vocabulary picture | Person descending stairs. | [OpenMoji E087](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/E087.png) |
| Goggles | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/goggles.webp` | Vocabulary picture | Safety goggles. | [OpenMoji 1F97D](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F97D.png) |
| Helmet | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/helmet.webp` | Vocabulary picture | Bicycle helmet. | [OpenMoji E159](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/E159.png) |
| Bike | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/bike.webp` | Vocabulary picture | Bicycle. | [OpenMoji 1F6B2](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F6B2.png) |
| Skating | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/skating.webp` | Vocabulary picture | Roller skate. | [OpenMoji 1F6FC](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F6FC.png) |
| Sad | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/sad.webp` | Vocabulary picture | Crying face. | [OpenMoji 1F622](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F622.png) |
| Happy | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/happy.webp` | Vocabulary picture | Grinning face. | [OpenMoji 1F600](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F600.png) |
| Scared | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/scared.webp` | Vocabulary picture | Fearful face. | [OpenMoji 1F628](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F628.png) |
| Angry | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/angry.webp` | Vocabulary picture | Angry face. | [OpenMoji 1F620](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F620.png) |
| Surprised | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/surprised.webp` | Vocabulary picture | Face with open mouth. | [OpenMoji 1F62E](https://github.com/hfg-gmuend/openmoji/blob/master/color/72x72/1F62E.png) |

## Supplied vocabulary illustrations — 2026-11-17

Original illustrations supplied by the owner, cropped with transparency and saved as lossless WebP without resizing.

| Word | File | Source |
| --- | --- | --- |
| Joint | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/joint.webp` | Owner-supplied vocabulary illustration |
| Good posture | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/good-posture.webp` | Owner-supplied vocabulary illustration |
| Hairbrush | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/hairbrush.webp` | Owner-supplied vocabulary illustration |
| Fizzy drink | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/fizzy-drink.webp` | Owner-supplied vocabulary illustration |
| Lentils | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/lentils.webp` | Owner-supplied vocabulary illustration |
| Fruits | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/fruits.webp` | Owner-supplied vocabulary illustration |
| Cereals | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/cereals.webp` | Owner-supplied vocabulary illustration |
| Ham | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/ham.webp` | Owner-supplied vocabulary illustration |
| Breakfast | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/breakfast.webp` | Owner-supplied vocabulary illustration |
| An omelette | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/an-omelette.webp` | Owner-supplied vocabulary illustration |

## Supplied vocabulary batch 2 — 2026-11-17

Owner-supplied sheet 1 contains food, hygiene and safety illustrations; sheet 2 contains color swatches and pets. Cropped without resizing, with transparent backgrounds, and converted through `scripts/to-lossless-webp.mjs`.

| Word | File | Source |
| --- | --- | --- |
| Red | `public/vocabulary/english/english-2-b1-s00/colors/red.webp` | Owner-supplied sheet 2 |
| Blue | `public/vocabulary/english/english-2-b1-s00/colors/blue.webp` | Owner-supplied sheet 2 |
| Yellow | `public/vocabulary/english/english-2-b1-s00/colors/yellow.webp` | Owner-supplied sheet 2 |
| Green | `public/vocabulary/english/english-2-b1-s00/colors/green.webp` | Owner-supplied sheet 2 |
| Orange | `public/vocabulary/english/english-2-b1-s00/colors/orange.webp` | Owner-supplied sheet 2 |
| Pink | `public/vocabulary/english/english-2-b1-s00/colors/pink.webp` | Owner-supplied sheet 2 |
| Purple | `public/vocabulary/english/english-2-b1-s00/colors/purple.webp` | Owner-supplied sheet 2 |
| Brown | `public/vocabulary/english/english-2-b1-s00/colors/brown.webp` | Owner-supplied sheet 2 |
| Black | `public/vocabulary/english/english-2-b1-s00/colors/black.webp` | Owner-supplied sheet 2 |
| White | `public/vocabulary/english/english-2-b1-s00/colors/white.webp` | Owner-supplied sheet 2 |
| Grey | `public/vocabulary/english/english-2-b1-s00/colors/grey.webp` | Owner-supplied sheet 2 |
| Light blue | `public/vocabulary/english/english-2-b1-s00/colors/light-blue.webp` | Owner-supplied sheet 2 |
| Dark blue | `public/vocabulary/english/english-2-b1-s00/colors/dark-blue.webp` | Owner-supplied sheet 2 |
| Dog | `public/vocabulary/english/english-2-b1-s00/animals/dog.webp` | Owner-supplied sheet 2 |
| Cat | `public/vocabulary/english/english-2-b1-s00/animals/cat.webp` | Owner-supplied sheet 2 |
| Rabbit | `public/vocabulary/english/english-2-b1-s00/animals/rabbit.webp` | Owner-supplied sheet 2 |
| Hamster | `public/vocabulary/english/english-2-b1-s00/animals/hamster.webp` | Owner-supplied sheet 2 |
| Guinea pig | `public/vocabulary/english/english-2-b1-s00/animals/guinea-pig.webp` | Owner-supplied sheet 2 |
| Fish | `public/vocabulary/english/english-2-b1-s00/animals/fish.webp` | Owner-supplied sheet 2 |
| Bird | `public/vocabulary/english/english-2-b1-s00/animals/bird.webp` | Owner-supplied sheet 2 |
| Parrot | `public/vocabulary/english/english-2-b1-s00/animals/parrot.webp` | Owner-supplied sheet 2 |
| Turtle | `public/vocabulary/english/english-2-b1-s00/animals/turtle.webp` | Owner-supplied sheet 2 |
| Tortoise | `public/vocabulary/english/english-2-b1-s00/animals/tortoise.webp` | Owner-supplied sheet 2 |
| Mouse | `public/vocabulary/english/english-2-b1-s00/animals/mouse.webp` | Owner-supplied sheet 2 |
| Snake | `public/vocabulary/english/english-2-b1-s00/animals/snake.webp` | Owner-supplied sheet 2 |
| Lizard | `public/vocabulary/english/english-2-b1-s00/animals/lizard.webp` | Owner-supplied sheet 2 |
| Puppy | `public/vocabulary/english/english-2-b1-s00/animals/puppy.webp` | Owner-supplied sheet 2 |
| Kitten | `public/vocabulary/english/english-2-b1-s00/animals/kitten.webp` | Owner-supplied sheet 2 |
| Snake | `public/vocabulary/english/english-2-b1-s03/general/snake.webp` | Owner-supplied sheet 2 |
| Swimming pool | `public/vocabulary/english/english-2-b1-s05/general/swimming-pool.webp` | Owner-supplied sheet 1 |
| Towel | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/towel.webp` | Owner-supplied sheet 1 |
| Shampoo | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/shampoo.webp` | Owner-supplied sheet 1 |
| Milkshake | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/milkshake.webp` | Owner-supplied sheet 1 |
| Olive oil | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/olive-oil.webp` | Owner-supplied sheet 1 |
| Vegetables | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/vegetables.webp` | Owner-supplied sheet 1 |
| Yogurt | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/yogurt.webp` | Owner-supplied sheet 1 |
| Omelette | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/omelette.webp` | Owner-supplied sheet 1 |
| Snack | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/snack.webp` | Owner-supplied sheet 1 |
| Natural yogurt | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/natural-yogurt.webp` | Owner-supplied sheet 1 |
| Sockets | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/sockets.webp` | Owner-supplied sheet 1 |
| Swimming pool | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/swimming-pool.webp` | Owner-supplied sheet 1 |

## Supplied Science batch 3 — 2026-11-17

Owner-supplied anatomy, food, hygiene, safety and emotion illustrations, cropped without resizing and converted through `scripts/to-lossless-webp.mjs`. All pre-existing public files are preserved byte for byte, including body-game artwork. Replacements use separate vocabulary paths. Existing custom Apple, Water and Knee pads references are retained; their new supplied variants are saved as alternatives. The provided knee-joint illustration supports both Joints and Knee.

| Word | File | Source |
| --- | --- | --- |
| Body | `public/vocabulary/science/science-2-b2-s01/general/body.webp` | Owner-supplied sheet 1 |
| Breathe in air | `public/vocabulary/science/science-2-b2-s01/general/breathe-in-air.webp` | Owner-supplied sheet 1 |
| Bones | `public/vocabulary/science/science-2-b2-s01/general/bones.webp` | Owner-supplied sheet 1 |
| Joints | `public/vocabulary/science/science-2-b2-s01/general/joints.webp` | Owner-supplied sheet 1 |
| Muscles | `public/vocabulary/science/science-2-b2-s01/general/muscles.webp` | Owner-supplied sheet 2 |
| Skeleton | `public/vocabulary/science/science-2-b2-s01/general/skeleton.webp` | Owner-supplied sheet 2 |
| Skull | `public/vocabulary/science/science-2-b2-s01/general/skull.webp` | Owner-supplied sheet 2 |
| Ribs | `public/vocabulary/science/science-2-b2-s01/general/ribs.webp` | Owner-supplied sheet 2 |
| Elbow | `public/vocabulary/science/science-2-b2-s01/general/elbow.webp` | Owner-supplied sheet 1 |
| Backbone | `public/vocabulary/science/science-2-b2-s01/general/backbone.webp` | Owner-supplied sheet 1 |
| Knee | `public/vocabulary/science/science-2-b2-s01/general/knee.webp` | Owner-supplied sheet 1 |
| Femur | `public/vocabulary/science/science-2-b2-s01/general/femur.webp` | Owner-supplied sheet 1 |
| Ankle | `public/vocabulary/science/science-2-b2-s01/general/ankle.webp` | Owner-supplied sheet 1 |
| Tibia | `public/vocabulary/science/science-2-b2-s01/general/tibia.webp` | Owner-supplied sheet 2 |
| Biceps | `public/vocabulary/science/science-2-b2-s01/general/biceps.webp` | Owner-supplied sheet 1 |
| Pectoral | `public/vocabulary/science/science-2-b2-s01/general/pectoral.webp` | Owner-supplied sheet 2 |
| Gluteus | `public/vocabulary/science/science-2-b2-s01/general/gluteus.webp` | Owner-supplied sheet 1 |
| Abdominals | `public/vocabulary/science/science-2-b2-s01/general/abdominals.webp` | Owner-supplied sheet 1 |
| Calf muscle | `public/vocabulary/science/science-2-b2-s01/general/calf-muscle.webp` | Owner-supplied sheet 1 |
| Nose | `public/vocabulary/science/science-2-b2-s01/general/nose.webp` | Owner-supplied sheet 2 |
| Mouth | `public/vocabulary/science/science-2-b2-s01/general/mouth.webp` | Owner-supplied sheet 2 |
| Trachea | `public/vocabulary/science/science-2-b2-s01/general/trachea.webp` | Owner-supplied sheet 2 |
| Lungs | `public/vocabulary/science/science-2-b2-s01/general/lungs.webp` | Owner-supplied sheet 1 |
| Breathe out | `public/vocabulary/science/science-2-b2-s01/general/breathe-out.webp` | Owner-supplied sheet 1 |
| Breathe in air | `public/vocabulary/science/science-2-b2-s01/general/breathe-in-air.webp` | Owner-supplied sheet 1 |
| Teeth | `public/vocabulary/science/science-2-b2-s01/general/teeth.webp` | Owner-supplied sheet 2 |
| Oesophagus | `public/vocabulary/science/science-2-b2-s01/general/oesophagus.webp` | Owner-supplied sheet 2 |
| Stomach | `public/vocabulary/science/science-2-b2-s01/general/stomach.webp` | Owner-supplied sheet 2 |
| Intestines | `public/vocabulary/science/science-2-b2-s01/general/intestines.webp` | Owner-supplied sheet 1 |
| Anus | `public/vocabulary/science/science-2-b2-s01/general/anus.webp` | Owner-supplied sheet 1 |
| Stone | `public/vocabulary/science/science-2-b2-s01/general/stone.webp` | Owner-supplied sheet 2 |
| Shells | `public/vocabulary/science/science-2-b2-s01/general/shells.webp` | Owner-supplied sheet 2 |
| Walnut | `public/vocabulary/science/science-2-b2-s01/general/walnut.webp` | Owner-supplied sheet 2 |
| Peg | `public/vocabulary/science/science-2-b2-s01/general/peg.webp` | Owner-supplied sheet 2 |
| Body | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/body-supplied.webp` | Owner-supplied sheet 1 |
| Sick person | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/sick-person-supplied.webp` | Owner-supplied sheet 2 |
| Muscles | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/muscles.webp` | Owner-supplied sheet 2 |
| Bones | `public/vocabulary/science/science-2-b2-s02/health-and-the-body/bones-supplied.webp` | Owner-supplied sheet 1 |
| Doctor | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/doctor-supplied.webp` | Owner-supplied sheet 1 |
| Nurse | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/nurse-supplied.webp` | Owner-supplied sheet 2 |
| Medicine | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/medicine-supplied.webp` | Owner-supplied sheet 2 |
| Vaccination | `public/vocabulary/science/science-2-b2-s02/healthcare-and-illnesses/vaccination-supplied.webp` | Owner-supplied sheet 2 |
| Sleep | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/sleep-supplied.webp` | Owner-supplied sheet 2 |
| Back pain | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/back-pain-supplied.webp` | Owner-supplied sheet 1 |
| Toothbrush | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/toothbrush-supplied.webp` | Owner-supplied sheet 2 |
| Soap | `public/vocabulary/science/science-2-b2-s02/healthy-habits-and-hygiene/soap-supplied.webp` | Owner-supplied sheet 2 |
| Milk | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/milk-supplied.webp` | Owner-supplied sheet 2 |
| Lettuce | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/lettuce-supplied.webp` | Owner-supplied sheet 1 |
| Bread | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/bread-supplied.webp` | Owner-supplied sheet 1 |
| Potatoes | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/potatoes-supplied.webp` | Owner-supplied sheet 2 |
| Watermelon | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/watermelon-supplied.webp` | Owner-supplied sheet 2 |
| Tomato | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/tomato-supplied.webp` | Owner-supplied sheet 2 |
| Rice | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/rice-supplied.webp` | Owner-supplied sheet 2 |
| Orange | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/orange-supplied.webp` | Owner-supplied sheet 2 |
| Broccoli | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/broccoli-supplied.webp` | Owner-supplied sheet 1 |
| Pasta | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/pasta-supplied.webp` | Owner-supplied sheet 2 |
| Eggs | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/eggs-supplied.webp` | Owner-supplied sheet 1 |
| Fish | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/fish-supplied.webp` | Owner-supplied sheet 1 |
| Pepper | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/pepper-supplied.webp` | Owner-supplied sheet 2 |
| Meat | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/meat-supplied.webp` | Owner-supplied sheet 2 |
| Banana | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/banana-supplied.webp` | Owner-supplied sheet 1 |
| Cheese | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/cheese-supplied.webp` | Owner-supplied sheet 1 |
| Cake | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/cake-supplied.webp` | Owner-supplied sheet 1 |
| Chips | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/chips-supplied.webp` | Owner-supplied sheet 1 |
| Pear | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/pear-supplied.webp` | Owner-supplied sheet 2 |
| Sandwich | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/sandwich-supplied.webp` | Owner-supplied sheet 2 |
| Soup | `public/vocabulary/science/science-2-b2-s02/food-and-drinks/soup-supplied.webp` | Owner-supplied sheet 2 |
| Glass of milk | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/glass-of-milk.webp` | Owner-supplied sheet 1 |
| Ham and cheese sandwich | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/ham-and-cheese-sandwich.webp` | Owner-supplied sheet 1 |
| Hamburger | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/hamburger-supplied.webp` | Owner-supplied sheet 1 |
| A piece of cake | `public/vocabulary/science/science-2-b2-s02/meals-and-menus/a-piece-of-cake-supplied.webp` | Owner-supplied sheet 1 |
| Electric cables | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/electric-cables-supplied.webp` | Owner-supplied sheet 1 |
| Shower | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/shower-supplied.webp` | Owner-supplied sheet 2 |
| Stairs | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/stairs-supplied.webp` | Owner-supplied sheet 2 |
| Goggles | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/goggles-supplied.webp` | Owner-supplied sheet 1 |
| Helmet | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/helmet-supplied.webp` | Owner-supplied sheet 1 |
| Bike | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/bike-supplied.webp` | Owner-supplied sheet 1 |
| Skating | `public/vocabulary/science/science-2-b2-s02/accidents-and-safety/skating-supplied.webp` | Owner-supplied sheet 2 |
| Sad | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/sad-supplied.webp` | Owner-supplied sheet 2 |
| Happy | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/happy-supplied.webp` | Owner-supplied sheet 1 |
| Scared | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/scared-supplied.webp` | Owner-supplied sheet 2 |
| Angry | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/angry-supplied.webp` | Owner-supplied sheet 1 |
| Surprised | `public/vocabulary/science/science-2-b2-s02/feelings-and-emotions/surprised-supplied.webp` | Owner-supplied sheet 2 |
| Knee pads | `public/vocabulary/science/supplied/knee-pads.webp` | Owner-supplied sheet 1; alternative, existing custom reference retained |
| Water | `public/vocabulary/science/supplied/water.webp` | Owner-supplied sheet 2; alternative, existing custom reference retained |
| Apple | `public/vocabulary/science/supplied/apple.webp` | Owner-supplied sheet 1; alternative, existing custom reference retained |

## My Little Friend portraits

The following lossless WebP crops use the owner-supplied My Avatar reference. The Little Dragon uses the existing homepage artwork.

| Public file | Character |
| --- | --- |
| `public/myfriend/water-creature.webp` | Water Creature |
| `public/myfriend/kitten.webp` | Kitten |
| `public/myfriend/fairy.webp` | Fairy |
| `public/myfriend/fox.webp` | Fox |
| `public/myfriend/panda.webp` | Panda |
| `public/myfriend/unicorn.webp` | Unicorn |
| `public/myfriend/dog.webp` | Dog |
| `public/myfriend/griffin.webp` | Griffin |
| `public/myfriend/dino.webp` | Dino |

## British English vocabulary audio

Generated with Piper and the [Cori high voice model](https://huggingface.co/rhasspy/piper-voices/blob/main/en/en_GB/cori/high/MODEL_CARD) at a slightly faster pace. The model card identifies [LibriVox](https://librivox.org/) public-domain recordings as the voice source. Speaker credit: Cori Samuel.

| Public file | Vocabulary |
| --- | --- |
| `public/audio/en-gb/autumn.mp3` | autumn |
| `public/audio/en-gb/water.mp3` | water |
| `public/audio/en-gb/helmet.mp3` | helmet |
| `public/audio/en-gb/knee-pads.mp3` | knee pads |
| `public/audio/en-gb/ride-a-bike.mp3` | ride a bike |
| `public/audio/en-gb/read-a-book.mp3` | read a book |
| `public/audio/en-gb/doctor.mp3` | doctor |
| `public/audio/en-gb/nurse.mp3` | nurse |
| `public/audio/en-gb/apple.mp3` | apple |
| `public/audio/en-gb/banana.mp3` | banana |
| `public/audio/en-gb/orange.mp3` | orange |
| `public/audio/en-gb/football.mp3` | football |
| `public/audio/en-gb/swimming.mp3` | swimming |
| `public/audio/en-gb/scared.mp3` | scared |
| `public/audio/en-gb/happy.mp3` | happy |
| `public/audio/en-gb/rainy.mp3` | rainy |
| `public/audio/en-gb/sunny.mp3` | sunny |
| `public/audio/en-gb/windy.mp3` | windy |
| `public/audio/en-gb/broccoli.mp3` | broccoli |
| `public/audio/en-gb/vaccination.mp3` | vaccination |
| `public/audio/en-gb/a-piece-of-cake.mp3` | a piece of cake |
| `public/audio/en-gb/abdominals.mp3` | abdominals |
| `public/audio/en-gb/accident-prevention.mp3` | accident prevention |
| `public/audio/en-gb/accident.mp3` | accident |
| `public/audio/en-gb/accidents.mp3` | accidents |
| `public/audio/en-gb/adequate-quantities.mp3` | adequate quantities |
| `public/audio/en-gb/after-every-meal.mp3` | after every meal |
| `public/audio/en-gb/all-the-time.mp3` | all the time |
| `public/audio/en-gb/almost-never.mp3` | almost never |
| `public/audio/en-gb/an-omelette.mp3` | an omelette |
| `public/audio/en-gb/angry.mp3` | angry |
| `public/audio/en-gb/ankle.mp3` | ankle |
| `public/audio/en-gb/anus.mp3` | anus |
| `public/audio/en-gb/at-home.mp3` | at home |
| `public/audio/en-gb/aunt.mp3` | aunt |
| `public/audio/en-gb/baby.mp3` | baby |
| `public/audio/en-gb/back-pain.mp3` | back pain |
| `public/audio/en-gb/backbone.mp3` | backbone |
| `public/audio/en-gb/badminton.mp3` | badminton |
| `public/audio/en-gb/bag.mp3` | bag |
| `public/audio/en-gb/balanced-diet.mp3` | balanced diet |
| `public/audio/en-gb/balcony.mp3` | balcony |
| `public/audio/en-gb/baseball.mp3` | baseball |
| `public/audio/en-gb/basketball.mp3` | basketball |
| `public/audio/en-gb/bat.mp3` | bat |
| `public/audio/en-gb/be-careful.mp3` | be careful |
| `public/audio/en-gb/beach.mp3` | beach |
| `public/audio/en-gb/beak.mp3` | beak |
| `public/audio/en-gb/bear.mp3` | bear |
| `public/audio/en-gb/bend.mp3` | bend |
| `public/audio/en-gb/biceps.mp3` | biceps |
| `public/audio/en-gb/bike.mp3` | bike |
| `public/audio/en-gb/bird.mp3` | bird |
| `public/audio/en-gb/black.mp3` | black |
| `public/audio/en-gb/blue.mp3` | blue |
| `public/audio/en-gb/body.mp3` | body |
| `public/audio/en-gb/bones.mp3` | bones |
| `public/audio/en-gb/bored.mp3` | bored |
| `public/audio/en-gb/brazil.mp3` | brazil |
| `public/audio/en-gb/bread.mp3` | bread |
| `public/audio/en-gb/breakfast.mp3` | breakfast |
| `public/audio/en-gb/breathe-in-air.mp3` | breathe in air |
| `public/audio/en-gb/breathe-out.mp3` | breathe out |
| `public/audio/en-gb/brother.mp3` | brother |
| `public/audio/en-gb/brown.mp3` | brown |
| `public/audio/en-gb/brush-our-teeth.mp3` | brush our teeth |
| `public/audio/en-gb/bus.mp3` | bus |
| `public/audio/en-gb/cafe.mp3` | café |
| `public/audio/en-gb/cake.mp3` | cake |
| `public/audio/en-gb/calf-muscle.mp3` | calf muscle |
| `public/audio/en-gb/calm-down.mp3` | calm down |
| `public/audio/en-gb/camera.mp3` | camera |
| `public/audio/en-gb/canada.mp3` | canada |
| `public/audio/en-gb/car.mp3` | car |
| `public/audio/en-gb/cat.mp3` | cat |
| `public/audio/en-gb/cereals-pasta-and-potatoes.mp3` | cereals, pasta and potatoes |
| `public/audio/en-gb/cereals.mp3` | cereals |
| `public/audio/en-gb/check-up.mp3` | check-up |
| `public/audio/en-gb/cheese.mp3` | cheese |
| `public/audio/en-gb/chickenpox.mp3` | chickenpox |
| `public/audio/en-gb/children.mp3` | children |
| `public/audio/en-gb/china.mp3` | china |
| `public/audio/en-gb/chips.mp3` | chips |
| `public/audio/en-gb/cinema.mp3` | cinema |
| `public/audio/en-gb/climb.mp3` | climb |
| `public/audio/en-gb/cloudy.mp3` | cloudy |
| `public/audio/en-gb/coconut.mp3` | coconut |
| `public/audio/en-gb/cold.mp3` | cold |
| `public/audio/en-gb/collect-shells.mp3` | collect shells |
| `public/audio/en-gb/control-them.mp3` | control them |
| `public/audio/en-gb/countryside.mp3` | countryside |
| `public/audio/en-gb/cousin.mp3` | cousin |
| `public/audio/en-gb/covid-19.mp3` | covid-19 |
| `public/audio/en-gb/crocodile.mp3` | crocodile |
| `public/audio/en-gb/cross.mp3` | cross |
| `public/audio/en-gb/crossing.mp3` | crossing |
| `public/audio/en-gb/cycling.mp3` | cycling |
| `public/audio/en-gb/daily-menu.mp3` | daily menu |
| `public/audio/en-gb/dairy-products.mp3` | dairy products |
| `public/audio/en-gb/dance.mp3` | dance |
| `public/audio/en-gb/dancing.mp3` | dancing |
| `public/audio/en-gb/dark-blue.mp3` | dark blue |
| `public/audio/en-gb/daughter.mp3` | daughter |
| `public/audio/en-gb/different-feelings.mp3` | different feelings |
| `public/audio/en-gb/digestive-system.mp3` | digestive system |
| `public/audio/en-gb/dinner.mp3` | dinner |
| `public/audio/en-gb/dog.mp3` | dog |
| `public/audio/en-gb/donkey.mp3` | donkey |
| `public/audio/en-gb/door.mp3` | door |
| `public/audio/en-gb/draw-a-picture.mp3` | draw a picture |
| `public/audio/en-gb/draw-in-the-sand.mp3` | draw in the sand |
| `public/audio/en-gb/drink-plenty-of-water.mp3` | drink plenty of water |
| `public/audio/en-gb/dry.mp3` | dry |
| `public/audio/en-gb/eagle.mp3` | eagle |
| `public/audio/en-gb/ears.mp3` | ears |
| `public/audio/en-gb/eat-five-meals-a-day.mp3` | eat five meals a day |
| `public/audio/en-gb/eggs.mp3` | eggs |
| `public/audio/en-gb/eight.mp3` | eight |
| `public/audio/en-gb/eighteen.mp3` | eighteen |
| `public/audio/en-gb/eighty.mp3` | eighty |
| `public/audio/en-gb/elastic.mp3` | elastic |
| `public/audio/en-gb/elbow-pads.mp3` | elbow pads |
| `public/audio/en-gb/elbow.mp3` | elbow |
| `public/audio/en-gb/electric-cables.mp3` | electric cables |
| `public/audio/en-gb/elephant.mp3` | elephant |
| `public/audio/en-gb/eleven.mp3` | eleven |
| `public/audio/en-gb/emotional-problems.mp3` | emotional problems |
| `public/audio/en-gb/emotionally.mp3` | emotionally |
| `public/audio/en-gb/energy.mp3` | energy |
| `public/audio/en-gb/every-day.mp3` | every day |
| `public/audio/en-gb/every-night.mp3` | every night |
| `public/audio/en-gb/excited.mp3` | excited |
| `public/audio/en-gb/exercise-and-sport.mp3` | exercise and sport |
| `public/audio/en-gb/exercise.mp3` | exercise |
| `public/audio/en-gb/fall.mp3` | fall |
| `public/audio/en-gb/father-dad.mp3` | father / dad |
| `public/audio/en-gb/father.mp3` | father |
| `public/audio/en-gb/favourite-food.mp3` | favourite food |
| `public/audio/en-gb/feel-better.mp3` | feel better |
| `public/audio/en-gb/feel-good.mp3` | feel good |
| `public/audio/en-gb/feelings.mp3` | feelings |
| `public/audio/en-gb/femur.mp3` | femur |
| `public/audio/en-gb/fibre.mp3` | fibre |
| `public/audio/en-gb/fifteen.mp3` | fifteen |
| `public/audio/en-gb/fifty.mp3` | fifty |
| `public/audio/en-gb/fish.mp3` | fish |
| `public/audio/en-gb/five-meals-a-day.mp3` | five meals a day |
| `public/audio/en-gb/five.mp3` | five |
| `public/audio/en-gb/fizzy-drink.mp3` | fizzy drink |
| `public/audio/en-gb/fizzy-drinks.mp3` | fizzy drinks |
| `public/audio/en-gb/floor.mp3` | floor |
| `public/audio/en-gb/flu.mp3` | flu |
| `public/audio/en-gb/fly-a-kite.mp3` | fly a kite |
| `public/audio/en-gb/foggy.mp3` | foggy |
| `public/audio/en-gb/food-groups.mp3` | food groups |
| `public/audio/en-gb/food-portions.mp3` | food portions |
| `public/audio/en-gb/food.mp3` | food |
| `public/audio/en-gb/forest.mp3` | forest |
| `public/audio/en-gb/forty.mp3` | forty |
| `public/audio/en-gb/four-times-a-week.mp3` | four times a week |
| `public/audio/en-gb/four.mp3` | four |
| `public/audio/en-gb/fourteen.mp3` | fourteen |
| `public/audio/en-gb/fox.mp3` | fox |
| `public/audio/en-gb/fresh-foods.mp3` | fresh foods |
| `public/audio/en-gb/friday.mp3` | friday |
| `public/audio/en-gb/fruits-and-vegetables.mp3` | fruits and vegetables |
| `public/audio/en-gb/fruits.mp3` | fruits |
| `public/audio/en-gb/fur.mp3` | fur |
| `public/audio/en-gb/garden.mp3` | garden |
| `public/audio/en-gb/germs.mp3` | germs |
| `public/audio/en-gb/giraffe.mp3` | giraffe |
| `public/audio/en-gb/glass-of-milk.mp3` | glass of milk |
| `public/audio/en-gb/glasses.mp3` | glasses |
| `public/audio/en-gb/gloves.mp3` | gloves |
| `public/audio/en-gb/gluteus.mp3` | gluteus |
| `public/audio/en-gb/go-cycling.mp3` | go cycling |
| `public/audio/en-gb/go-swimming.mp3` | go swimming |
| `public/audio/en-gb/go-to-the-cinema.mp3` | go to the cinema |
| `public/audio/en-gb/goggles.mp3` | goggles |
| `public/audio/en-gb/good-posture.mp3` | good posture |
| `public/audio/en-gb/grandfather-grandpa.mp3` | grandfather / grandpa |
| `public/audio/en-gb/grandma.mp3` | grandma |
| `public/audio/en-gb/grandmother-grandma.mp3` | grandmother / grandma |
| `public/audio/en-gb/grandpa.mp3` | grandpa |
| `public/audio/en-gb/grandparents.mp3` | grandparents |
| `public/audio/en-gb/green.mp3` | green |
| `public/audio/en-gb/grey.mp3` | grey |
| `public/audio/en-gb/grow.mp3` | grow |
| `public/audio/en-gb/guinea-pig.mp3` | guinea pig |
| `public/audio/en-gb/hairbrush.mp3` | hairbrush |
| `public/audio/en-gb/ham-and-cheese-sandwich.mp3` | ham and cheese sandwich |
| `public/audio/en-gb/ham.mp3` | ham |
| `public/audio/en-gb/hamburger.mp3` | hamburger |
| `public/audio/en-gb/hamster.mp3` | hamster |
| `public/audio/en-gb/have-a-picnic.mp3` | have a picnic |
| `public/audio/en-gb/have-regular-showers.mp3` | have regular showers |
| `public/audio/en-gb/headphones.mp3` | headphones |
| `public/audio/en-gb/health-centre.mp3` | health centre |
| `public/audio/en-gb/health-centres.mp3` | health centres |
| `public/audio/en-gb/health.mp3` | health |
| `public/audio/en-gb/healthcare-workers.mp3` | healthcare workers |
| `public/audio/en-gb/healthy-breakfast.mp3` | healthy breakfast |
| `public/audio/en-gb/healthy-diet.mp3` | healthy diet |
| `public/audio/en-gb/healthy-habits.mp3` | healthy habits |
| `public/audio/en-gb/healthy-meal.mp3` | healthy meal |
| `public/audio/en-gb/healthy.mp3` | healthy |
| `public/audio/en-gb/hearing.mp3` | hearing |
| `public/audio/en-gb/helicopter.mp3` | helicopter |
| `public/audio/en-gb/help-us-to-grow.mp3` | help us to grow |
| `public/audio/en-gb/hers.mp3` | hers |
| `public/audio/en-gb/his.mp3` | his |
| `public/audio/en-gb/hockey.mp3` | hockey |
| `public/audio/en-gb/home.mp3` | home |
| `public/audio/en-gb/hot.mp3` | hot |
| `public/audio/en-gb/house.mp3` | house |
| `public/audio/en-gb/hungry.mp3` | hungry |
| `public/audio/en-gb/hygiene.mp3` | hygiene |
| `public/audio/en-gb/ice-lollies.mp3` | ice lollies |
| `public/audio/en-gb/icy.mp3` | icy |
| `public/audio/en-gb/illness.mp3` | illness |
| `public/audio/en-gb/illnesses.mp3` | illnesses |
| `public/audio/en-gb/intestines.mp3` | intestines |
| `public/audio/en-gb/joint.mp3` | joint |
| `public/audio/en-gb/joints.mp3` | joints |
| `public/audio/en-gb/keep-healthy.mp3` | keep healthy |
| `public/audio/en-gb/kitten.mp3` | kitten |
| `public/audio/en-gb/kiwi.mp3` | kiwi |
| `public/audio/en-gb/knee.mp3` | knee |
| `public/audio/en-gb/lake.mp3` | lake |
| `public/audio/en-gb/last-night.mp3` | last night |
| `public/audio/en-gb/last-weekend.mp3` | last weekend |
| `public/audio/en-gb/lentils.mp3` | lentils |
| `public/audio/en-gb/lettuce.mp3` | lettuce |
| `public/audio/en-gb/life-processes.mp3` | life processes |
| `public/audio/en-gb/lift.mp3` | lift |
| `public/audio/en-gb/light-blue.mp3` | light blue |
| `public/audio/en-gb/lime.mp3` | lime |
| `public/audio/en-gb/lizard.mp3` | lizard |
| `public/audio/en-gb/look-after-our-body.mp3` | look after our body |
| `public/audio/en-gb/look-for-fish.mp3` | look for fish |
| `public/audio/en-gb/look.mp3` | look |
| `public/audio/en-gb/lorry.mp3` | lorry |
| `public/audio/en-gb/lunch.mp3` | lunch |
| `public/audio/en-gb/lungs.mp3` | lungs |
| `public/audio/en-gb/main-meals.mp3` | main meals |
| `public/audio/en-gb/make-a-sandcastle.mp3` | make a sandcastle |
| `public/audio/en-gb/mango.mp3` | mango |
| `public/audio/en-gb/mat.mp3` | mat |
| `public/audio/en-gb/meat-fish-eggs-dairy-products-and-pulses.mp3` | meat, fish, eggs, dairy products and pulses |
| `public/audio/en-gb/meat.mp3` | meat |
| `public/audio/en-gb/medicine.mp3` | medicine |
| `public/audio/en-gb/medicines.mp3` | medicines |
| `public/audio/en-gb/mexico.mp3` | mexico |
| `public/audio/en-gb/milk.mp3` | milk |
| `public/audio/en-gb/milkshake.mp3` | milkshake |
| `public/audio/en-gb/mine.mp3` | mine |
| `public/audio/en-gb/mobile-phone.mp3` | mobile phone |
| `public/audio/en-gb/monday.mp3` | monday |
| `public/audio/en-gb/monkey.mp3` | monkey |
| `public/audio/en-gb/mother-mum.mp3` | mother / mum |
| `public/audio/en-gb/mother.mp3` | mother |
| `public/audio/en-gb/motorbike.mp3` | motorbike |
| `public/audio/en-gb/mountain.mp3` | mountain |
| `public/audio/en-gb/mouse.mp3` | mouse |
| `public/audio/en-gb/mouth.mp3` | mouth |
| `public/audio/en-gb/muscles.mp3` | muscles |
| `public/audio/en-gb/natural-yogurt.mp3` | natural yogurt |
| `public/audio/en-gb/neck.mp3` | neck |
| `public/audio/en-gb/never.mp3` | never |
| `public/audio/en-gb/new-zealand.mp3` | new zealand |
| `public/audio/en-gb/nine.mp3` | nine |
| `public/audio/en-gb/nineteen.mp3` | nineteen |
| `public/audio/en-gb/ninety.mp3` | ninety |
| `public/audio/en-gb/nose.mp3` | nose |
| `public/audio/en-gb/nutrients.mp3` | nutrients |
| `public/audio/en-gb/nutrition.mp3` | nutrition |
| `public/audio/en-gb/objects.mp3` | objects |
| `public/audio/en-gb/occasionally.mp3` | occasionally |
| `public/audio/en-gb/oesophagus.mp3` | oesophagus |
| `public/audio/en-gb/olive-oil.mp3` | olive oil |
| `public/audio/en-gb/omelette.mp3` | omelette |
| `public/audio/en-gb/one-hundred.mp3` | one hundred |
| `public/audio/en-gb/one.mp3` | one |
| `public/audio/en-gb/ours.mp3` | ours |
| `public/audio/en-gb/outdoors.mp3` | outdoors |
| `public/audio/en-gb/paint-pictures.mp3` | paint pictures |
| `public/audio/en-gb/parents.mp3` | parents |
| `public/audio/en-gb/parrot.mp3` | parrot |
| `public/audio/en-gb/pasta.mp3` | pasta |
| `public/audio/en-gb/pear.mp3` | pear |
| `public/audio/en-gb/pectoral.mp3` | pectoral |
| `public/audio/en-gb/peg.mp3` | peg |
| `public/audio/en-gb/pepper.mp3` | pepper |
| `public/audio/en-gb/physically.mp3` | physically |
| `public/audio/en-gb/picture.mp3` | picture |
| `public/audio/en-gb/pineapple.mp3` | pineapple |
| `public/audio/en-gb/pink.mp3` | pink |
| `public/audio/en-gb/plane.mp3` | plane |
| `public/audio/en-gb/plant-flowers.mp3` | plant flowers |
| `public/audio/en-gb/play-basketball.mp3` | play basketball |
| `public/audio/en-gb/play-board-games.mp3` | play board games |
| `public/audio/en-gb/play-volleyball.mp3` | play volleyball |
| `public/audio/en-gb/poland.mp3` | poland |
| `public/audio/en-gb/posture.mp3` | posture |
| `public/audio/en-gb/potatoes.mp3` | potatoes |
| `public/audio/en-gb/powerful-mind.mp3` | powerful mind |
| `public/audio/en-gb/prescribes.mp3` | prescribes |
| `public/audio/en-gb/protection.mp3` | protection |
| `public/audio/en-gb/protective-equipment.mp3` | protective equipment |
| `public/audio/en-gb/provide-energy.mp3` | provide energy |
| `public/audio/en-gb/provide-vitamins-and-fibre.mp3` | provide vitamins and fibre |
| `public/audio/en-gb/psychologist.mp3` | psychologist |
| `public/audio/en-gb/pulses.mp3` | pulses |
| `public/audio/en-gb/puppy.mp3` | puppy |
| `public/audio/en-gb/purple.mp3` | purple |
| `public/audio/en-gb/rabbit.mp3` | rabbit |
| `public/audio/en-gb/racket.mp3` | racket |
| `public/audio/en-gb/read-comics.mp3` | read comics |
| `public/audio/en-gb/red.mp3` | red |
| `public/audio/en-gb/reproduction.mp3` | reproduction |
| `public/audio/en-gb/rest.mp3` | rest |
| `public/audio/en-gb/restaurant.mp3` | restaurant |
| `public/audio/en-gb/ribs.mp3` | ribs |
| `public/audio/en-gb/rice.mp3` | rice |
| `public/audio/en-gb/rigid.mp3` | rigid |
| `public/audio/en-gb/river.mp3` | river |
| `public/audio/en-gb/road-safety-rules.mp3` | road safety rules |
| `public/audio/en-gb/road-sign.mp3` | road sign |
| `public/audio/en-gb/roof.mp3` | roof |
| `public/audio/en-gb/rugby.mp3` | rugby |
| `public/audio/en-gb/run.mp3` | run |
| `public/audio/en-gb/sad.mp3` | sad |
| `public/audio/en-gb/safety-rules.mp3` | safety rules |
| `public/audio/en-gb/sand.mp3` | sand |
| `public/audio/en-gb/sandals.mp3` | sandals |
| `public/audio/en-gb/sandcastle.mp3` | sandcastle |
| `public/audio/en-gb/sandwich.mp3` | sandwich |
| `public/audio/en-gb/saturday.mp3` | saturday |
| `public/audio/en-gb/sea.mp3` | sea |
| `public/audio/en-gb/seat-belt.mp3` | seat belt |
| `public/audio/en-gb/sense-organ.mp3` | sense organ |
| `public/audio/en-gb/senses.mp3` | senses |
| `public/audio/en-gb/sensitivity.mp3` | sensitivity |
| `public/audio/en-gb/seven.mp3` | seven |
| `public/audio/en-gb/seventeen.mp3` | seventeen |
| `public/audio/en-gb/seventy.mp3` | seventy |
| `public/audio/en-gb/shampoo.mp3` | shampoo |
| `public/audio/en-gb/shells.mp3` | shells |
| `public/audio/en-gb/shopping-centre.mp3` | shopping centre |
| `public/audio/en-gb/shower.mp3` | shower |
| `public/audio/en-gb/sick-person.mp3` | sick person |
| `public/audio/en-gb/sight.mp3` | sight |
| `public/audio/en-gb/sing.mp3` | sing |
| `public/audio/en-gb/sister.mp3` | sister |
| `public/audio/en-gb/six.mp3` | six |
| `public/audio/en-gb/sixteen.mp3` | sixteen |
| `public/audio/en-gb/sixty.mp3` | sixty |
| `public/audio/en-gb/skateboarding.mp3` | skateboarding |
| `public/audio/en-gb/skating.mp3` | skating |
| `public/audio/en-gb/skeleton.mp3` | skeleton |
| `public/audio/en-gb/skull.mp3` | skull |
| `public/audio/en-gb/sleep-10-hours.mp3` | sleep 10 hours |
| `public/audio/en-gb/sleep.mp3` | sleep |
| `public/audio/en-gb/sleepy.mp3` | sleepy |
| `public/audio/en-gb/slip.mp3` | slip |
| `public/audio/en-gb/smell.mp3` | smell |
| `public/audio/en-gb/snack.mp3` | snack |
| `public/audio/en-gb/snake.mp3` | snake |
| `public/audio/en-gb/snowy.mp3` | snowy |
| `public/audio/en-gb/soap.mp3` | soap |
| `public/audio/en-gb/sockets.mp3` | sockets |
| `public/audio/en-gb/sometimes.mp3` | sometimes |
| `public/audio/en-gb/son.mp3` | son |
| `public/audio/en-gb/soup.mp3` | soup |
| `public/audio/en-gb/spain.mp3` | spain |
| `public/audio/en-gb/sport.mp3` | sport |
| `public/audio/en-gb/sports-centre.mp3` | sports centre |
| `public/audio/en-gb/spring.mp3` | spring |
| `public/audio/en-gb/stage-of-life.mp3` | stage of life |
| `public/audio/en-gb/stairs.mp3` | stairs |
| `public/audio/en-gb/stomach.mp3` | stomach |
| `public/audio/en-gb/stone.mp3` | stone |
| `public/audio/en-gb/stop.mp3` | stop |
| `public/audio/en-gb/stormy.mp3` | stormy |
| `public/audio/en-gb/straight-back.mp3` | straight back |
| `public/audio/en-gb/strong-muscles-and-bones.mp3` | strong muscles and bones |
| `public/audio/en-gb/strong-muscles.mp3` | strong muscles |
| `public/audio/en-gb/substances.mp3` | substances |
| `public/audio/en-gb/sugary-foods.mp3` | sugary foods |
| `public/audio/en-gb/summer.mp3` | summer |
| `public/audio/en-gb/sunday.mp3` | sunday |
| `public/audio/en-gb/supermarket.mp3` | supermarket |
| `public/audio/en-gb/surprised.mp3` | surprised |
| `public/audio/en-gb/swan.mp3` | swan |
| `public/audio/en-gb/swim-in-the-sea.mp3` | swim in the sea |
| `public/audio/en-gb/swimming-pool.mp3` | swimming pool |
| `public/audio/en-gb/table-tennis.mp3` | table tennis |
| `public/audio/en-gb/tablet.mp3` | tablet |
| `public/audio/en-gb/tail.mp3` | tail |
| `public/audio/en-gb/take-in-food.mp3` | take in food |
| `public/audio/en-gb/taste.mp3` | taste |
| `public/audio/en-gb/teeth.mp3` | teeth |
| `public/audio/en-gb/ten.mp3` | ten |
| `public/audio/en-gb/tennis.mp3` | tennis |
| `public/audio/en-gb/theirs.mp3` | theirs |
| `public/audio/en-gb/thirsty.mp3` | thirsty |
| `public/audio/en-gb/thirteen.mp3` | thirteen |
| `public/audio/en-gb/thirty.mp3` | thirty |
| `public/audio/en-gb/three-meals-a-day.mp3` | three meals a day |
| `public/audio/en-gb/three-times-a-day.mp3` | three times a day |
| `public/audio/en-gb/three.mp3` | three |
| `public/audio/en-gb/thursday.mp3` | thursday |
| `public/audio/en-gb/tibia.mp3` | tibia |
| `public/audio/en-gb/tidy-up.mp3` | tidy up |
| `public/audio/en-gb/tired.mp3` | tired |
| `public/audio/en-gb/today.mp3` | today |
| `public/audio/en-gb/tomato.mp3` | tomato |
| `public/audio/en-gb/tomorrow.mp3` | tomorrow |
| `public/audio/en-gb/toothbrush.mp3` | toothbrush |
| `public/audio/en-gb/tortoise.mp3` | tortoise |
| `public/audio/en-gb/touch.mp3` | touch |
| `public/audio/en-gb/towel.mp3` | towel |
| `public/audio/en-gb/towels.mp3` | towels |
| `public/audio/en-gb/trachea.mp3` | trachea |
| `public/audio/en-gb/traffic-lights.mp3` | traffic lights |
| `public/audio/en-gb/traffic.mp3` | traffic |
| `public/audio/en-gb/train-station.mp3` | train station |
| `public/audio/en-gb/train.mp3` | train |
| `public/audio/en-gb/tuesday.mp3` | tuesday |
| `public/audio/en-gb/turtle.mp3` | turtle |
| `public/audio/en-gb/twelve.mp3` | twelve |
| `public/audio/en-gb/twenty.mp3` | twenty |
| `public/audio/en-gb/twice-a-day.mp3` | twice a day |
| `public/audio/en-gb/twice-a-week.mp3` | twice a week |
| `public/audio/en-gb/two.mp3` | two |
| `public/audio/en-gb/uncle.mp3` | uncle |
| `public/audio/en-gb/understand.mp3` | understand |
| `public/audio/en-gb/united-kingdom.mp3` | united kingdom |
| `public/audio/en-gb/usa.mp3` | usa |
| `public/audio/en-gb/vaccinations.mp3` | vaccinations |
| `public/audio/en-gb/vaccines.mp3` | vaccines |
| `public/audio/en-gb/variety-of-foods.mp3` | variety of foods |
| `public/audio/en-gb/vegetables.mp3` | vegetables |
| `public/audio/en-gb/visited-grandparents.mp3` | visited grandparents |
| `public/audio/en-gb/vitamin.mp3` | vitamin |
| `public/audio/en-gb/vitamins.mp3` | vitamins |
| `public/audio/en-gb/walk-the-dog.mp3` | walk the dog |
| `public/audio/en-gb/walk.mp3` | walk |
| `public/audio/en-gb/walnut.mp3` | walnut |
| `public/audio/en-gb/wash-our-hands.mp3` | wash our hands |
| `public/audio/en-gb/watch.mp3` | watch |
| `public/audio/en-gb/watermelon.mp3` | watermelon |
| `public/audio/en-gb/waves.mp3` | waves |
| `public/audio/en-gb/wear-protection.mp3` | wear protection |
| `public/audio/en-gb/wednesday.mp3` | wednesday |
| `public/audio/en-gb/weekend.mp3` | weekend |
| `public/audio/en-gb/weekly-menu.mp3` | weekly menu |
| `public/audio/en-gb/went-swimming.mp3` | went swimming |
| `public/audio/en-gb/went-to-the-cinema.mp3` | went to the cinema |
| `public/audio/en-gb/wet.mp3` | wet |
| `public/audio/en-gb/white.mp3` | white |
| `public/audio/en-gb/wholegrain-foods.mp3` | wholegrain foods |
| `public/audio/en-gb/wholegrain-toast.mp3` | wholegrain toast |
| `public/audio/en-gb/wholegrains.mp3` | wholegrains |
| `public/audio/en-gb/windows.mp3` | windows |
| `public/audio/en-gb/wings.mp3` | wings |
| `public/audio/en-gb/winter.mp3` | winter |
| `public/audio/en-gb/worried.mp3` | worried |
| `public/audio/en-gb/yellow.mp3` | yellow |
| `public/audio/en-gb/yesterday.mp3` | yesterday |
| `public/audio/en-gb/yogurt.mp3` | yogurt |
| `public/audio/en-gb/yours.mp3` | yours |
| `public/audio/en-gb/zebra.mp3` | zebra |
