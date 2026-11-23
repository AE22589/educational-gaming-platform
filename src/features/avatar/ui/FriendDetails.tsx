"use client";

import Image from "next/image";
import Link from "next/link";
import { TitleBranch } from "@/app/_components/TitleBranch";
import styles from "@/app/myfriend/myfriend.module.css";
import { companions } from "../catalog";

const legacyImages: Record<string, string> = {
  puppy: "/vocabulary/english/english-2-b1-s00/animals/puppy.webp",
  rabbit: "/vocabulary/english/english-2-b1-s00/animals/rabbit.webp",
  parrot: "/vocabulary/english/english-2-b1-s00/animals/parrot.webp",
  hamster: "/vocabulary/english/english-2-b1-s00/animals/hamster.webp",
};

export function FriendDetails({ basePath, friend, onBack, onEdit }: {
  basePath: string;
  friend: { avatarId: string; name: string; birthday: string };
  onBack: () => void;
  onEdit?: (() => void) | undefined;
}) {
  const image = companions.find((item) => item.id === friend.avatarId)?.image ?? legacyImages[friend.avatarId];
  const needs = [
    { label: "Happiness", icon: "😊", image: null, value: 100, tone: styles.happy },
    { label: "Hunger", icon: "", image: "/vocabulary/science/science-2-b2-s02/food-and-drinks/soup-supplied.webp", value: 0, tone: styles.hunger },
    { label: "Cleanliness", icon: "", image: "/vocabulary/science/science-2-b2-s02/accidents-and-safety/shower-supplied.webp", value: 100, tone: styles.clean },
  ];
  return <section className={`shop-window ${styles.scene}`} aria-labelledby="friend-details-title">
    <header className={styles.header}><h1 id="friend-details-title"><span className="shop-title-row"><TitleBranch side="left" /><span lang="en">My Little Friend</span><TitleBranch side="right" /></span><small>Mi pequeño amigo</small></h1></header>
    <article className={styles.profile} aria-labelledby="friend-details-name">
      {onEdit && <button type="button" className={styles.edit} aria-label="Editar nombre" onClick={onEdit}><span aria-hidden="true">✏️</span></button>}
      <div className={styles.identity}>
        {image && <div className={styles.portrait}><Image src={basePath + image} alt="" fill sizes="(max-width: 500px) 70vw, 290px" unoptimized /></div>}
        <h2 id="friend-details-name" className={styles.name}>{friend.name}</h2>
      </div>
      <div className={styles.details}>
        <div className={styles.stats}>{needs.map(({ label, icon, image: iconImage, value, tone }) => <div className={styles.stat} key={label}>
          <label htmlFor={`friend-stat-${label}`} lang="en">{iconImage ? <Image src={basePath + iconImage} alt="" width={26} height={26} unoptimized /> : <span aria-hidden="true">{icon}</span>}{label}</label>
          <meter className={tone} id={`friend-stat-${label}`} min={0} max={100} value={value}>{value}%</meter>
        </div>)}</div>
        <div className={styles.birthday}><span aria-hidden="true">🎂</span><div lang="en"><strong>Birthday</strong><time dateTime={friend.birthday}>{new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${friend.birthday}T00:00:00Z`))}</time></div></div>
      </div>
    </article>
    <div className={styles.actions}><button type="button" className={styles.cave} onClick={onBack}>Volver</button><Link href="/shop" className={styles.shop}><span aria-hidden="true">⭐</span> <span lang="en">Star Shop</span><span aria-hidden="true">→</span></Link></div>
  </section>;
}
