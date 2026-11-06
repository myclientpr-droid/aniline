import Link from 'next/link';

/**
 * @param {{
 *   label: string,
 *   value: number | string,
 *   sublabel?: string,
 *   href?: string,
 *   accent?: boolean,
 * }} props
 */
export default function StatCard({ label, value, sublabel, href, accent = false }) {
    const inner = (
        <div
            className={`h-full rounded-lg border bg-white p-5 transition-colors ${href ? 'hover:border-navy/30' : ''
                } ${accent ? 'border-orange/40' : 'border-navy/10'}`}
        >
            <p className="text-slate text-xs uppercase tracking-wider">{label}</p>
            <p className="text-navy text-3xl font-bold mt-3">{value}</p>
            {sublabel && <p className="text-slate text-xs mt-2">{sublabel}</p>}
        </div>
    );

    if (href) {
        return (
            <Link href={href} className="block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange">
                {inner}
            </Link>
        );
    }
    return inner;
}