import Link from "next/link";
import { BODY_PARTS_TEXT } from "@/features/learning/body-parts-mission";
export default function Learn() {
  return <section className="body-mission-card"><p className="body-mission-kicker">AVENTURAS DE INGLÉS</p><h1>Misiones para descubrir</h1><Link className="body-mission-entry" href="/scienceworld/body"><span aria-hidden="true">🧍</span><span><strong>{BODY_PARTS_TEXT.title}</strong><small>Coloca cada palabra y acompaña al dragón.</small></span><b aria-hidden="true">➜</b></Link><Link className="body-mission-back" href="/">Volver al inicio</Link></section>;
}
