"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type TimeOfDay = "day" | "night";

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "day" : "night";
}

export default function Avatar() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay | null>(null);
  const basePath = process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

  useEffect(() => {
    const updateTimeOfDay = () => setTimeOfDay(getTimeOfDay());
    updateTimeOfDay();
    const interval = window.setInterval(updateTimeOfDay, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const imagePath = timeOfDay
    ? `${basePath}/dragon-cave/cave-${timeOfDay}.png`
    : undefined;

  return (
    <section className={`cave-page${timeOfDay === "night" ? " is-night" : ""}`} aria-labelledby="cave-title">
      <div className="cave-heading-row">
        <div>
          <p className="cave-eyebrow">Un rincón mágico</p>
          <h1 id="cave-title">La cueva de Chispitas</h1>
          <p className="cave-intro">Su pequeño lugar para descansar y soñar.</p>
        </div>
        <Link className="cave-back-link" href="/">Volver al mundo</Link>
      </div>

      <div className="cave-frame" aria-label={timeOfDay === "night" ? "La cueva por la noche" : "La cueva durante el día"}>
        <div className="cave-art-window">
          {imagePath ? (
            <Image
              className="cave-art"
              src={imagePath}
              alt={timeOfDay === "night"
                ? "Interior vacío de la cueva iluminado por la luna, con estrellas visibles en el cielo nocturno."
                : "Interior vacío de la cueva bañado por la luz del día y con cielo azul visible."}
              fill
              priority
              unoptimized
              sizes="(max-width: 900px) 100vw, 900px"
            />
          ) : (
            <div className="cave-art-loading" aria-label="Cargando la cueva" />
          )}
        </div>
      </div>
    </section>
  );
}
