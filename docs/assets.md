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

## British English vocabulary audio pilot

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
