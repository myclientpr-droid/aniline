'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

/**
 * @param {{
 *   categories: string[],
 *   allLabel?: string,
 * }} props
 */
export default function ProjectFilter({ categories,
    allLabel = 'All',
    paramName = 'category',   // <-- new
    ariaLabel = 'Filter by category', }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const active = searchParams.get(paramName) || '';

    const buildHref = (value) => {
        if (!value) return pathname;
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramName, value);
        return `${pathname}?${params.toString()}`;
    };

    return (
        <nav aria-label={ariaLabel} className="border-y border-navy/10">
            <ul className="container-default flex flex-wrap gap-1 py-3 md:gap-2">
                <li>
                    <Link
                        href={buildHref('')}
                        aria-current={!active ? 'page' : undefined}
                        className={`press-chip inline-block rounded-full px-4 py-2 text-sm font-medium transition-colors ${!active
                            ? 'bg-navy text-white'
                            : 'text-slate hover:text-navy hover:bg-navy/5'
                            }`}
                    >
                        {allLabel}
                    </Link>
                </li>
                {categories.map((cat) => {
                    const isActive = active === cat;
                    return (
                        <li key={cat}>
                            <Link
                                href={buildHref(cat)}
                                aria-current={isActive ? 'page' : undefined}
                                className={`press-chip inline-block rounded-full px-4 py-2 text-sm font-medium transition-colors ${isActive
                                    ? 'bg-navy text-white'
                                    : 'text-slate hover:text-navy hover:bg-navy/5'
                                    }`}
                            >
                                {cat}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}