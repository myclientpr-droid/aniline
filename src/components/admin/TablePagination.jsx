'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const linkBase =
    'inline-flex items-center gap-1 rounded-md border px-3 py-2 text-sm font-medium transition-colors';
const enabled = `${linkBase} border-navy/15 bg-white text-navy hover:bg-navy/5`;
const disabled = `${linkBase} border-navy/10 bg-navy/5 text-slate/50 pointer-events-none`;

/**
 * Prev/Next pagination over the current query string. Renders nothing when
 * there is a single page.
 */
export default function TablePagination({ basePath, page = 1, totalPages = 1 }) {
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const href = (target) => {
        const params = new URLSearchParams(searchParams.toString());
        if (target <= 1) params.delete('page');
        else params.set('page', String(target));
        const query = params.toString();
        return query ? `${basePath}?${query}` : basePath;
    };

    return (
        <nav className="flex items-center justify-between gap-4 mt-4" aria-label="Pagination">
            <Link
                href={href(page - 1)}
                rel="prev"
                className={page <= 1 ? disabled : enabled}
                aria-disabled={page <= 1}
            >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                Previous
            </Link>
            <span className="text-slate text-sm">
                Page {page} of {totalPages}
            </span>
            <Link
                href={href(page + 1)}
                rel="next"
                className={page >= totalPages ? disabled : enabled}
                aria-disabled={page >= totalPages}
            >
                Next
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
        </nav>
    );
}
