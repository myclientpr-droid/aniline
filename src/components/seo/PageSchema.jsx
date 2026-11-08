import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, webPageJsonLd } from '@/lib/schema';

/**
 * The standard trio for a static page: the page node, its breadcrumb, and whatever extra nodes the
 * page passes (ItemList, Person, FAQ…). Home is implied as the first crumb and the first heading.
 *
 * @param {{
 *   path: string,
 *   title: string,
 *   description?: string,
 *   type?: string,
 *   nodes?: object[],
 * }} props
 */
export default function PageSchema({ path, title, description, type, nodes = [] }) {
    const breadcrumb = breadcrumbJsonLd([
        { name: 'Home', path: '/' },
        ...(path === '/' ? [] : [{ name: title, path }]),
    ]);

    return (
        <JsonLd
            data={[
                webPageJsonLd({ path, name: title, description, type }),
                ...(path === '/' ? [] : [breadcrumb]),
                ...nodes.map((node) => ({ '@context': 'https://schema.org', ...node })),
            ]}
        />
    );
}
