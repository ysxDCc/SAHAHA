import Image from "next/image";
import { imageAssets } from "@/data/site";

export function PageHero({ eyebrow, title, description, image = imageAssets.SAHA_HERO_IMAGE }: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
}) {
  return (
    <section className="page-hero">
      <Image src={image} alt="" fill priority sizes="100vw" className="page-hero__image" />
      <div className="page-hero__scrim" />
      <div className="shell page-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
