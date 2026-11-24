export const companions = [
  { id: "dragon", name: "Chispitas", description: "Un dragón lleno de magia", image: "/homepage/my-little-friend-dragon.webp", available: true },
  { id: "water-creature", name: "La Criatura del Agua", description: "Water Creature", image: "/myfriend/water-creature-updated.webp", available: true },
  { id: "kitten", name: "El Gatito", description: "Kitten", image: "/myfriend/kitten.webp", available: false },
  { id: "fairy", name: "El Hada", description: "Fairy", image: "/myfriend/fairy.webp", available: false },
  { id: "fox", name: "El Zorrito", description: "Fox", image: "/myfriend/fox.webp", available: false },
  { id: "panda", name: "El Panda", description: "Panda", image: "/myfriend/panda.webp", available: false },
  { id: "unicorn", name: "El Unicornio", description: "Unicorn", image: "/myfriend/unicorn.webp", available: false },
  { id: "dog", name: "El Perro", description: "Dog", image: "/myfriend/dog.webp", available: false },
  { id: "griffin", name: "El Grifo", description: "Griffin", image: "/myfriend/griffin.webp", available: false },
  { id: "dino", name: "El Dino", description: "Dino", image: "/myfriend/dino.webp", available: false },
] as const;

export const AVAILABLE_COMPANION_IDS: readonly string[] = companions.filter((friend) => friend.available).map((friend) => friend.id);
