
export const JsonLd = ({ jsonLdData }: { jsonLdData: object }) => <script type="application/ld+json" defer dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }} />;
