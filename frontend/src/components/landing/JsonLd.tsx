const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function JsonLd() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Conecta Joven Cartagena",
        description:
          "Plataforma digital que centraliza convocatorias, organizaciones y espacios de participacion juvenil en Cartagena.",
        inLanguage: "es-CO",
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/opportunities?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Conecta Joven Cartagena",
        url: siteUrl,
        description:
          "Ecosistema digital para que jovenes de Cartagena descubran oportunidades, organizaciones y espacios de incidencia territorial.",
        areaServed: {
          "@type": "City",
          name: "Cartagena de Indias",
          addressRegion: "Bolivar",
          addressCountry: "CO",
        },
        audience: {
          "@type": "PeopleAudience",
          suggestedMinAge: 14,
          suggestedMaxAge: 28,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
