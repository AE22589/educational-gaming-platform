export const APPLE_ITEM_ID = "apple";
export const APPLE_PRICE_STARS = 1;

export type ShopFilter = "Todo" | "Comida y bebida" | "Cueva";
export type ShopProductId = typeof APPLE_ITEM_ID | "water" | "leaf-bed" | "glow-plant";

export const shopFilters: ShopFilter[] = ["Todo", "Comida y bebida", "Cueva"];

export const shopProducts: {
  id: ShopProductId;
  name: string;
  category: Exclude<ShopFilter, "Todo">;
}[] = [
  { id: APPLE_ITEM_ID, name: "Manzana", category: "Comida y bebida" },
  { id: "water", name: "Agua fresca", category: "Comida y bebida" },
  { id: "leaf-bed", name: "Cama de hojas", category: "Cueva" },
  { id: "glow-plant", name: "Planta luminosa", category: "Cueva" },
];
