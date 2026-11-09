export const adventurePreview = {
  avatarPath: "/homepage/avatar-girl.webp",
  starBalance: 12,
  completedBySubject: {
    english: 2,
    science: 1,
  },
  sections: [
    { id: "forest", name: "Enchanted Forest / Bosque Encantado" },
    { id: "ocean", name: "Ocean Discovery / Descubrimiento Marino" },
    { id: "space", name: "Space Adventure / Aventura Espacial" },
    { id: "dino", name: "Dino Land / Tierra de Dinosaurios" },
    { id: "castle", name: "Magic Castle / Castillo Mágico" },
  ],
  worldImage: "/homepage/adventure-world-overview.webp",
  forestImage: "/homepage/adventure-forest-detail.webp",
} as const;

export const completedSections =
  adventurePreview.completedBySubject.english +
  adventurePreview.completedBySubject.science;
