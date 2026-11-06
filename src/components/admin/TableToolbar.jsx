'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

/**
 * Search + filter bar for admin list tables. Reads and writes URL query
 * params so server pages keep fetching; changing any filter resets `page`.
 */
export default function TableToolbar({
    basePath,
    q = '',
    status = '',
    statusOptions = [
        { value: 'all', label: 'All statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
    ],
    filters = [],
}) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [term, setTerm] = useState(q);

    const push = (changes) => {
        const params = new URLSearchParams(searchParams.toString());
        for (const [key, value] of Object.entries(changes)) {
            if (!value || value === 'all') params.delete(key);
            else params.set(key, value);
        }
        params.delete('page');
        const query = params.toString();
        router.push(query ? `${basePath}?${query}` : basePath);
    };

    const selectClass =
        'rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-colors';

    return (
        <form
            className="flex flex-wrap items-center gap-3 mb-4"
            onSubmit={(e) => {
                e.preventDefault();
                push({ q: term.trim() });
            }}
            role="search"
        >
            <div className="relative flex-1 min-w-52 max-w-sm">
                <Search
                    className="h-4 w-4 text-slate absolute left-3 top-1/2 -translate-y-1/2"
                    aria-hidden="true"
                />
                <input
                    type="search"
                    aria-label="Search"
                    placeholder="Search…"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    className="w-full rounded-md border border-navy/15 bg-white pl-9 pr-3 py-2 text-sm text-navy placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-orange focus:border-orange transition-colors"
                />
            </div>

            <select
                aria-label="Filter by status"
                value={status || 'all'}
                onChange={(e) => push({ status: e.target.value })}
                className={selectClass}
            >
                {statusOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>

            {filters.map((f) => (
                <select
                    key={f.name}
                    aria-label={f.label}
                    value={f.value || 'all'}
                    onChange={(e) => push({ [f.name]: e.target.value })}
                    className={selectClass}
                >
                    <option value="all">{f.label}</option>
                    {f.options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            ))}
        </form>
    );
}
