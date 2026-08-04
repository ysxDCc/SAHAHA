import {
  AboutSection,
  AtmosphereSection,
  ContactSection,
  DrinksSection,
  EventsSection,
  GallerySection,
  Hero,
  ReservationSection,
  ReviewsSection,
} from "@/components/HomeSections";
import { siteConfig } from "@/data/site";

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BarOrPub",
    name: siteConfig.name,
    description: siteConfig.description,
    telephone: siteConfig.phoneHref,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      postalCode: siteConfig.address.postalCode,
      addressLocality: siteConfig.address.city,
      addressCountry: "SK",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <Hero />
      <AboutSection />
      <DrinksSection />
      <EventsSection />
      <AtmosphereSection />
      <GallerySection />
      <ReviewsSection />
      <ReservationSection />
      <ContactSection />
    </>
  );
}
