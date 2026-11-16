import Link from "next/link";

type Crumb = { label: string; labelEn?: string; href?: string };

export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumb" aria-label="面包屑 Breadcrumb">
      <div className="flex gap-2 flex-wrap items-center">
        <Link href="/" className="text-link hover:underline">
          首页<span className="en ml-1">Home</span>
        </Link>
        {items.map((it, i) => (
          <span key={i} className="flex gap-2 items-center">
            <span className="text-line-strong">/</span>
            {it.href ? (
              <Link href={it.href} className="text-link hover:underline">{it.label}</Link>
            ) : (
              <span className="text-ink-2">
                {it.label}
                {it.labelEn && <span className="en ml-1.5">{it.labelEn}</span>}
              </span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
