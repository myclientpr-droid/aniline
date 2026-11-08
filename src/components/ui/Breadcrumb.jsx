import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

/**
 * Visible breadcrumb trail. Render it wherever `breadcrumbJsonLd` is emitted so the markup and the
 * structured data describe the same hierarchy.
 *
 * @param {{ items: { name: string, path?: string }[], tone?: 'dark' | 'light', className?: string }} props
 */
export default function Breadcrumb({ items, tone = 'light', className = '' }) {
    const linkTone = tone === 'dark' ? 'text-white/70 hover:text-white' : 'text-slate hover:text-navy';
    const currentTone = tone === 'dark' ? 'text-white' : 'text-navy';

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
                {items.map((item, i) => {
                    const last = i === items.length - 1;
                    return (
                        <li key={`${item.name}-${i}`} className="flex items-center gap-1.5">
                            {i > 0 && (
                                <ChevronRight
                                    className={`h-3 w-3 ${tone === 'dark' ? 'text-white/35' : 'text-navy/30'}`}
                                    aria-hidden="true"
                                />
                            )}
                            {last || !item.path ? (
                                <span aria-current={last ? 'page' : undefined} className={currentTone}>
                                    {item.name}
                                </span>
                            ) : (
                                <Link href={item.path} className={`transition-colors ${linkTone}`}>
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
