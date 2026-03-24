import { useEffect } from 'react';

interface MetaTagsConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  twitterHandle?: string;
}

/**
 * Hook pour mettre à jour dynamiquement les meta tags d'une page
 * Utilisé pour SEO et partage réseaux sociaux
 */
export const useMetaTags = (config: MetaTagsConfig) => {
  useEffect(() => {
    // Mettre à jour le titre
    document.title = config.title;

    // Mettre à jour ou créer meta description
    let descTag = document.querySelector('meta[name="description"]');
    if (!descTag) {
      descTag = document.createElement('meta');
      descTag.setAttribute('name', 'description');
      document.head.appendChild(descTag);
    }
    descTag.setAttribute('content', config.description);

    // Open Graph - og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', config.title);

    // Open Graph - og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', config.description);

    // Open Graph - og:image
    if (config.image) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', config.image);
    }

    // Open Graph - og:url
    if (config.url) {
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement('meta');
        ogUrl.setAttribute('property', 'og:url');
        document.head.appendChild(ogUrl);
      }
      ogUrl.setAttribute('content', config.url);
    }

    // Open Graph - og:type
    let ogType = document.querySelector('meta[property="og:type"]');
    if (!ogType) {
      ogType = document.createElement('meta');
      ogType.setAttribute('property', 'og:type');
      document.head.appendChild(ogType);
    }
    ogType.setAttribute('content', config.type || 'website');

    // Twitter Card
    let twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta');
      twitterTitle.setAttribute('name', 'twitter:title');
      document.head.appendChild(twitterTitle);
    }
    twitterTitle.setAttribute('content', config.title);

    let twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twitterDesc) {
      twitterDesc = document.createElement('meta');
      twitterDesc.setAttribute('name', 'twitter:description');
      document.head.appendChild(twitterDesc);
    }
    twitterDesc.setAttribute('content', config.description);

    if (config.image) {
      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', config.image);
    }

    if (config.twitterHandle) {
      let twitterHandle = document.querySelector('meta[name="twitter:creator"]');
      if (!twitterHandle) {
        twitterHandle = document.createElement('meta');
        twitterHandle.setAttribute('name', 'twitter:creator');
        document.head.appendChild(twitterHandle);
      }
      twitterHandle.setAttribute('content', config.twitterHandle);
    }

  }, [config.title, config.description, config.image, config.url, config.type, config.twitterHandle]);
};
