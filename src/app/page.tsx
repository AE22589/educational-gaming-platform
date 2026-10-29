import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ProfileSummary } from "@/features/profile/ui/ProfileSummary";
export default function Home() {
  return (
    <div className="space-y-10">
      <ProfileSummary />
      <section className="rounded-3xl bg-teal-100/60 p-6 sm:p-12">
        <p className="eyebrow mb-4">Un pequeño paso, una gran aventura</p>
        <h1 className="max-w-3xl">¡Vamos a aprender juntos!</h1>
        <p className="mb-7 mt-5 max-w-xl text-lg">
          Explora palabras nuevas, descubre animales y aprende a tu ritmo.
        </p>
        <Link className="action" href="/learn">
          Explorar misiones
        </Link>
        <p className="mt-5 text-sm">
          Vista de desarrollo. Las actividades todavía están en preparación.
        </p>
      </section>
      <div className="grid gap-5 md:grid-cols-3">
        <Card title="Aprender">
          <p>Un espacio para escuchar y descubrir palabras.</p>
          <Link href="/learn" className="action mt-5">
            Ver misiones
          </Link>
        </Card>
        <Card title="Tienda">
          <p>Más adelante encontrarás accesorios para tu aventura.</p>
          <Link href="/shop" className="action mt-5">
            Ver la tienda
          </Link>
        </Card>
        <Card title="Mi avatar">
          <p>Pronto podrás darle tu toque personal.</p>
          <Link href="/avatar" className="action mt-5">
            Ver mi avatar
          </Link>
        </Card>
      </div>
    </div>
  );
}
