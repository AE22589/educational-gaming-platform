const translations: Record<string, { title: string; topics: Record<string, string> }> = {
  "english-2-b1-s00": {
    title: "¡Aprendamos lo básico!",
    topics: {
      colors: "Colores",
      numbers: "Números",
      "days-of-the-week": "Días de la semana",
      family: "Familia",
      animals: "Animales",
      emotions: "Emociones",
    },
  },
  "science-2-b2-s02": {
    title: "¡Hábitos saludables, vida feliz!",
    topics: {
      "health-and-the-body": "La salud y el cuerpo",
      "healthcare-and-illnesses": "Cuidados de salud y enfermedades",
      "healthy-habits-and-hygiene": "Hábitos saludables e higiene",
      "food-and-drinks": "Alimentos y bebidas",
      "food-groups-and-nutrition": "Grupos de alimentos y nutrición",
      "meals-and-menus": "Comidas y menús",
      "accidents-and-safety": "Accidentes y seguridad",
      "feelings-and-emotions": "Sentimientos y emociones",
      "time-and-frequency-expressions": "Expresiones de tiempo y frecuencia",
    },
  },
};

export function getSectionTranslation(unitId: string) {
  return translations[unitId];
}
