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
  if (state.status === "loading") return <p role="status">Preparando tu perfil…</p>;
  if (state.status === "ready")
    return (
      <div aria-live="polite" className="mt-5 rounded-2xl bg-white/80 p-4">
        <p className="font-bold">Estrellas: {state.snapshot.stars}</p>
        {state.ownership === "read-only" && (
          <p className="mt-2 text-sm">Otra pestaña puede estar usando tu perfil. Aquí no se guardarán cambios.</p>
        )}
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
    <section aria-labelledby="profile-recovery-title" className="mt-5 rounded-2xl border border-amber-700 bg-white p-5" role="alert">
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
