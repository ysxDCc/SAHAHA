import Image from "next/image";
import { CalendarCheck2, Camera, GlassWater, MapPin, Music2, Phone, Sparkles, Trees, Volume2 } from "lucide-react";
import { ButtonLink } from "./ButtonLink";
import { Reveal } from "./Reveal";
import { DrinksShowcase } from "./DrinksShowcase";
import { EventsSlider } from "./EventsSlider";
import { GalleryGrid } from "./GalleryGrid";
import { ReservationForm } from "./ReservationForm";
import { ContactMap } from "./ContactMap";
import { HeroMedia } from "./HeroMedia";
import { imageAssets, siteConfig } from "@/data/site";

export function Hero() {
  return (
    <section className="hero" id="domov">
      <HeroMedia />
      <div className="hero__overlay" />
      <div className="hero__light" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="shell hero__content">
        <p className="eyebrow hero-reveal hero-reveal--1"><MapPin size={14} aria-hidden="true" /> Cocktail bar · Župná 16</p>
        <h1 className="hero-reveal hero-reveal--2">SAHA <em>BAR</em></h1>
        <h2 className="hero-reveal hero-reveal--3">Zlaté Moravce po zotmení začínajú tu.</h2>
        <p className="hero__copy hero-reveal hero-reveal--4">Objav večery plné kvalitných cocktailov, hudby, priateľov a nezabudnuteľnej atmosféry priamo v centre Zlatých Moraviec.</p>
        <div className="hero__actions hero-reveal hero-reveal--5">
          <ButtonLink href="#rezervacia">Rezervovať stôl</ButtonLink>
          <ButtonLink href="/drink-menu" variant="secondary">Pozrieť drink menu</ButtonLink>
        </div>
        <p className="hero__promise hero-reveal hero-reveal--5">Cocktails <span /> Live music <span /> Nights to remember</p>
      </div>
      <div className="hero__logo-stamp hero-reveal hero-reveal--4">
        <Image src={imageAssets.SAHA_LOGO_OFFICIAL} alt="Logo SAHA BAR" width={124} height={124} priority />
      </div>
      <a className="scroll-cue" href="#o-nas" aria-label="Prejsť na sekciu O nás"><span />Scroll</a>
      <div className="hero__side-note">Cocktails · Music · Nights</div>
    </section>
  );
}

export function AboutSection() {
  const features = [
    { icon: GlassWater, label: "Kvalitné cocktaily" },
    { icon: Music2, label: "Živá hudba" },
    { icon: Sparkles, label: "Večerná atmosféra" },
    { icon: Trees, label: "Vonkajšie posedenie" },
  ];
  return (
    <section className="section about" id="o-nas">
      <div className="orb orb--rose" aria-hidden="true" />
      <div className="shell about__grid">
        <Reveal className="about__copy">
          <p className="eyebrow">O SAHA BARE · 01</p>
          <h2>Viac než<br /><em>len bar</em></h2>
          <p>SAHA BAR je miestom pre ľudí, ktorí si chcú vychutnať kvalitný drink, dobrú hudbu a večer v príjemnej spoločnosti. Či už prichádzaš na cocktail po práci, večerné posedenie s priateľmi alebo na jedno z našich podujatí, čaká ťa atmosféra, kvôli ktorej sa budeš chcieť vrátiť.</p>
          <div className="feature-grid">
            {features.map(({ icon: Icon, label }) => <div key={label}><Icon aria-hidden="true" /><span>{label}</span></div>)}
          </div>
        </Reveal>
        <Reveal className="about__visual" delay={0.12} variant="image">
          <div className="about__image-main"><Image src={imageAssets.SAHA_INTERIOR_01} alt="Elegantné sedenie v interiéri SAHA BARU" fill sizes="(max-width: 800px) 100vw, 52vw" /></div>
          <div className="about__image-float"><Image src={imageAssets.SAHA_LOGO} alt="Svetelné logo SAHA BARU" fill sizes="(max-width: 800px) 45vw, 20vw" /></div>
          <div className="about__badge"><span>Večer má</span><b>vlastný rytmus</b></div>
        </Reveal>
      </div>
    </section>
  );
}

export function DrinksSection() {
  return (
    <section className="section drinks-section" id="drinky">
      <div className="shell">
        <Reveal className="section-heading section-heading--split">
          <div><p className="eyebrow">DRINK MENU · 02</p><h2>Signature<br /><em>Drinks</em></h2></div>
          <p>Drinky vytvorené pre večery, na ktoré sa nezabúda. Každý má vlastný charakter — rovnako ako noc, počas ktorej si ho dáš.</p>
        </Reveal>
        <Reveal delay={0.1} variant="scale"><DrinksShowcase compact /></Reveal>
      </div>
    </section>
  );
}

export function EventsSection() {
  return (
    <section className="section events-section" id="podujatia">
      <div className="shell">
        <Reveal className="section-heading">
          <p className="eyebrow">PROGRAM · 03</p>
          <h2>Najbližšie <em>večery</em></h2>
          <p>Hudba, drinky a atmosféra, ktorú musíš zažiť.</p>
        </Reveal>
        <Reveal delay={0.1} variant="scale"><EventsSlider showAll={false} /></Reveal>
        <div className="section-action"><ButtonLink href="/podujatia" variant="text">Všetky podujatia</ButtonLink></div>
      </div>
    </section>
  );
}

export function AtmosphereSection() {
  return (
    <section className="atmosphere">
      <Image src={imageAssets.SAHA_PEOPLE_01} alt="Večerná atmosféra na terase SAHA BARU" fill sizes="100vw" />
      <div className="atmosphere__overlay" />
      <Reveal className="shell atmosphere__content">
        <Volume2 aria-hidden="true" />
        <blockquote>„Niektoré večery si nepamätáš podľa času. <em>Pamätáš si ich podľa atmosféry.</em>“</blockquote>
      </Reveal>
    </section>
  );
}

export function GallerySection() {
  return (
    <section className="section gallery-section" id="galeria">
      <div className="shell">
        <Reveal className="section-heading section-heading--split">
          <div><p className="eyebrow">GALÉRIA · 04</p><h2>Noc v <em>obrazoch</em></h2></div>
          <p>Skutočný interiér, skutoční hostia a chvíle, ktoré dávajú SAHA BARU jeho tvár.</p>
        </Reveal>
        <Reveal variant="image"><GalleryGrid limit={6} /></Reveal>
        <div className="section-action"><ButtonLink href="/galeria" variant="text">Otvoriť celú galériu</ButtonLink></div>
      </div>
    </section>
  );
}

export function ReviewsSection() {
  const reviews = [
    "Skvelá atmosféra, príjemná obsluha a výborné drinky.",
    "Jedno z najlepších miest na večerné posedenie v Zlatých Moravciach.",
    "Prišli sme na jeden drink a zostali sme celý večer.",
    "Výborná hudba, príjemné prostredie a vždy dobrá nálada.",
  ];
  return (
    <section className="section reviews-section">
      <div className="shell">
        <Reveal className="section-heading"><p className="eyebrow">HLASY HOSTÍ · 05</p><h2>Čo hovoria <em>naši hostia</em></h2></Reveal>
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <Reveal className="review-card" delay={index * 0.04} key={review}>
              <div className="stars" aria-label="Pozitívne hodnotenie">★★★★★</div>
              <blockquote>„{review}“</blockquote>
              <span>Hosť SAHA BARU</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReservationSection() {
  const benefits = [
    { icon: GlassWater, title: "Večer so štýlom", text: "Cocktaily, hudba a atmosféra priamo v centre mesta." },
    { icon: CalendarCheck2, title: "Jednoduchá rezervácia", text: "Vyberieš termín a my ti rezerváciu následne potvrdíme." },
    { icon: Sparkles, title: "Interiér alebo terasa", text: "Zvoľ si miesto, ktoré najlepšie sedí tvojmu večeru." },
  ];
  return (
    <section className="section reservation-section" id="rezervacia">
      <Image className="reservation-section__background" src={imageAssets.SAHA_HERO_IMAGE} alt="" fill sizes="100vw" aria-hidden="true" />
      <div className="reservation-section__overlay" aria-hidden="true" />
      <div className="noise" aria-hidden="true" />
      <div className="shell reservation__grid">
        <Reveal className="reservation__intro">
          <p className="eyebrow">REZERVÁCIA · 06</p>
          <h2>Rezervácia<br /><em>stola</em></h2>
          <p>Rezervuj si svoje miesto jednoducho online a príď si užiť SAHA večer bez zbytočného čakania.</p>
          <div className="reservation__benefits">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title}><i><Icon aria-hidden="true" /></i><span><b>{title}</b><small>{text}</small></span></div>
            ))}
          </div>
          <div className="reservation__alternatives" aria-label="Alternatívne možnosti rezervácie">
            <a href={`tel:${siteConfig.phoneHref}`}><Phone aria-hidden="true" /><span>Zavolať a rezervovať<b>{siteConfig.phoneDisplay}</b></span></a>
            <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer"><Camera aria-hidden="true" /><span>Napísať cez Instagram<b>{siteConfig.social.instagramHandle}</b></span></a>
          </div>
        </Reveal>
        <Reveal className="reservation__form-wrap" delay={0.1} variant="scale"><ReservationForm /></Reveal>
      </div>
    </section>
  );
}

export function ContactSection() {
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.mapQuery)}`;
  return (
    <section className="section contact-section" id="kontakt">
      <div className="shell contact__grid">
        <Reveal className="contact__info">
          <p className="eyebrow">KONTAKT · 07</p>
          <h2>Stretneme sa<br /><em>v centre mesta</em></h2>
          <address><b>{siteConfig.name}</b>{siteConfig.address.street}<br />{siteConfig.address.postalCode} {siteConfig.address.city}<a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a></address>
          <div className="contact__actions">
            <ButtonLink href={`tel:${siteConfig.phoneHref}`}>Zavolať</ButtonLink>
            <ButtonLink href={mapsHref} external variant="secondary">Otvoriť v Google Maps</ButtonLink>
          </div>
          <div className="hours-list">
            <p>Otváracie hodiny</p>
            {siteConfig.openingHours.map((item) => <div key={item.days}><span>{item.days}</span><b>{item.hours}</b></div>)}
          </div>
        </Reveal>
        <Reveal className="contact__map" delay={0.1} variant="image"><ContactMap /></Reveal>
      </div>
    </section>
  );
}
