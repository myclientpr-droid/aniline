import Link from 'next/link';

/**
 * Long-form article body. Static content in, headings and paragraphs out — the page owns the h1,
 * so sections start at h2.
 * @param {{ article: object, linkedServices?: { title: string, slug: string }[], related?: object[] }} props
 */
export default function ArticleBody({ article, linkedServices = [], related = [] }) {
  return (
    <article className="bg-white">
      <div className="max-w-3xl">
        {article.sections.map((section) => (
          <section key={section.heading} className="mt-10 first:mt-0">
            <h2 className="text-navy text-2xl md:text-3xl text-balance">{section.heading}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-slate leading-relaxed mt-4">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {article.faqs?.length > 0 && (
          <section className="mt-14 border-t border-navy/10 pt-8">
            <h2 className="text-navy text-2xl">Quick answers</h2>
            <div className="mt-6 divide-y divide-navy/10 border-y border-navy/10">
              {article.faqs.map((faq) => (
                <details key={faq.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-navy font-semibold [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span
                      aria-hidden="true"
                      className="text-orange text-xl leading-none transition-transform group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <p className="text-slate text-sm mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {(linkedServices.length > 0 || related.length > 0) && (
          <aside className="mt-14 rounded-lg bg-light p-6 md:p-8" aria-label="Related">
            {linkedServices.length > 0 && (
              <div>
                <h2 className="text-navy text-lg">Related services</h2>
                <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                  {linkedServices.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="text-sm font-semibold text-navy underline underline-offset-4 hover:text-orange"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {related.length > 0 && (
              <div className={linkedServices.length ? 'mt-6' : ''}>
                <h2 className="text-navy text-lg">Keep reading</h2>
                <ul className="mt-3 space-y-2">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/journal/${item.slug}`}
                        className="text-sm text-slate hover:text-navy transition-colors"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>
    </article>
  );
}
