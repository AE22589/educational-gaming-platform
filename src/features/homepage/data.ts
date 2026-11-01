export interface BilingualText {
  readonly english: string;
  readonly spanish: string;
}

export type ExistingHomepageRoute = "/shop" | "/avatar";
export type WorldId = "science" | "english" | "avatar" | "map";

export type HomepageDestination =
  | { readonly status: "available"; readonly href: ExistingHomepageRoute }
  | { readonly status: "coming-soon" };

export interface HeaderNavigationItem {
  readonly id: string;
  readonly icon: string;
  readonly label: BilingualText;
  readonly destination: HomepageDestination;
}

export interface LearningWorldCardData {
  readonly id: WorldId;
  readonly icon: string;
  readonly title: BilingualText;
  readonly description: string;
  readonly action: BilingualText;
  readonly destination: HomepageDestination;
}

export interface MissionPreviewData {
  readonly id: string;
  readonly icon: string;
  readonly title: BilingualText;
  readonly category: BilingualText;
  readonly reward: number;
  readonly progress: { readonly current: number; readonly total: number };
}

export interface CollectionItemData {
  readonly id: string;
  readonly icon: string;
  readonly label: BilingualText;
}

export interface HomepageSampleData {
  readonly navigation: readonly HeaderNavigationItem[];
  readonly welcome: { readonly title: BilingualText; readonly subtitle: BilingualText };
  readonly sampleStarBalance: number;
  readonly worlds: readonly LearningWorldCardData[];
  readonly missions: readonly MissionPreviewData[];
  readonly starProgress: {
    readonly current: number;
    readonly target: number;
    readonly remaining: number;
  };
  readonly collection: readonly CollectionItemData[];
}

export const comingSoonLabel: BilingualText = {
  english: "Coming soon",
  spanish: "Próximamente",
};

// Demonstration content for DEV-02. Replace through a future profile/content integration.
export const homepageSampleData = {
  navigation: [
    { id: "profile", icon: "👤", label: { english: "My Profile", spanish: "Mi perfil" }, destination: { status: "coming-soon" } },
    { id: "science", icon: "🔬", label: { english: "Science", spanish: "Ciencias" }, destination: { status: "coming-soon" } },
    { id: "english", icon: "🔤", label: { english: "English", spanish: "Inglés" }, destination: { status: "coming-soon" } },
    { id: "shop", icon: "⭐", label: { english: "Star Shop", spanish: "Tienda de estrellas" }, destination: { status: "available", href: "/shop" } },
    { id: "map", icon: "🗺️", label: { english: "Adventure Map", spanish: "Mapa de aventuras" }, destination: { status: "coming-soon" } },
  ],
  welcome: {
    title: { english: "Hello, Explorer!", spanish: "¡Hola, explorador!" },
    subtitle: { english: "Ready for today’s adventure?", spanish: "¿Preparado para la aventura de hoy?" },
  },
  sampleStarBalance: 125,
  worlds: [
    { id: "science", icon: "🔬", title: { english: "Science World", spanish: "El mundo de las ciencias" }, description: "Explore nature, animals, the human body, space and amazing experiments!", action: { english: "Explore Science", spanish: "Explorar ciencias" }, destination: { status: "coming-soon" } },
    { id: "english", icon: "🔤", title: { english: "English World", spanish: "El mundo del inglés" }, description: "Play with words, practise spelling, build sentences and become a word explorer!", action: { english: "Play English", spanish: "Jugar en inglés" }, destination: { status: "coming-soon" } },
    { id: "avatar", icon: "🧑‍🚀", title: { english: "My Avatar", spanish: "Mi personaje" }, description: "Create your character, choose outfits, collect accessories and show your personality!", action: { english: "Create My Avatar", spanish: "Crear mi personaje" }, destination: { status: "available", href: "/avatar" } },
    { id: "map", icon: "🗺️", title: { english: "Adventure Map", spanish: "Mapa de aventuras" }, description: "Travel through magical lands, complete missions, earn stars and unlock new discoveries!", action: { english: "Start Exploring", spanish: "¡A explorar!" }, destination: { status: "coming-soon" } },
  ],
  missions: [
    { id: "animal-words", icon: "🐾", title: { english: "Find 5 animal words", spanish: "Encuentra 5 palabras de animales." }, category: { english: "English", spanish: "Inglés" }, reward: 10, progress: { current: 0, total: 5 } },
    { id: "plant-parts", icon: "🌱", title: { english: "Label the parts of a plant", spanish: "Nombra las partes de una planta." }, category: { english: "Science", spanish: "Ciencias" }, reward: 15, progress: { current: 0, total: 1 } },
    { id: "spelling", icon: "🔠", title: { english: "Complete a spelling challenge", spanish: "Completa un reto de ortografía." }, category: { english: "English", spanish: "Inglés" }, reward: 10, progress: { current: 0, total: 1 } },
  ],
  starProgress: { current: 125, target: 150, remaining: 25 },
  collection: [
    { id: "badges", icon: "🏅", label: { english: "Badges", spanish: "Insignias" } },
    { id: "pets", icon: "🐶", label: { english: "Pets", spanish: "Mascotas" } },
    { id: "accessories", icon: "🎒", label: { english: "Avatar Accessories", spanish: "Accesorios" } },
    { id: "outfits", icon: "👕", label: { english: "Special Outfits", spanish: "Conjuntos especiales" } },
    { id: "decorations", icon: "🏰", label: { english: "World Decorations", spanish: "Decoraciones del mundo" } },
  ],
} satisfies HomepageSampleData;
