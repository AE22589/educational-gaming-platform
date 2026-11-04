"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useProfile } from "@/features/profile/ui/ProfileProvider";
import { APPLE_ITEM_ID, WATER_ITEM_ID } from "@/features/shop/catalog";

type TimeOfDay = "day" | "night";
type Consumable = "apple" | "water";
type DragonAnimation = Consumable | null;
type DragState = { item: Consumable; x: number; y: number; width: number; height: number };

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
}

export function CaveRoom({ basePath }: { basePath: string }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [dragonAnimation, setDragonAnimation] = useState<DragonAnimation>(null);
  const { service, state } = useProfile();
  const dragonRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const animationTimerRef = useRef<number | null>(null);
  const feedingRef = useRef(false);
  const appleCount =
    state.status === "ready"
      ? state.snapshot.inventory[APPLE_ITEM_ID] ?? 0
      : 0;
  const waterCount =
    state.status === "ready"
      ? state.snapshot.inventory[WATER_ITEM_ID] ?? 0
      : 0;

  useEffect(() => {
    const updateTimeOfDay = () => setTimeOfDay(getTimeOfDay());
    updateTimeOfDay();
    const interval = window.setInterval(updateTimeOfDay, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => () => {
    if (animationTimerRef.current !== null) window.clearTimeout(animationTimerRef.current);
  }, []);

  const feedDragon = async (item: Consumable) => {
    const itemCount = item === "apple" ? appleCount : waterCount;
    if (!service || feedingRef.current || itemCount < 1) return;
    feedingRef.current = true;
    const result = item === "apple" ? await service.consumeApple() : await service.consumeWater();
    if (result.status !== "consumed") {
      feedingRef.current = false;
      return;
    }
    setDragonAnimation(item);
    animationTimerRef.current = window.setTimeout(() => {
      setDragonAnimation(null);
      feedingRef.current = false;
      animationTimerRef.current = null;
    }, item === "water" ? 3000 : 4010);
  };

  const handlePointerDown = (item: Consumable, itemCount: number, event: PointerEvent<HTMLDivElement>) => {
    if (itemCount < 1 || feedingRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    const bounds = event.currentTarget.getBoundingClientRect();
    const nextDrag = { item, x: event.clientX, y: event.clientY, width: bounds.width, height: bounds.height };
    dragRef.current = nextDrag;
    setDrag(nextDrag);
  };

  const handlePointerMove = (item: Consumable, event: PointerEvent<HTMLDivElement>) => {
    const current = dragRef.current;
    if (current?.item === item) {
      const nextDrag = { ...current, x: event.clientX, y: event.clientY };
      dragRef.current = nextDrag;
      setDrag(nextDrag);
    }
  };

  const handlePointerUp = async (item: Consumable, event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.item !== item) return;
    const dragonBounds = dragonRef.current?.getBoundingClientRect();
    const droppedOnDragon = dragonBounds !== undefined &&
      event.clientX >= dragonBounds.left && event.clientX <= dragonBounds.right &&
      event.clientY >= dragonBounds.top && event.clientY <= dragonBounds.bottom;
    dragRef.current = null;
    setDrag(null);
    if (droppedOnDragon) await feedDragon(item);
  };

  const imagePath = timeOfDay
    ? `${basePath}/dragon-cave/cave-${timeOfDay}.png`
    : undefined;
  const dragonPath = `${basePath}/dragon-cave/dragon-sleep.gif`;
  const dragonImage = dragonAnimation === "apple"
    ? `${basePath}/dragon-cave/dragon-eats-shop-apple.gif`
    : dragonAnimation === "water"
      ? `${basePath}/dragon-cave/dragon-drinks-shop-water.gif`
      : dragonPath;

  const renderConsumable = (item: Consumable, count: number) => {
    const itemLabel = item === "apple" ? "manzana" : "agua fresca";
    const dragging = drag?.item === item;
    return (
      <div
        className={`cave-consumable cave-${item}${count > 0 ? " has-count" : ""}`}
        role="button"
        tabIndex={count > 0 ? 0 : -1}
        aria-disabled={count < 1 || dragonAnimation !== null}
        aria-label={count > 0
          ? `Arrastra ${itemLabel} hasta Chispitas. ${count} ${count === 1 ? "disponible" : "disponibles"}.`
          : `${item === "apple" ? "Manzana" : "Agua fresca"} agotada`}
        aria-live="polite"
        onPointerDown={(event) => handlePointerDown(item, count, event)}
        onPointerMove={(event) => handlePointerMove(item, event)}
        onPointerUp={(event) => void handlePointerUp(item, event)}
        onPointerCancel={() => {
          dragRef.current = null;
          setDrag(null);
        }}
        onKeyDown={(event) => {
          if ((event.key === "Enter" || event.key === " ") && count > 0) {
            event.preventDefault();
            void feedDragon(item);
          }
        }}
        style={dragging ? {
          position: "fixed",
          right: "auto",
          left: drag.x,
          top: drag.y,
          width: drag.width,
          height: drag.height,
          transform: "translate(-50%, -50%)",
        } : undefined}
      >
        <Image
          src={`${basePath}/shop/${item === "apple" ? "apple" : "water"}.webp`}
          alt=""
          width={160}
          height={160}
          unoptimized
          draggable={false}
        />
        {count > 0 && <span>{count}</span>}
      </div>
    );
  };

  return (
    <section
      className={`cave-page${timeOfDay === "night" ? " is-night" : ""}`}
      aria-labelledby="cave-title"
    >
      <div className="cave-heading-row">
        <div>
          <p className="cave-eyebrow">Un rincón mágico</p>
          <h1 id="cave-title">La cueva de Chispitas</h1>
          <p className="cave-intro">Su pequeño lugar para descansar y soñar.</p>
        </div>
        <Link className="cave-back-link" href="/">
          Volver al mundo
        </Link>
      </div>

      <div className="cave-stage">
        <div
          className="cave-frame"
          role="group"
          aria-label={timeOfDay === "night" ? "La cueva por la noche" : "La cueva durante el día"}
        >
          <div className="cave-art-window">
            {imagePath ? (
              <Image
                className="cave-art"
                src={imagePath}
                alt={
                  timeOfDay === "night"
                    ? "Interior de la cueva iluminado por la luna, con estrellas visibles en el cielo nocturno."
                    : "Interior de la cueva bañado por la luz del día y con cielo azul visible."
                }
                fill
                priority
                unoptimized
                sizes="(max-width: 900px) 100vw, 900px"
              />
            ) : (
              <div className="cave-art-loading" aria-label="Cargando la cueva" />
            )}
            <Image
              key={dragonAnimation ?? "sleeping"}
              ref={dragonRef}
              className="cave-dragon"
              src={dragonImage}
              alt={dragonAnimation === "apple" ? "Chispitas está comiendo una manzana." : dragonAnimation === "water" ? "Chispitas está bebiendo agua fresca." : "Chispitas duerme enroscado sobre el suelo de la cueva."}
              width={512}
              height={512}
              unoptimized
              sizes="(max-width: 680px) 34vw, 210px"
              draggable={false}
            />
          </div>
        </div>
        <div className="cave-consumables">
          {renderConsumable("water", waterCount)}
          {renderConsumable("apple", appleCount)}
        </div>
      </div>
    </section>
  );
}
