import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "text";
  external?: boolean;
  className?: string;
};

export function ButtonLink({ href, children, variant = "primary", external, className = "" }: Props) {
  const classes = `button button--${variant} ${className}`.trim();
  const content = <>{children}<ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.7} /></>;

  if (external) {
    return <a className={classes} href={href} target="_blank" rel="noreferrer">{content}</a>;
  }

  return <Link className={classes} href={href}>{content}</Link>;
}
