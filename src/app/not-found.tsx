import Link from "next/link";

export default function NotFound() {
  return <section className="not-found shell"><p className="eyebrow">404 · SAHA BAR</p><h1>Táto noc sa<br /><em>ešte nezačala.</em></h1><p>Stránka, ktorú hľadáte, neexistuje alebo bola presunutá.</p><Link className="button button--primary" href="/">Späť domov</Link></section>;
}
