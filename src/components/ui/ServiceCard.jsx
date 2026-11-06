import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

/**
 * @param {{
 *   service: {
 *     title: string,
 *     slug?: string,
 *     shortDescription?: string,
 *     audience?: string[],
 *   },
 *   index?: number,
 * }} props
 */
export default function ServiceCard({ service, index }) {
    const { title, slug, shortDescription, audience = [] } = service;
    const href = slug ? `/services/${slug}` : '/services';

    return (
        <article className="group card-hover specular-warm elevate-2 flex h-full flex-col rounded-lg bg-white p-6 md:p-7">
            {typeof index === 'number' && (
                <span className="text-xs font-semibold text-orange tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                </span>
            )}
            <h3 className="text-navy text-xl mt-3">{title}</h3>
            {shortDescription && (
                <p className="text-slate text-sm mt-3 flex-1">{shortDescription}</p>
            )}

            {audience.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                    {audience.slice(0, 3).map((a) => (
                        <li
                            key={a}
                            className="text-xs text-slate border border-navy/10 rounded-full px-3 py-1"
                        >
                            {a}
                        </li>
                    ))}
                </ul>
            )}

            <Link
                href={href}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-orange transition-colors"
                aria-label={`Learn more about ${title}`}
            >
                Learn more
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
        </article>
    );
}