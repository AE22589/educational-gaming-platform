"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useProfile } from "@/features/profile/ui/ProfileProvider";
import { APPLE_ITEM_ID } from "@/features/shop/catalog";

type TimeOfDay = "day" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
}

export function CaveRoom({ basePath }: { basePath: string }) {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const [appleDrag, setAppleDrag] = useState<{ x: number; y: number } | null>(null);
  const [isEating, setIsEating] = useState(false);
  const { service, state } = useProfile();
  const dragonRef = useRef<HTMLImageElement>(null);
  const eatTimerRef = useRef<number | null>(null);
  const feedingRef = useRef(false);
  const appleCount =
    state.status === "ready"
      ? state.snapshot.inventory[APPLE_ITEM_ID] ?? 0
      : 0;

  useEffect(() => {
    const updateTimeOfDay = () => setTimeOfDay(getTimeOfDay());
    updateTimeOfDay();
    const interval = window.setInterval(updateTimeOfDay, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => () => {
    if (eatTimerRef.current !== null) window.clearTimeout(eatTimerRef.current);
  }, []);

  const feedDragon = async () => {
    if (!service || feedingRef.current || appleCount < 1) return;
    feedingRef.current = true;
    const result = await service.consumeApple();
    if (result.status !== "consumed") {
      feedingRef.current = false;
      return;
    }
    setIsEating(true);
    eatTimerRef.current = window.setTimeout(() => {
      setIsEating(false);
      feedingRef.current = false;
      eatTimerRef.current = null;
    }, 4010);
  };

  const handleApplePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (appleCount < 1 || feedingRef.current) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setAppleDrag({ x: event.clientX, y: event.clientY });
  };

  const handleApplePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (appleDrag) setAppleDrag({ x: event.clientX, y: event.clientY });
  };

  const handleApplePointerUp = async (event: PointerEvent<HTMLDivElement>) => {
    if (!appleDrag) return;
    const dragonBounds = dragonRef.current?.getBoundingClientRect();
    const droppedOnDragon = dragonBounds !== undefined &&
      event.clientX >= dragonBounds.left && event.clientX <= dragonBounds.right &&
      event.clientY >= dragonBounds.top && event.clientY <= dragonBounds.bottom;
    setAppleDrag(null);
    if (droppedOnDragon) await feedDragon();
  };

  const imagePath = timeOfDay
    ? `${basePath}/dragon-cave/cave-${timeOfDay}.png`
    : undefined;
  const dragonPath = `${basePath}/dragon-cave/dragon-sleep.gif`;

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
              key={isEating ? "eating" : "sleeping"}
              ref={dragonRef}
              className="cave-dragon"
              src={isEating ? `${basePath}/dragon-cave/dragon-eats-shop-apple.gif` : dragonPath}
              alt={isEating ? "Chispitas está comiendo una manzana." : "Chispitas duerme enroscado sobre el suelo de la cueva."}
              width={512}
              height={512}
              unoptimized
              sizes="(max-width: 680px) 34vw, 210px"
              draggable={false}
            />
          </div>
        </div>
        <div
          className={`cave-apple${appleCount > 0 ? " has-apples" : ""}`}
          role="button"
          tabIndex={appleCount > 0 ? 0 : -1}
          aria-disabled={appleCount < 1 || isEating}
          aria-label={
            appleCount > 0
              ? `Arrastra la manzana hasta Chispitas para darle de comer. ${appleCount} ${appleCount === 1 ? "manzana disponible" : "manzanas disponibles"}.`
              : "Manzana agotada"
          }
          aria-live="polite"
          onPointerDown={handleApplePointerDown}
          onPointerMove={handleApplePointerMove}
          onPointerUp={handleApplePointerUp}
          onPointerCancel={() => setAppleDrag(null)}
          onKeyDown={(event) => {
            if ((event.key === "Enter" || event.key === " ") && appleCount > 0) {
              event.preventDefault();
              void feedDragon();
            }
          }}
          style={appleDrag ? {
            position: "fixed",
            right: "auto",
            left: appleDrag.x,
            top: appleDrag.y,
            transform: "translate(-50%, -50%)",
          } : undefined}
        >
          <Image
            src={`${basePath}/shop/apple.webp`}
            alt=""
            width={160}
            height={160}
            unoptimized
            draggable={false}
          />
          {appleCount > 0 && <span>{appleCount}</span>}
        </div>
      </div>
    </section>
  );
}
