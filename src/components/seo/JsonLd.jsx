import { stringifyJsonLd } from '@/lib/schema';

/**
 * Renders a JSON-LD block. The content is generated from site data, never from user input, and
 * `stringifyJsonLd` escapes `<` so a string value cannot close the script element early.
 * @param {{ data: object|object[] }} props
 */
export default function JsonLd({ data }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: stringifyJsonLd(data) }}
        />
    );
}
