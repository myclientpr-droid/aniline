import Link from 'next/link';

function formatDate(value) {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Journal index card. No hero photograph yet: the ones that exist are stills. A typographic card
 * keyed to the article's section reads deliberately rather than looking like a broken image.
 * @param {{ article: object }} props
 */
export default function ArticleCard({ article }) {
  return (
    <article className="group h-full">
      <Link
        href={`/journal/${article.slug}`}
        className="flex h-full flex-col rounded-lg border border-navy/10 p-6 transition-colors hover:border-navy/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange md:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="text-orange text-xs font-semibold uppercase tracking-[0.18em]">
            {article.section}
          </span>
          <time
            dateTime={article.datePublished}
            className="text-slate text-xs uppercase tracking-wider"
          >
            {formatDate(article.datePublished)}
          </time>
        </div>
        <h3 className="text-navy text-xl md:text-2xl leading-snug mt-4 group-hover:text-navy-dark text-balance">
          {article.title}
        </h3>
        <p className="text-slate text-sm mt-3 flex-1">{article.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy group-hover:text-orange transition-colors">
          Read the article
          <span aria-hidden="true">&rarr;</span>
        </span>
      </Link>
    </article>
  );
}
