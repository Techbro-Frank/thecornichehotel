/**
 * @file JsonLd — Renders a structured-data <script> tag
 * @description Server-safe (no "use client") — just serializes a schema.org
 *   object into a `<script type="application/ld+json">` tag. Escapes closing
 *   `</script>` sequences so arbitrary text content can never break out of
 *   the tag.
 */

export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
