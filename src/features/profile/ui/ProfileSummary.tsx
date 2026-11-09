"use client";
import { useState, type ChangeEvent } from "react";
import { recoveryMessages } from "../ports";
import { MAX_SNAPSHOT_BYTES } from "../snapshot";
import { useProfile } from "./ProfileProvider";

function download(raw: string): void {
  const link = document.createElement("a");
  const url = URL.createObjectURL(
    new Blob([raw], { type: "application/json;charset=utf-8" }),
  );
  link.href = url;
  link.download = "aventura-animal-copia.json";
  link.click();
  URL.revokeObjectURL(url);
}

export function ProfileSummary() {
  const { service, state } = useProfile();
  const [message, setMessage] = useState<string | null>(null);
  if (state.status === "loading")
    return <p id="profile-summary" className="home-star-pill" role="status">Preparando tu perfil…</p>;
  if (state.status === "ready")
    return (
      <div id="profile-summary" aria-live="polite" className="home-star-pill">
        <svg aria-hidden="true" viewBox="0 0 32 32"><path d="m16 2 4.2 8.5 9.4 1.4-6.8 6.6 1.6 9.3L16 23.4l-8.4 4.4 1.6-9.3-6.8-6.6 9.4-1.4z" /></svg>
        <p><strong>{state.snapshot.stars}</strong><span lang="en"> Stars</span></p>
      </div>
    );

  const reason = state.reason;
  const raw = state.status === "recovery" ? state.raw : null;
  const backupRaw = state.status === "recovery" ? state.backupRaw : null;
  const exportCopy = async () => {
    const value = raw ?? (await service?.exportRaw());
    if (value) download(value);
    else setMessage("Todavía no encontramos una copia para descargar.");
  };
  const importCopy = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !service) return;
    if (file.size > MAX_SNAPSHOT_BYTES) {
      setMessage(recoveryMessages["oversized-import"]);
      return;
    }
    try {
      const result = await service.importSnapshot(await file.text());
      setMessage(
        result.status === "ready"
          ? "La copia se ha cargado correctamente."
          : result.status === "recovery"
            ? recoveryMessages[result.reason]
            : recoveryMessages["invalid-data"],
      );
    } catch {
      setMessage(recoveryMessages["invalid-data"]);
    }
  };
  const reset = async () => {
    if (
      !service ||
      !window.confirm(
        "¿Quieres borrar las estrellas y el progreso guardados en este navegador? Esta acción no se puede deshacer.",
      )
    )
      return;
    const result = await service.reset({ confirmedDataLoss: true });
    setMessage(
      result.status === "ready"
        ? "El progreso se ha reiniciado."
        : result.status === "recovery"
          ? recoveryMessages[result.reason]
          : recoveryMessages["invalid-data"],
    );
  };
  return (
    <section id="profile-summary" aria-labelledby="profile-recovery-title" className="home-profile-recovery" role="alert">
      <h2 id="profile-recovery-title" className="text-lg font-bold">No pudimos guardar tu progreso</h2>
      <p className="mt-2">{recoveryMessages[reason]}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" className="action" onClick={() => void service?.retry()}>Intentar de nuevo</button>
        <button type="button" className="action" onClick={() => void exportCopy()}>Descargar copia</button>
        {backupRaw && (
          <button type="button" className="action" onClick={() => void service?.restoreBackup()}>Restaurar copia anterior</button>
        )}
        <label className="action cursor-pointer">
          Cargar una copia
          <input aria-label="Cargar una copia guardada" className="sr-only" type="file" accept="application/json,.json" onChange={importCopy} />
        </label>
        <button type="button" className="action" onClick={() => void reset()}>Borrar progreso</button>
      </div>
      {message && <p role="status" className="mt-3">{message}</p>}
    </section>
  );
}
