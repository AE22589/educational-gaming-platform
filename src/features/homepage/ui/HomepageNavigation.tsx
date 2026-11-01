import Link from "next/link";
import { comingSoonLabel, type HomepageSampleData } from "../data";

function ComingSoon() {
  return (
    <span className="chispitas-coming-soon">
      <span lang="en">{comingSoonLabel.english}</span>
      <span aria-hidden="true"> · </span>
      <span lang="es">{comingSoonLabel.spanish}</span>
    </span>
  );
}

export function HomepageHeaderNavigation({
  items,
}: {
  readonly items: HomepageSampleData["navigation"];
}) {
  return (
    <nav aria-label="Main navigation / Navegación principal" className="chispitas-navigation">
      {items.map((item) => {
        const label = (
          <>
            <span aria-hidden="true" className="chispitas-nav-icon">{item.icon}</span>
            <span lang="en">{item.label.english}</span>
            <span lang="es" className="chispitas-nav-spanish">{item.label.spanish}</span>
          </>
        );
        return item.destination.status === "available" ? (
          <Link className="chispitas-nav-link" href={item.destination.href} key={item.id} prefetch={false}>
            {label}
          </Link>
        ) : (
          <span className="chispitas-nav-unavailable" key={item.id}>
            {label}
            <ComingSoon />
          </span>
        );
      })}
    </nav>
  );
}
