import type { Metadata } from "next";
import { ContactSection, ReservationSection } from "@/components/HomeSections";
import { PageHero } from "@/components/PageHero";
import { imageAssets } from "@/data/site";

export const metadata: Metadata = { title: "Kontakt a rezervácia", description: "Kontakt, mapa a rezervácia stola v SAHA BARE na Župnej 16 v Zlatých Moravciach.", alternates: { canonical: "/kontakt" } };

export default function ContactPage() {
  return (
    <>
      <PageHero eyebrow="KONTAKT · REZERVÁCIA" title="Váš večer je bližšie, než si myslíte." description="Nájdete nás na Župnej 16 priamo v Zlatých Moravciach." image={imageAssets.SAHA_EXTERIOR_01} />
      <ContactSection />
      <ReservationSection />
    </>
  );
}
