import type { ReactNode } from "react";
export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="mb-3 text-2xl font-bold text-teal-950">{title}</h2>
      {children}
    </section>
  );
}
