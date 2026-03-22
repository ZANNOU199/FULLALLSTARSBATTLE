
import { useState, useEffect } from 'react';
import { CMSState } from '../types';
import api from '../services/api';

const INITIAL_STATE: CMSState = {
  companies: [],
  participants: [],
  program: [],
  articles: [],
  brackets: [],
  tickets: [],
  faq: [],
  timeline: [],
  legends: [],
  partners: [],
  media: [],
  categories: ['Competition', 'Workshop', 'Show', 'Talk', 'Social'],
  blog: { articles: [] },
  competition: { 
    rules: 'Règlement officiel de la compétition All Stars Battle International 2026', 
    prizePool: [
      { category: 'Champion 1v1', prize: '50,000€' },
      { category: 'Finaliste 1v1', prize: '25,000€' },
      { category: '3ème place 1v1', prize: '15,000€' },
      { category: 'Footwork Battle', prize: '10,000€' },
      { category: 'Powermoves Battle', prize: '10,000€' }
    ], 
    brackets: { 
      pouleA: { 
        huitiemes: [
          { id: 'a1', player1: 'VICTOR', player2: 'TBD', score1: '', score2: '', country1: 'États-Unis', country2: 'TBD', countryCode1: 'us', countryCode2: 'un' },
          { id: 'a2', player1: 'PHIL WIZARD', player2: 'TBD', score1: '', score2: '', country1: 'Canada', country2: 'TBD', countryCode1: 'ca', countryCode2: 'un' },
          { id: 'a3', player1: 'DANY DANN', player2: 'TBD', score1: '', score2: '', country1: 'France', country2: 'TBD', countryCode1: 'fr', countryCode2: 'un' },
          { id: 'a4', player1: 'SHIGEKIX', player2: 'TBD', score1: '', score2: '', country1: 'Japon', country2: 'TBD', countryCode1: 'jp', countryCode2: 'un' }
        ], 
        quarts: [
          { id: 'qa1', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' },
          { id: 'qa2', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' }
        ], 
        semis: [
          { id: 'sa1', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' }
        ] 
      }, 
      pouleB: { 
        huitiemes: [
          { id: 'b1', player1: 'LIGEE', player2: 'TBD', score1: '', score2: '', country1: 'Chine', country2: 'TBD', countryCode1: 'cn', countryCode2: 'un' },
          { id: 'b2', player1: 'KUZYA', player2: 'TBD', score1: '', score2: '', country1: 'Ukraine', country2: 'TBD', countryCode1: 'ua', countryCode2: 'un' },
          { id: 'b3', player1: 'LEE', player2: 'TBD', score1: '', score2: '', country1: 'Pays-Bas', country2: 'TBD', countryCode1: 'nl', countryCode2: 'un' },
          { id: 'b4', player1: 'QUAKE', player2: 'TBD', score1: '', score2: '', country1: 'Taïwan', country2: 'TBD', countryCode1: 'tw', countryCode2: 'un' }
        ], 
        quarts: [
          { id: 'qb1', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' },
          { id: 'qb2', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' }
        ], 
        semis: [
          { id: 'sb1', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' }
        ] 
      }, 
      final: { id: 'final', player1: 'TBD', player2: 'TBD', score1: '', score2: '', country1: '', country2: '', countryCode1: 'un', countryCode2: 'un' }
    } 
  },
  ticketing: { tickets: [], faqs: [] },
  history: { timeline: [], legends: [] },
  contact: { hero: { title: '', titleHighlight: '', description: '' }, sections: {} },
  partners: { logos: [], sponsoringPdfUrl: '#', cta: { title: '', subtitle: '', buttonText: '' } },
  globalConfig: { contact: { email: '', phone: '', address: '' }, socials: {}, seo: {}, hero: {}, competition: {}, dancers: {}, programmation: {}, vip: { features: [] }, stats: [], partners: {}, blog: {}, footer: {}, homepageStats: [], eventDate: '' },
  theme: { primary: '#d35f17', accent: '#1a1a1a', accentRed: '#d35f17', background: '#000000', surface: '#1a1a1a', text: '#ffffff', mutedText: '#999999' },
  pageBackgrounds: { 
    hero: { imageUrl: '', videoUrl: '', width: 1920, height: 1080, lastModified: '' }, 
    artisticScene: { imageUrl: '', width: 1920, height: 1080, lastModified: '' }, 
    dancers: { imageUrl: '', width: 1920, height: 1080, lastModified: '' }, 
    media: { imageUrl: '', width: 1920, height: 1080, lastModified: '' }, 
    contact: { imageUrl: '', width: 1920, height: 1080, lastModified: '' },
    competition: { imageUrl: '', width: 1920, height: 1080, lastModified: '' },
    vip: { imageUrl: '', width: 1920, height: 1080, lastModified: '' },
    participate: { imageUrl: '', width: 1920, height: 1080, lastModified: '' }
  },
  siteAssets: { backgrounds: [], illustrations: [], videos: [] },
  participate: { hero: { title: '', titleHighlight: '', subtitle: '' }, sections: {}, formFields: {}, successMessage: { title: '', subtitle: '' } },
  organizers: [],
  organizersConfig: { sectionTitle: '', sectionDescription: '', organizationName: '' },
  config: { contact: { email: '', phone: '', address: '', socials: {} }, seo: {}, hero: {}, stats: {}, sponsoringPdfUrl: '', competitionRules: '', judgingCriteria: '', prizePool: [] },
  featuredPiece: null
};
      id: '2',
      year: '2023',
      title: 'ÉDITION 2023 - L\'ENVOL AFRICAIN',
      champion: 'B-Boy Karim',
      description: 'La montée en puissance des talents africains sur la scène internationale du breaking.',
      image: 'https://picsum.photos/seed/hist2/800/450'
    },
    {
      id: '3',
      year: '2022',
      title: 'ÉDITION 2022 - RENAISSANCE',
      champion: 'B-Girl Aïssa',
      description: 'Retour après la pandémie avec une édition record en nombre de participants.',
      image: 'https://picsum.photos/seed/hist3/800/450'
    }
  ],
  hero: {
    sinceYear: '2013',
    totalEditions: '12',
    title: 'L\'HISTOIRE',
    titleHighlight: 'DE ALLSTARBATTLE',
    description: 'Tracing the evolution of urban-luxury breakdance from Genesis to the Global Stage.'
  },
  stats: {
    years: '13',
    editions: '12',
    countries: '45+',
    participants: '500+',
    prize: '10M'
  },
  wallOfFame: {
    title: 'WALL OF FAME',
    subtitle: 'The Legends Who Defined ASBI'
  },
  legends: [
    {
      id: '1',
      name: 'Storm',
      bio: 'Pionnier du breaking européen.',
      photo: 'https://picsum.photos/seed/storm/400/400',
      title: 'B-Boy Champion 2015',
      category: 'bboy',
      year: 2015,
      type: 'champion-1v1'
    },
    {
      id: '2',
      name: 'Roxrite',
      bio: 'Légende du Red Bull BC One.',
      photo: 'https://picsum.photos/seed/roxrite/400/400',
      title: 'B-Boy Champion 2017',
      category: 'bboy',
      year: 2017,
      type: 'champion-1v1'
    },
    {
      id: '3',
      name: 'Shorty Mack',
      bio: 'Pionnière féminine de la danse urbaine.',
      photo: 'https://picsum.photos/seed/shortymack/400/400',
      title: 'B-Girl Champion 2016',
      category: 'bgirl',
      year: 2016,
      type: 'champion-1v1'
    },
    {
      id: '4',
      name: 'Airlab Crew',
      bio: 'Crew légendaire de formation et compétition.',
      photo: 'https://picsum.photos/seed/airlab/400/400',
      title: 'Crew Champion 2014',
      category: 'crew',
      year: 2014,
      type: 'crew-vs-crew'
    }
  ],
  partners: [
    {
      id: '1',
      name: 'Institut Français',
      logo: 'https://picsum.photos/seed/if/200/100',
      category: 'Institutional'
    }
  ],
  config: {
    contact: {
      email: 'contact@asbi-togo.com',
      phone: '+228 90 00 00 00',
      address: 'Lomé, Togo',
      socials: {
        instagram: 'https://instagram.com/asbi_togo',
        facebook: 'https://facebook.com/asbi_togo',
        youtube: 'https://youtube.com/asbi_togo'
      }
    },
    seo: {
      title: 'ASBI 2026 | All Stars Battle International',
      description: 'Le plus grand événement de culture urbaine en Afrique.',
      keywords: 'dance, battle, breaking, togo, africa'
    },
    hero: {
      title: 'ALL STARS BATTLE INTERNATIONAL',
      subtitle: 'LOMÉ, TOGO | AOÛT 2026',
      backgroundImage: 'https://picsum.photos/seed/hero/1920/1080'
    },
    stats: {
      spectators: '5000+',
      countries: '15+',
      prizes: '10M FCFA'
    },
    sponsoringPdfUrl: '#',
    competitionRules: 'Règlement officiel de la compétition...',
    judgingCriteria: 'Critères de jugement basés sur la technique, l\'originalité...',
    prizePool: [
      { category: 'Breaking 1vs1', amount: '2.000.000 FCFA' }
    ]
  }
};

export function useCMSStore() {
  const [state, setState] = useState<CMSState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data from Laravel API on mount
  useEffect(() => {
    const loadDataFromAPI = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading CMS data from API...');
        const response = await api.get('/cms/data');
        
        if (response.data) {
          console.log('✅ API data loaded:', response.data);
          setState(response.data);
          // Save to localStorage as backup
          localStorage.setItem('asbi_cms_state', JSON.stringify(response.data));
        }
      } catch (error) {
        console.error('❌ Error loading CMS data from API:', error);
        setError(String(error));
        
        // Try to load from localStorage as fallback
        const saved = localStorage.getItem('asbi_cms_state');
        if (saved) {
          console.log('⚠️ Using cached data from localStorage');
          setState(JSON.parse(saved));
        } else {
          // Only use INITIAL_STATE if nothing else is available
          console.log('⚠️ Using default initial state');
          setState(INITIAL_STATE);
        }
      } finally {
        setLoading(false);
      }
    };

    loadDataFromAPI();
  }, []); // Only run once on mount

  // Don't automatically save to localStorage on every state change
  // to avoid creating stale cached data
  
  const updateState = (updater: (prev: CMSState) => CMSState) => {
    setState(prev => {
      if (!prev) return prev;
      const updated = updater(prev);
      // Save to localStorage when user makes changes (admin updates)
      localStorage.setItem('asbi_cms_state', JSON.stringify(updated));
      return updated;
    });
  };

  // Return initial state while loading
  return { 
    state: state || INITIAL_STATE, 
    updateState,
    loading,
    error
  };
}
