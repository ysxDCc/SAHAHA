import type { Metadata } from "next";
import { DrinksShowcase } from "@/components/DrinksShowcase";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ButtonLink";
import { imageAssets } from "@/data/site";

export const metadata: Metadata = { title: "Drink menu", description: "Objavte signature cocktaily a obľúbené drinky v SAHA BARE v Zlatých Moravciach.", alternates: { canonical: "/drink-menu" } };

export default function DrinkMenuPage() {
  return (
    <>
      <PageHero eyebrow="SAHA BAR · DRINK MENU" title="Chuť, ktorá patrí k noci." description="Signature cocktaily, klasiky a osviežujúce drinky pripravené pre váš večer." image={imageAssets.SAHA_DRINK_01} />
      <section className="section subpage-section">
        <div className="shell">
          <div className="section-heading section-heading--split"><div><p className="eyebrow">VÝBER BARMANA</p><h2>Signature <em>Drinks</em></h2></div><p>Ceny a zloženie sú pripravené ako ľahko upraviteľné údaje. Aktuálnu ponuku potvrďte priamo v bare.</p></div>
          <DrinksShowcase />
          <div className="subpage-cta"><p>Vybraný drink chutí najlepšie pri dobrom stole.</p><ButtonLink href="/#rezervacia">Rezervovať stôl</ButtonLink></div>
        </div>
      </section>
    </>
  );
}
