import Link from "next/link";
import { Brand } from "./Brand";
import { navItems, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" aria-hidden="true" />
      <div className="shell footer__grid">
        <div className="footer__intro">
          <Brand />
          <p>{siteConfig.slogan}</p>
        </div>
        <div>
          <p className="footer__label">Nájdete nás</p>
          <address>
            {siteConfig.address.street}<br />
            {siteConfig.address.postalCode} {siteConfig.address.city}<br />
            <a href={`tel:${siteConfig.phoneHref}`}>{siteConfig.phoneDisplay}</a>
          </address>
        </div>
        <div>
          <p className="footer__label">Navigácia</p>
          <nav className="footer__links" aria-label="Navigácia v pätičke">
            {navItems.slice(1).map((item) => <Link href={item.href} key={item.label}>{item.label}</Link>)}
          </nav>
        </div>
        <div>
          <p className="footer__label">Otváracie hodiny</p>
          <div className="hours-list hours-list--footer">
            {siteConfig.openingHours.map((item) => (
              <div key={item.days}><span>{item.days}</span><b>{item.hours}</b></div>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footer__bottom">
        <p>© {new Date().getFullYear()} SAHA BAR</p>
        <div>
          <Link href="/ochrana-osobnych-udajov">Ochrana osobných údajov</Link>
          <Link href="/cookies">Cookies</Link>
          <a href={siteConfig.social.instagram} target="_blank" rel="noreferrer">Instagram · {siteConfig.social.instagramHandle}</a>
        </div>
      </div>
    </footer>
  );
}
