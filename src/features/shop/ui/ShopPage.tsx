"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TitleBranch } from "@/app/_components/TitleBranch";
import { useProfile } from "@/features/profile/ui/ProfileProvider";
import { APPLE_ITEM_ID, APPLE_PRICE_STARS, WATER_ITEM_ID, WATER_PRICE_STARS, shopFilters, shopProducts, type ShopFilter, type ShopProductId } from "@/features/shop/catalog";

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 32 32"><path d="m16 2.8 4.1 8.3 9.2 1.3-6.7 6.5 1.6 9.2-8.2-4.3-8.2 4.3 1.6-9.2-6.7-6.5 9.2-1.3z" /></svg>;
}

function ProductArt({ id }: { id: ShopProductId }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const sources: Record<ShopProductId, string> = {
    apple: "/shop/apple.webp",
    water: "/shop/water.webp",
    "leaf-bed": "/shop/leaf-bed.webp",
    "glow-plant": "/shop/glow-plant.webp",
  };

  return (
    <Image
      src={`${basePath}${sources[id]}`}
      alt=""
      aria-hidden="true"
      width={640}
      height={640}
      unoptimized
      className="shop-product-image"
    />
  );
}

export function ShopPage() {
  const { service, state } = useProfile();
  const [filter, setFilter] = useState<ShopFilter>("Todo");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const ready = state.status === "ready";
  const snapshot = ready ? state.snapshot : state.status === "unsaved" ? state.pending : null;
  const visibleProducts = useMemo(
    () => shopProducts.filter((product) => filter === "Todo" || product.category === filter),
    [filter],
  );
  const appleCount = snapshot?.inventory[APPLE_ITEM_ID] ?? 0;
  const waterCount = snapshot?.inventory[WATER_ITEM_ID] ?? 0;
  const countLabel = appleCount === 1 ? "1 manzana" : `${appleCount} manzanas`;
  const waterCountLabel = waterCount === 1 ? "1 agua" : `${waterCount} aguas`;
  const buyItem = async (itemId: ShopProductId) => {
    if (!service || !ready || busy) return;
    setBusy(true);
    setMessage("");
    const isApple = itemId === APPLE_ITEM_ID;
    const result = isApple ? await service.purchaseApple() : await service.purchaseWater();
    if (result.status === "purchased") setMessage(isApple ? "¡Manzana comprada! Ya está en tu despensa." : "¡Agua fresca comprada! Ya está en tu despensa.");
    else if (result.status === "insufficient-stars") setMessage("Necesitas una estrella más para comprarla.");
    else if (result.status === "unsaved") setMessage("No se pudo guardar la compra. Tus estrellas no se han actualizado.");
    else if (result.status === "read-only") setMessage("Esta pestaña no puede guardar compras ahora.");
    else setMessage("La tienda todavía se está preparando.");
    setBusy(false);
  };

  return (
    <div className="shop-scene">
      <section className="shop-window" aria-labelledby="shop-title">
        <header className="shop-heading">
          <div className="shop-heading-copy">
            <p className="shop-kicker">Pequeños tesoros</p>
            <div className="shop-title-row">
              <TitleBranch side="left" />
              <h1 id="shop-title">Tienda de estrellas</h1>
              <TitleBranch side="right" />
            </div>
            <p className="shop-subtitle">Elige algo bonito para tu aventura.</p>
          </div>
          <div className="shop-star-balance" aria-label={`${snapshot?.stars ?? "…"} estrellas disponibles`}>
            <StarIcon /><strong>{snapshot?.stars ?? "…"}</strong>
          </div>
        </header>

        <div className="shop-filters" aria-label="Filtrar artículos">
          {shopFilters.map((item) => (
            <button
              key={item}
              type="button"
              className={`shop-filter${filter === item ? " is-selected" : ""}`}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >{item}</button>
          ))}
        </div>

        <div className="shop-product-grid">
          {visibleProducts.map((product) => {
            const available = product.id === APPLE_ITEM_ID || product.id === WATER_ITEM_ID;
            const price = product.id === WATER_ITEM_ID ? WATER_PRICE_STARS : APPLE_PRICE_STARS;
            return (
              <article key={product.id} className={`shop-product-card product-${product.id}${available ? " is-available" : " is-upcoming"}`}>
                <div className="shop-product-art"><ProductArt id={product.id} /></div>
                <h2>{product.name}</h2>
                {available ? (
                  <>
                    <p className="shop-item-price"><StarIcon /> {price} estrella</p>
                    <button className="shop-buy-button" type="button" disabled={!ready || state.status === "ready" && state.ownership !== "exclusive" || busy || (snapshot?.stars ?? 0) < price} onClick={() => void buyItem(product.id)}>
                      {busy ? "Guardando…" : (snapshot?.stars ?? 0) < price ? "Necesitas más estrellas" : "Comprar"}
                    </button>
                  </>
                ) : <span className="shop-coming-soon">Próximamente</span>}
              </article>
            );
          })}
        </div>

        <div className="shop-pantry" aria-live="polite">
          <svg aria-hidden="true" viewBox="0 0 64 54"><path d="M12 19h40l-5 29H17z" fill="#c98745" stroke="#8e5c31" strokeWidth="3"/><path d="M18 19c0-11 8-15 14-15s14 4 14 15" fill="none" stroke="#a76b37" strokeWidth="5"/><path d="M18 29h28M17 38h28" stroke="#e3ad6d" strokeWidth="4"/></svg>
          <span>Tu despensa: <strong>{countLabel} · {waterCountLabel}</strong></span>
        </div>
        {message && <p className="shop-feedback" role="status">{message}</p>}
        {state.status === "unsaved" && <p className="shop-storage-note" role="status">Hay cambios sin guardar. <Link href="/#profile-summary">Revisar tu perfil</Link>.</p>}
        {(state.status === "recovery" || (state.status === "ready" && state.ownership === "read-only")) && (
          <p className="shop-storage-note" role="status">No podemos guardar compras ahora. <Link href="/#profile-summary">Revisar tu perfil</Link>.</p>
        )}
      </section>
    </div>
  );
}
