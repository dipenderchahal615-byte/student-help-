import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    tags?: string[];
  };
  breadcrumbs?: Array<{ name: string; url: string }>;
  faqs?: Array<{ question: string; answer: string }>;
}

export function SEO({ 
  title = 'StudentHelp - Smart Digital Companion', 
  description = 'Everything Students Need. In One Place. Study smarter, build your career, create your resume and use powerful AI tools.',
  keywords = 'student help, study planner, ai tools for students, resume builder, career roadmap, study tracker, interview practice',
  image = 'https://studenthelp.com/icon.png',
  url,
  type = 'website',
  article,
  breadcrumbs,
  faqs
}: SEOProps) {
  const fullTitle = title === 'StudentHelp - Smart Digital Companion' ? title : `${title} | StudentHelp`;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://studenthelp.com');

  // Organization Schema (site-wide)
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StudentHelp",
    "url": "https://studenthelp.com",
    "logo": "https://studenthelp.com/icon.png",
    "sameAs": [
      "https://twitter.com/studenthelp",
      "https://linkedin.com/company/studenthelp"
    ]
  };

  // Article Schema (if type is article)
  let articleSchema = null;
  if (type === 'article') {
    articleSchema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "image": [image],
      "datePublished": article?.publishedTime || new Date().toISOString(),
      "dateModified": article?.modifiedTime || article?.publishedTime || new Date().toISOString(),
      "author": [{
        "@type": "Person",
        "name": article?.author || "StudentHelp Team"
      }],
      "description": description
    };
  }

  let breadcrumbSchema = null;
  if (breadcrumbs && breadcrumbs.length > 0) {
    breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
  }

  let faqSchema = null;
  if (faqs && faqs.length > 0) {
    faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  }

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Article specific OG tags */}
      {type === 'article' && article?.publishedTime && (
        <meta property="article:published_time" content={article.publishedTime} />
      )}
      {type === 'article' && article?.modifiedTime && (
        <meta property="article:modified_time" content={article.modifiedTime} />
      )}
      {type === 'article' && article?.author && (
        <meta property="article:author" content={article.author} />
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(orgSchema)}
      </script>
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
      {faqSchema && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      )}
    </Helmet>
  );
}
