import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'PLUSTECH - Surface Finishing Solutions & Automation Systems',
  description = 'PLUSTECH provides innovative surface finishing plants, automation solutions, and smart manufacturing systems. Leading provider of paint shop solutions and industrial automation.',
  image = '/Plustech_logo_final.png',
  url = '',
  type = 'website',
  keywords = 'surface finishing, automation, paint shop, industrial automation, manufacturing solutions',
}) => {
  const fullTitle = title.includes('PLUSTECH') ? title : `${title} | PLUSTECH`;
  const fullUrl = url ? `https://plustech.com${url}` : 'https://plustech.com';
  const fullImageUrl = image.startsWith('http') ? image : `https://plustech.com${image}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="PLUSTECH" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
    </Helmet>
  );
};

