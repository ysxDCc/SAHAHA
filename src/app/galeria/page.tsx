import type { Metadata } from "next";
import { GalleryGrid } from "@/components/GalleryGrid";
import { PageHero } from "@/components/PageHero";
import { imageAssets } from "@/data/site";

export const metadata: Metadata = { title: "Galéria", description: "Interiér, bar, terasa a skutočná večerná atmosféra SAHA BARU v Zlatých Moravciach.", alternates: { canonical: "/galeria" } };

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="GALÉRIA · SAHA BAR" title="Atmosféra zachytená v obrazoch." description="Pozrite sa dovnútra. Skutočné priestory, večerné svetlo a chvíle zo SAHA BARU." image={imageAssets.SAHA_INTERIOR_01} />
      <section className="section subpage-section"><div className="shell"><div className="section-heading section-heading--split"><div><p className="eyebrow">INTERIÉR · BAR · ĽUDIA</p><h2>Noc v <em>obrazoch</em></h2></div><p>Fotografie otvoríte kliknutím. Galériu môžete ovládať šípkami na klávesnici alebo potiahnutím na mobile.</p></div><GalleryGrid /></div></section>
    </>
  );
}
