import Image from "next/image";
import Link from "next/link";
import { imageAssets } from "@/data/site";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link className={`brand ${compact ? "brand--compact" : ""}`} href="/" aria-label="SAHA BAR – domov">
      <span className="brand__logo">
        <Image src={imageAssets.SAHA_LOGO_OFFICIAL} alt="" width={compact ? 52 : 72} height={compact ? 52 : 72} priority={compact} />
      </span>
      <span className="brand__text"><b>SAHA BAR</b><small>Zlaté Moravce</small></span>
    </Link>
  );
}
