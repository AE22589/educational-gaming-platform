"use client";

import Image from "next/image";
import { useState } from "react";
import { adventurePreview, completedSections } from "./map-preview";
import styles from "./map.module.css";

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function AdventureMap() {
  const [showForest, setShowForest] = useState(false);

  return (
    <div className={styles.page}>
      <header className={styles.intro}>
        <p className={styles.eyebrow}>✦ El mundo de Chispitas</p>
        <h1>Mapa de aventuras</h1>
      </header>

      <div className={styles.layout}>
        <aside className={styles.panel} aria-labelledby="map-progress-title">
          <Image
            className={styles.avatar}
            src={assetBasePath + adventurePreview.avatarPath}
            alt="Avatar de ejemplo"
            width={92}
            height={92}
            unoptimized
          />
          <h2 id="map-progress-title">Your adventure</h2>
          <p className={styles.stars}><span aria-hidden="true">★</span> {adventurePreview.starBalance} stars</p>
          <div className={styles.counts}>
            <p>English {adventurePreview.completedBySubject.english} completed</p>
            <p>Science {adventurePreview.completedBySubject.science} completed</p>
          </div>
          <label className={styles.progressLabel} htmlFor="map-progress">Total progress</label>
          <progress
            id="map-progress"
            value={completedSections}
            max={adventurePreview.sections.length}
          />
          <p className={styles.progressText}>{completedSections} sections completed</p>
          {showForest && (
            <button className={styles.overviewButton} type="button" onClick={() => setShowForest(false)}>
              See the big map
            </button>
          )}
          <small>Preview progress</small>
        </aside>

        <section className={styles.map} aria-label={showForest ? "Bosque Encantado detail" : "Adventure world map"}>
          <div className={styles.artwork}>
            <Image
              src={assetBasePath + (showForest ? adventurePreview.forestImage : adventurePreview.worldImage)}
              alt={showForest
                ? "Bosque Encantado with five numbered checkpoints along a winding path"
                : "Fantasy world map showing Bosque Encantado and four more adventure sections"}
              width={1679}
              height={937}
              sizes="(max-width: 800px) 100vw, 75vw"
              unoptimized
              priority
            />
            {!showForest && (
              <button
                className={styles.playButton}
                type="button"
                onClick={() => setShowForest(true)}
                aria-label="See Bosque Encantado steps"
              >
                <span className={styles.visuallyHidden}>See Bosque Encantado steps</span>
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
