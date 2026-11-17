"use client";

import Image from "next/image";
import { chooseGrade, useSelectedGrade } from "../grade-selection";

const cards = [
  { grade: 1, tone: "peach" },
  { grade: 2, tone: "lilac" },
  { grade: 3, tone: "sky" },
  { grade: 4, tone: "green" },
  { grade: 5, tone: "gold" },
  { grade: 6, tone: "rose" },
];

export function GradePicker({ assetBasePath, availableGrade }: { assetBasePath: string; availableGrade: number }) {
  const selected = useSelectedGrade();

  if (selected === availableGrade) return null;

  return (
    <section className="home-grade-panel" aria-labelledby="home-grade-title">
      <h2 id="home-grade-title">¡Elige tu curso para empezar tu aventura!</h2>
      <div className="home-grade-grid">
        {cards.map(({ grade, tone }) => {
          const available = grade === availableGrade;
          return (
            <button
              key={grade}
              type="button"
              className="home-grade-card"
              data-tone={tone}
              disabled={!available}
              onClick={() => {
                chooseGrade(grade);
                requestAnimationFrame(() => {
                  document.getElementById("home-worlds")?.focus({ preventScroll: true });
                  window.scrollTo(0, 0);
                });
              }}
            >
              <Image src={`${assetBasePath}/homepage/grades/primaria-${grade}.webp`} alt="" width={512} height={512} unoptimized />
              <strong>Primaria {grade}</strong>
              <span>{available ? "Empezar →" : "Próximamente"}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
