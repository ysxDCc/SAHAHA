import type { Metadata } from "next";
import Image from "next/image";
import { EventsSlider } from "@/components/EventsSlider";
import { PageHero } from "@/components/PageHero";
import { ButtonLink } from "@/components/ButtonLink";
import { events } from "@/data/events";
import { imageAssets } from "@/data/site";

export const metadata: Metadata = { title: "Podujatia", description: "Najbližšie večery, živá hudba, DJ nights a špeciálne podujatia v SAHA BARE.", alternates: { canonical: "/podujatia" } };

export default function EventsPage() {
  return (
    <>
      <PageHero eyebrow="PROGRAM · SAHA BAR" title="Večery s vlastným rytmom." description="Hudba, hostia a špeciálne momenty. Vyberte si najbližší večer v SAHA BARE." image={imageAssets.SAHA_PEOPLE_01} />
      <section className="section subpage-section"><div className="shell"><div className="section-heading"><p className="eyebrow">NAJBLIŽŠIE PODUJATIA</p><h2>Čo nás <em>čaká</em></h2></div><EventsSlider /></div></section>
      <section className="section event-list-section"><div className="shell event-list">
        {events.map((event, index) => (
          <article id={`event-${index + 1}`} key={`${event.name}-${index}`}>
            <div className="event-list__image"><Image src={event.image} alt={`Fotografia k podujatiu ${event.name}`} fill sizes="(max-width: 800px) 100vw, 45vw" /></div>
            <div><p className="eyebrow">{event.day} · {event.date}</p><h2>{event.name}</h2><p>{event.description}</p><b>{event.time}</b><ButtonLink href="/#rezervacia">Rezervovať stôl</ButtonLink></div>
          </article>
        ))}
      </div></section>
    </>
  );
}
