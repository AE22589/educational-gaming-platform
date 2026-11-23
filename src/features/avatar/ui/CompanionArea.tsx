"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { useProfile } from "@/features/profile/ui/ProfileProvider";
import { companions } from "../catalog";
import { CaveRoom } from "./CaveRoom";
import { FriendDetails } from "./FriendDetails";

type LegacyFriend = { avatarId: string; name: string; birthday: string };
function readLegacyFriend(): LegacyFriend | null {
  const raw = window.localStorage.getItem("chispitas.myfriend.v1");
  if (!raw) return null;
  const value: unknown = JSON.parse(raw);
  if (typeof value !== "object" || value === null || !("avatarId" in value) || !("name" in value) || !("birthday" in value) || typeof value.avatarId !== "string" || typeof value.name !== "string" || typeof value.birthday !== "string") throw new Error("Invalid saved friend");
  return { avatarId: value.avatarId, name: value.name, birthday: value.birthday };
}
function localDate() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function CompanionArea({ basePath }: { basePath: string }) {
  const { service, state } = useProfile();
  const [legacyStatus, setLegacyStatus] = useState<"loading" | "ready" | "error">("loading");
  const [choosing, setChoosing] = useState(false);
  const [naming, setNaming] = useState(false);
  const [detailsId, setDetailsId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!service || state.status !== "ready") return;
    let active = true;
    void Promise.resolve().then(async () => {
      if (state.snapshot.legacyCompanion || state.snapshot.selectedCompanionId) return true;
      const friend = readLegacyFriend();
      return friend ? service.importLegacyCompanion(friend) : true;
    }).then((ok) => { if (active) setLegacyStatus(ok ? "ready" : "error"); }, () => { if (active) setLegacyStatus("error"); });
    return () => { active = false; };
  }, [service, state]);
  if (state.status === "loading" || (state.status === "ready" && legacyStatus === "loading")) return <p className="friend-message">Cargando a tus amigos…</p>;
  if (state.status !== "ready" || legacyStatus === "error") return <p className="friend-message" role="alert">No podemos leer o guardar tu amigo ahora. Tus datos anteriores se conservan.</p>;
  const selected = state.snapshot.selectedCompanionId;
  const dragon = state.snapshot.companions.dragon;
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !service) return;
    setSaving(true); setError(false);
    const saved = await service.selectCompanion("dragon", name.trim(), localDate());
    setSaving(false);
    if (saved) { setNaming(false); setChoosing(false); } else setError(true);
  };
  if (naming) return <section className="friend-picker" aria-labelledby="friend-name-title">
    <h1 id="friend-name-title">¿Cómo se llamará tu dragón?</h1>
    <form className="friend-name-form" onSubmit={(event) => void save(event)}>
      <label htmlFor="friend-name-input">Elige un nombre para tu amigo</label>
      <input id="friend-name-input" value={name} onChange={(event) => setName(event.target.value)} maxLength={24} required autoComplete="off" />
      <button type="submit" disabled={saving || !name.trim() || state.ownership !== "exclusive"}>Guardar y continuar</button>
      <button type="button" onClick={() => setNaming(false)}>Volver</button>
      {error && <p role="alert">No se pudo guardar. Inténtalo de nuevo.</p>}
    </form>
  </section>;
  const details = detailsId ? state.snapshot.companions[detailsId] : undefined;
  if (details && detailsId) return <FriendDetails basePath={basePath} friend={{ avatarId: detailsId, ...details }} onBack={() => setDetailsId(null)} onEdit={detailsId === "dragon" ? () => { setDetailsId(null); setName(details.name); setNaming(true); } : undefined} />;
  if (!choosing && selected === "dragon") return <CaveRoom basePath={basePath} onChooseFriend={() => setChoosing(true)} onDetails={() => setDetailsId("dragon")} onEditName={() => { setName(dragon?.name ?? ""); setNaming(true); }} />;
  return <section className="friend-picker" aria-labelledby="friend-title">
    <div className="friend-picker-heading"><p className="friend-eyebrow">Una aventura juntos</p><h1 id="friend-title">Elige a tu pequeño amigo</h1><p>¡Un amigo especial te espera para explorar y jugar!</p></div>
    <div className="friend-grid">{companions.map((friend) => <article className="friend-card" key={friend.id}>
      <div className="friend-art"><Image src={`${basePath}${friend.image}`} alt="" width={220} height={220} unoptimized /></div>
      <h2>{friend.name}</h2>
      {friend.available ? <button type="button" disabled={state.ownership !== "exclusive"} onClick={() => { if (dragon && selected === friend.id) { setChoosing(false); } else { setName(dragon?.name ?? ""); setNaming(true); } }}>{selected === friend.id ? `Volver con ${friend.name}` : `Elegir a ${friend.name}`}</button> : <span className="friend-soon">¡Próximamente!</span>}
    </article>)}</div>
    {state.ownership !== "exclusive" && <p role="alert">Abre esta aventura en una sola pestaña para elegir a tu amigo.</p>}
    <div className="friend-links">{selected && <button type="button" onClick={() => setChoosing(false)}>Volver con mi amigo</button>}{state.snapshot.legacyCompanion && state.snapshot.legacyCompanion.avatarId !== "dragon" && <button type="button" onClick={() => setDetailsId(state.snapshot.legacyCompanion!.avatarId)}>Ver a {state.snapshot.legacyCompanion.name}</button>}<Link href="/">Volver al mundo</Link></div>
  </section>;
}
