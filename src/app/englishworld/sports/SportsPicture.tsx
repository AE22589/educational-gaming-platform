import Image from "next/image";
import type { VocabularyItem } from "./vocabulary";
import styles from "./sports.module.css";

export function SportsPicture({ item }: { item: VocabularyItem }) {
  const { picture, translation } = item;
  return (
    <span className={styles.picture} role="img" aria-label={translation}>
      {picture === "bat" || picture === "knee" || picture === "elbow"
        ? <Image className={styles.equipmentPicture} alt="" width={96} height={96} unoptimized
            src={`${process.env.NEXT_PUBLIC_BASE_PATH}/englishworld/sports-equipment/${picture}.webp`} />
        : picture === "racket"
        ? <span className={styles.racket} aria-hidden="true" />
        : <span aria-hidden="true">{picture}</span>}
    </span>
  );
}
