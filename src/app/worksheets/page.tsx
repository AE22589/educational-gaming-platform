import { ComingSoon } from "@/components/ui/ComingSoon";

export const metadata = {
  title: "Fichas de actividades para niños · Chispitas",
};

export default function WorksheetsPage() {
  const basePath =
    process.env.GITHUB_ACTIONS === "true" ? "/educational-gaming-platform" : "";

  return (
    <ComingSoon
      title="Fichas de actividades para niños"
      image={`${basePath}/homepage/worksheet-activities.webp`}
    >
      <p>Pronto podrás descargar aquí fichas en PDF para imprimir y hacer en casa.</p>
    </ComingSoon>
  );
}
