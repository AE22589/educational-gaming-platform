"use client";

import Image from "next/image";
import Link from "next/link";
import { TitleBranch } from "@/app/_components/TitleBranch";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import styles from "./myfriend.module.css";

const avatarArt = "/myfriend";
const legacyAnimalArt = "/vocabulary/english/english-2-b1-s00/animals";
const careArt = "/vocabulary/science/science-2-b2-s02";
const defaultAvatarId = "dragon";
const avatars = [
  { id: defaultAvatarId, english: "Little Dragon", spanish: "El Dragoncito", image: "/homepage/my-little-friend-dragon.webp" },
  { id: "water-creature", english: "Water Creature", spanish: "La Criatura del Agua", image: `${avatarArt}/water-creature.webp` },
  { id: "kitten", english: "Kitten", spanish: "El Gatito", image: `${avatarArt}/kitten.webp` },
  { id: "fairy", english: "Fairy", spanish: "El Hada", image: `${avatarArt}/fairy.webp` },
  { id: "fox", english: "Fox", spanish: "El Zorrito", image: `${avatarArt}/fox.webp` },
  { id: "panda", english: "Panda", spanish: "El Panda", image: `${avatarArt}/panda.webp` },
  { id: "unicorn", english: "Unicorn", spanish: "El Unicornio", image: `${avatarArt}/unicorn.webp` },
  { id: "dog", english: "Dog", spanish: "El Perro", image: `${avatarArt}/dog.webp` },
  { id: "griffin", english: "Griffin", spanish: "El Grifo", image: `${avatarArt}/griffin.webp` },
  { id: "dino", english: "Dino", spanish: "El Dino", image: `${avatarArt}/dino.webp` },
];

const legacyAvatars = [
  { id: "puppy", spanish: "El Perrito", image: `${legacyAnimalArt}/puppy.webp` },
  { id: "rabbit", spanish: "El Conejito", image: `${legacyAnimalArt}/rabbit.webp` },
  { id: "parrot", spanish: "El Loro", image: `${legacyAnimalArt}/parrot.webp` },
  { id: "hamster", spanish: "El Hámster", image: `${legacyAnimalArt}/hamster.webp` },
];

const savedAvatars = [...avatars, ...legacyAvatars];
const needs = [
  { label: "Happiness", emoji: "😊", image: null, value: 100, tone: styles.happy },
  { label: "Hunger", image: `${careArt}/food-and-drinks/soup-supplied.webp`, value: 0, tone: styles.hunger },
  { label: "Cleanliness", image: `${careArt}/accidents-and-safety/shower-supplied.webp`, value: 100, tone: styles.clean },
];

const storageKey = "chispitas.myfriend.v1";
const changeEvent = "chispitas:friend-saved";
const maxNameLength = 24;

type Friend = { avatarId: string; name: string; birthday: string };

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(changeEvent, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(changeEvent, listener);
  };
}

function readFriend() {
  try {
    return window.localStorage.getItem(storageKey);
  } catch {
    return null;
  }
}

function parseFriend(raw: string | null): Friend | null {
  if (!raw) return null;
  try {
    const friend = JSON.parse(raw);
    if (
      typeof friend?.name === "string" &&
      friend.name.trim() &&
      friend.name.length <= maxNameLength &&
      savedAvatars.some(({ id }) => id === friend.avatarId) &&
      typeof friend.birthday === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(friend.birthday) &&
      !Number.isNaN(Date.parse(friend.birthday))
    ) return friend;
  } catch {
    return null;
  }
  return null;
}

function today() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return [date.getFullYear(), month, day].join("-");
}

export function MyFriend({ basePath }: { basePath: string }) {
  const rawFriend = useSyncExternalStore(subscribe, readFriend, () => undefined);
  const friend = parseFriend(rawFriend ?? null);
  const [draft, setDraft] = useState<Pick<Friend, "avatarId" | "name"> | null>(null);
  const [error, setError] = useState(false);
  const [initialDraft, setInitialDraft] = useState({ avatarId: defaultAvatarId, name: "" });
  const form = draft ?? initialDraft;
  const updateForm = draft ? setDraft : setInitialDraft;
  const avatar = savedAvatars.find(({ id }) => id === friend?.avatarId);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) return;
    const current = parseFriend(readFriend());
    const next = { avatarId: form.avatarId, name, birthday: current?.birthday ?? today() };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setError(true);
      return;
    }
    window.dispatchEvent(new Event(changeEvent));
    setError(false);
    setDraft(null);
  }

  return (
    <section className={`shop-window ${styles.scene}`} aria-labelledby="friend-title">
      <header className={styles.header}>
        <h1 id="friend-title">
          <span className="shop-title-row">
            <TitleBranch side="left" />
            <span lang="en">My Little Friend</span>
            <TitleBranch side="right" />
          </span>
          <small>Mi pequeño amigo</small>
        </h1>
      </header>

      {rawFriend === undefined ? (
        <p role="status" className={styles.loading}>Cargando…</p>
      ) : friend && avatar && !draft ? (
        <article className={styles.profile} aria-labelledby="friend-name">
          <button type="button" className={styles.edit} aria-label="Editar amigo" onClick={() => setDraft(friend)}>
            <span aria-hidden="true">✏️</span>
          </button>
          <div className={styles.identity}>
            <div className={styles.portrait}>
              <Image src={basePath + avatar.image} alt={avatar.spanish} fill sizes="(max-width: 500px) 70vw, 290px" unoptimized />
            </div>
            <h2 id="friend-name" className={styles.name} tabIndex={-1}
              ref={(heading) => { if (heading && document.activeElement === document.body) heading.focus({ preventScroll: true }); }}>
              {friend.name}
            </h2>
          </div>
          <div className={styles.details}>
            <div className={styles.stats}>
              {needs.map(({ label, emoji, image, value, tone }) => (
                <div className={styles.stat} key={label}>
                  <label htmlFor={label} lang="en">
                    {image
                      ? <Image src={basePath + image} alt="" width={26} height={26} unoptimized />
                      : <span aria-hidden="true">{emoji}</span>}
                    {label}
                  </label>
                  <meter className={tone} id={label} min={0} max={100} value={value}>{value}%</meter>
                </div>
              ))}
            </div>
            <div className={styles.birthday}>
              <span aria-hidden="true">🎂</span>
              <div lang="en"><strong>Birthday</strong>
                <time dateTime={friend.birthday}>
                  {new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeZone: "UTC" }).format(new Date(friend.birthday))}
                </time>
              </div>
            </div>
          </div>
        </article>
      ) : (
        <form className={styles.form} onSubmit={save}>
          <fieldset className={styles.choices}>
            <legend>Elige a tu amigo favorito</legend>
            <div className={styles.grid}>
              {avatars.map((choice) => (
                <label key={choice.id} className={styles.choice}>
                  <input type="radio" name="avatar" value={choice.id} checked={form.avatarId === choice.id}
                    onChange={() => updateForm({ ...form, avatarId: choice.id })} />
                  <span className={styles.card}>
                    <span className={styles.art}>
                      <Image src={basePath + choice.image} alt="" fill sizes="(max-width: 600px) 37vw, 150px" unoptimized />
                    </span>
                    <strong lang="en">{choice.english}</strong>
                    <small>{choice.spanish}</small>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className={styles.formBar}>
            <div className={styles.nameField}>
              <label htmlFor="avatar-name">¿Cómo se llamará tu amigo?</label>
              <input id="avatar-name" value={form.name} onChange={(event) => updateForm({ ...form, name: event.target.value })}
                maxLength={maxNameLength} autoComplete="off" required placeholder="Escribe un nombre" />
              {error && <p role="alert">No se pudo guardar. Inténtalo de nuevo.</p>}
            </div>
            <button type="submit" className={styles.save} disabled={!form.name.trim()}>
              <span aria-hidden="true">⭐</span> <span lang="en">Save</span>
            </button>
            {draft && <button type="button" className={styles.cancel} lang="en" onClick={() => { setDraft(null); setError(false); }}>Cancel</button>}
          </div>
        </form>
      )}

      <div className={styles.actions}>
        {avatar?.id === defaultAvatarId && !draft && <Link className={styles.cave} href="/avatar">Visitar la cueva</Link>}
        <Link href="/shop" className={styles.shop}><span aria-hidden="true">⭐</span> <span lang="en">Star Shop</span><span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
