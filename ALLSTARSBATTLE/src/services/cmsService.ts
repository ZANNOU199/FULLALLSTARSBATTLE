import { CMSData } from '../types';
import api from './api';

const STORAGE_KEY = 'asbi_cms_data';

const initialData: CMSData = {
  companies: [
    {
      id: '1',
      name: 'Compagnie Danse Élite',
      choreographer: 'Jean Dupont',
      pieceTitle: 'Éveil Urbain',
      description: 'Une exploration des mouvements urbains dans un contexte contemporain.',
      bio: 'Fondée en 2010, cette compagnie repousse les limites du hip-hop.',
      mainImage: '',
      gallery: [],
      performanceDate: '2026-08-14',
      performanceTime: '18:00'
    }
  ],
  featuredPiece: {
    id: '1',
    title: "L'ÉVEIL DES OMBRES",
    image: '',
    duration: '45 MIN',
    choreographer: 'K. AFRIKA',
    music: 'LIVE DJ SET',
    description: 'Une exploration viscérale du lien entre le corps et son environnement numérique. Cette pièce fusionne le breakdance académique avec des projections interactives en temps réel, créant une illusion de mouvement où l\'ombre devient l\'acteur principal.',
    fullSynopsis: '"L\'Éveil des Ombres" est une œuvre chorégraphique révolutionnaire qui explore la dualité entre l\'existence physique et l\'identité numérique. Dans ce monde contemporain où la projection surpasse souvent la réalité, cette création reimagine ce que signifie vraiment être présent. Le corps devient le médium d\'une conversation silencieuse entre l\'ombre et la lumière, entre le connu et l\'invisible. Chaque mouvement raconte une histoire de transformation, de renaissance, et de l\'acceptation de nos multiples identités dans la ère digitale.',
    intentionQuote: 'Je voulais créer un espace où la technologie ne se contente pas d\'illustrer la danse, mais devient un partenaire de jeu imprévisible. L\'ombre n\'est plus une absence de lumière, mais une présence numérique qui nous force à redéfinir notre propre réalité physique.',
    intentionAuthor: 'K. Afrika, Chorégraphe',
    performers: '8 B-Boys & B-Girls',
    technology: 'Motion Capture Live'
  },
  participants: [
    {
      id: '1',
      name: 'B-BOY RYU',
      country: 'Japon',
      countryCode: 'jp',
      specialty: 'Power Moves',
      bio: 'Champion du monde 2024, connu pour sa vitesse incroyable.',
      photo: '',
      socialLinks: { instagram: '@bboyryu' },
      category: 'dancer'
    }
  ],
  program: [
    {
      id: '1',
      date: '2026-08-14',
      label: 'JOUR 01',
      activities: [
        {
          id: '11',
          time: '10:00 - 16:00',
          title: 'Masterclasses Internationales',
          location: 'Studio A',
          description: 'Apprentissage technique avec les légendes.',
          category: 'Workshop'
        }
      ]
    }
  ],
  categories: ['Competition', 'Workshop', 'Show', 'Talk', 'Social'],
  blog: {
    articles: [
      {
        id: '1',
        title: 'LANCEMENT OFFICIEL DU TOGO 2026',
        content: 'Découvrez les coulisses de la préparation de l\'événement le plus attendu de l\'année à Lomé.',
        category: 'OFFICIEL',
        coverImage: '',
        date: '12 Janvier 2026',
        tag: 'EVENT'
      },
      {
        id: '2',
        title: 'LINEUP DES ARTISTES DÉVOILÉ',
        content: 'Les plus grands noms de la scène Hip-Hop internationale confirment leur présence pour le festival.',
        category: 'TALENTS',
        coverImage: '',
        date: '05 Février 2026',
        tag: 'TALENTS'
      },
      {
        id: '3',
        title: 'DISPONIBILITÉ DES TICKETS',
        content: 'La billetterie en ligne est désormais ouverte. Réservez vos pass Early Bird avant épuisement.',
        category: 'BILLETTERIE',
        coverImage: '',
        date: '20 Mars 2026',
        tag: 'BILLETTERIE'
      }
    ]
  },
  competition: {
    rules: 'Le jugement est basé sur la technique, l\'originalité et la musicalité.',
    prizePool: [
      { category: '1vs1 Breaking', prize: '5000 €' },
      { category: '2vs2 Hip-Hop', prize: '3000 €' }
    ],
    brackets: {
      pouleA: {
        huitiemes: [
          { id: 'm1', player1: 'VICTOR', player2: 'TBD', score1: '--', score2: '--', country1: 'USA', country2: '--', countryCode1: 'us', countryCode2: 'un' },
          { id: 'm2', player1: 'PHIL WIZARD', player2: 'TBD', score1: '--', score2: '--', country1: 'CAN', country2: '--', countryCode1: 'ca', countryCode2: 'un' },
          { id: 'm3', player1: 'DANY DANN', player2: 'TBD', score1: '--', score2: '--', country1: 'FRA', country2: '--', countryCode1: 'fr', countryCode2: 'un' },
          { id: 'm4', player1: 'SHIGEKIX', player2: 'TBD', score1: '--', score2: '--', country1: 'JPN', country2: '--', countryCode1: 'jp', countryCode2: 'un' }
        ],
        quarts: [
          { id: 'qa1', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' },
          { id: 'qa2', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' }
        ],
        semis: [
          { id: 'sa1', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' }
        ]
      },
      pouleB: {
        huitiemes: [
          { id: 'm5', player1: 'LIGEE', player2: 'TBD', score1: '--', score2: '--', country1: 'CHN', country2: '--', countryCode1: 'cn', countryCode2: 'un' },
          { id: 'm6', player1: 'KUZYA', player2: 'TBD', score1: '--', score2: '--', country1: 'UKR', country2: '--', countryCode1: 'ua', countryCode2: 'un' },
          { id: 'm7', player1: 'LEE', player2: 'TBD', score1: '--', score2: '--', country1: 'NLD', country2: '--', countryCode1: 'nl', countryCode2: 'un' },
          { id: 'm8', player1: 'QUAKE', player2: 'TBD', score1: '--', score2: '--', country1: 'TPE', country2: '--', countryCode1: 'tw', countryCode2: 'un' }
        ],
        quarts: [
          { id: 'qb1', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' },
          { id: 'qb2', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' }
        ],
        semis: [
          { id: 'sb1', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' }
        ]
      },
      final: { id: 'final', player1: 'TBD', player2: 'TBD', score1: '--', score2: '--', country1: '--', country2: '--', countryCode1: 'un', countryCode2: 'un' }
    }
  },
  ticketing: {
    tickets: [
      { 
        id: '1', 
        name: 'Pass Journée', 
        price: '5 000', 
        period: 'CFA', 
        tag: 'Accès Standard', 
        features: ['Accès à toutes les masterclasses', 'Place en tribune standard', 'Accès au village ASBI'], 
        buttonText: 'Réserver mon pass',
        color: 'primary',
        recommended: false,
        paymentLink: '#' 
      },
      { 
        id: '2', 
        name: 'Pass Premium', 
        price: '15 000', 
        period: 'CFA', 
        tag: 'Expérience Totale', 
        features: ['Accès VIP Front-Row', 'Cocktail de bienvenue', 'Rencontre avec les juges', 'Goodies pack inclus'], 
        buttonText: 'Devenir VIP',
        color: 'accent-red',
        recommended: true,
        paymentLink: '#' 
      }
    ],
    faqs: [
      { id: '1', question: 'Où se déroule l\'événement ?', answer: 'Au Palais des Congrès de Lomé.' }
    ]
  },
  history: {
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
    timeline: [
      { id: '1', year: '2024', title: 'L\'Éveil de Lomé', champion: 'B-BOY RYU', description: 'Une édition mémorable au Japon.', image: '' }
    ],
    legends: [
      { id: '1', name: 'Storm', bio: 'Légende du breaking européen.', photo: '' }
    ]
  },
  contact: {
    hero: {
      title: 'Besoin ',
      titleHighlight: 'd\'aide ?',
      description: 'L\'équipe All Stars Battle International est là pour vous accompagner. Retrouvez nos réponses ou contactez-nous directement.'
    },
    sections: {
      coordinatesTitle: 'Coordonnées',
      hoursLabel: 'Horaires',
      hoursValue: 'Lun-Ven, 09h00 - 18h00',
      responseTime: 'Réponse sous 24h',
      socialLabel: 'Suivez le mouvement',
      faqTitle: 'Foire Aux Questions'
    }
  },
  partners: {
    logos: [
      { id: '1', name: 'Partenaire Institutionnel 1', logo: '', category: 'Institutional' },
      { id: '2', name: 'Partenaire Institutionnel 2', logo: '', category: 'Institutional' },
      { id: '3', name: 'Partenaire Institutionnel 3', logo: '', category: 'Institutional' },
      { id: '4', name: 'Partenaire Institutionnel 4', logo: '', category: 'Institutional' },
      { id: '5', name: 'Sponsor Majeur 1', logo: '', category: 'Main', tier: 'Sponsor Platine' },
      { id: '6', name: 'Sponsor Majeur 2', logo: '', category: 'Main', tier: 'Sponsor Or' },
      { id: '7', name: 'Sponsor Majeur 3', logo: '', category: 'Main', tier: 'Sponsor Argent' },
      { id: '8', name: 'Média Partenaire 1', logo: '', category: 'Media' },
      { id: '9', name: 'Média Partenaire 2', logo: '', category: 'Media' }
    ],
    sponsoringPdfUrl: '#',
    cta: {
      title: 'Devenez un Acteur de l\'Histoire',
      subtitle: 'Rejoignez l\'élite de la culture urbaine africaine',
      buttonText: 'Devenir Partenaire'
    }
  },
  media: [
    {
      id: '1',
      year: 2026,
      type: 'photo',
      title: 'Finale ASBI 2026 - Junior vs Flash',
      description: 'Moment épique de la finale avec l\'énergie maximale du public',
      url: '',
      tag: 'archive',
      thumbnail: ''
    },
    {
      id: '2',
      year: 2026,
      type: 'photo',
      title: 'Demi-finale Poule A',
      description: 'Action intense lors de la demi-finale de la poule A',
      url: '',
      tag: 'archive',
      thumbnail: ''
    },
    {
      id: '3',
      year: 2026,
      type: 'photo',
      title: 'Huitième de finale - Round 1',
      description: 'Premier round des huitièmes de finale',
      url: '',
      tag: 'archive',
      thumbnail: ''
    },
    {
      id: '4',
      year: 2026,
      type: 'video',
      title: 'Grande Finale : Junior vs Flash | Edition 2026',
      description: 'Une bataille épique pour le titre de champion d\'Afrique. Intensité maximum au Palais des Congrès.',
      url: '',
      thumbnail: '',
      duration: '12:45',
      tag: 'Replay'
    },
    {
      id: '5',
      year: 2026,
      type: 'video',
      title: 'Aftermovie Officiel : L\'énergie de Lomé',
      description: 'Plongez dans les coulisses et l\'ambiance électrique de l\'ASBI Togo 2026.',
      url: '',
      thumbnail: '',
      duration: '04:20',
      tag: 'Exclusif'
    },
    {
      id: '6',
      year: 2024,
      type: 'photo',
      title: 'Moments forts ASBI 2024',
      description: 'Archives de la compétition 2024',
      url: '',
      tag: 'archive',
      thumbnail: ''
    }
  ],
  globalConfig: {
    contact: {
      email: 'contact@asbi.com',
      phone: '+228 90 00 00 00',
      address: 'Lomé, Togo'
    },
    socials: {
      instagram: '#',
      facebook: '#',
      twitter: '#',
      youtube: '#'
    },
    seo: {
      title: 'All Stars Battle International 2026',
      description: 'La plus grande compétition de danse urbaine en Afrique.',
      keywords: 'danse, battle, hip-hop, breaking, togo, lomé'
    },
    hero: {
      title: 'ALL STARS BATTLE INTERNATIONAL',
      subtitle: 'Le Trône. Le Respect. La Légende.',
      location: 'TOGO 2026',
      backgroundImage: '',
      videoUrl: ''
    },
    competition: {
      dateStart: '14 - 16 AOÛT 2026',
      location: 'PALAIS DES CONGRÈS DE LOMÉ, TOGO',
      description: 'L\'élite mondiale du breaking et du hip-hop se réunit sur les terres du Togo pour la plus grande battle d\'Afrique. 3 jours de compétition intense, de workshops et de culture urbaine. Le vainqueur n\'emporte pas seulement le titre, il entre dans l\'histoire.'
    },
    dancers: {
      sectionTitle: 'LES DANSEURS',
      sectionSubtitle: 'Featured'
    },
    programmation: {
      sectionTitle: 'PROGRAMMATION'
    },
    vip: {
      sectionTitle: 'EXPÉRIENCE VIP',
      sectionDescription: 'Plongez au cœur de l\'action avec un accès privilégié. Vivez le All Stars Battle International dans les meilleures conditions possibles.',
      features: [
        {
          icon: 'Verified',
          title: 'Platinum Backstage',
          description: 'Rencontrez les juges et les danseurs dans la zone athlètes.'
        },
        {
          icon: 'GlassWater',
          title: 'Lounge Exclusif',
          description: 'Open bar et buffet gastronomique dans une ambiance premium.'
        }
      ]
    },
    stats: [
      { label: 'Danseurs Qualifiés', value: '16' },
      { label: 'Nations Représentées', value: '12' },
      { label: 'Juges Internationaux', value: '8' }
    ],
    partners: {
      sectionTitle: 'PARTENAIRES & SPONSORS'
    },
    blog: {
      sectionTitle: 'ACTUALITÉS & NEWS'
    },
    footer: {
      description: 'L\'événement de breakdance ultime qui définit le trône de la culture urbaine en Afrique. Vivez l\'excellence du mouvement, du rythme et de la compétition internationale au cœur du Togo.',
      copyright: '© 2026 ALL STARS BATTLE INTERNATIONAL. TOUS DROITS RÉSERVÉS.'
    },
    homepageStats: [
      { label: 'Danseurs Qualifiés', value: '16' },
      { label: 'Nations Représentées', value: '12' },
      { label: 'Juges Internationaux', value: '8' }
    ],
    eventDate: '2026-03-20T00:00:00'
  },
  theme: {
    primary: '#d35f17',
    accent: '#f4d125',
    accentRed: '#dc2626',
    background: '#0a0807',
    surface: '#1a1a1a',
    text: '#ffffff',
    mutedText: '#94a3b8'
  },
  participate: {
    hero: {
      title: 'Rejoignez l\'expérience',
      titleHighlight: 'All Star Battle International',
      subtitle: 'Participez à l\'événement qui célèbre le Breaking et les danses Hip-Hop en Afrique'
    },
    sections: {
      dancers: {
        title: '🎤 POUR LES DANSEURS',
        description: 'La direction artistique du festival sélectionne et invite des danseurs chaque année. Les danseurs internationaux pouvant prendre en charge leur mobilité peuvent également candidater pour participer au festival.'
      },
      professionals: {
        title: '💼 POUR LES PROFESSIONNELS',
        description: 'Programmateurs, directeurs de compagnies, producteurs : rejoignez un espace d\'échange, de collaboration et de découverte. Le festival développe un réseau de professionnels internationaux autour de la danse Hip-Hop.'
      },
      volunteers: {
        title: '❤️ POUR LES VOLONTAIRES',
        description: 'Vivez le festival de l\'intérieur et contribuez activement à son organisation. Rejoignez notre équipe de bénévoles passionnés et faites partie de l\'aventure !'
      }
    },
    formFields: {
      nameLabel: 'Nom Complet',
      emailLabel: 'Adresse Email',
      phoneLabel: 'Numéro de Téléphone',
      countryLabel: 'Pays',
      messageLabel: 'Message Additionnel'
    },
    successMessage: {
      title: '✨ Inscription Réussie !',
      subtitle: 'Merci de votre intérêt pour l\'All Star Battle International ! Notre équipe vous contactera bientôt pour confirmer votre participation.'
    }
  },
  pageBackgrounds: {
    hero: {
      imageUrl: '',
      videoUrl: '',
      width: 1920,
      height: 1080,
      lastModified: new Date().toISOString()
    },
    artisticScene: {
      imageUrl: '',
      width: 1920,
      height: 1080,
      lastModified: new Date().toISOString()
    },
    dancers: {
      imageUrl: '',
      width: 1920,
      height: 1080,
      lastModified: new Date().toISOString()
    },
    media: {
      imageUrl: '',
      width: 1920,
      height: 1080,
      lastModified: new Date().toISOString()
    },
    contact: {
      imageUrl: '',
      width: 1920,
      height: 1080,
      lastModified: new Date().toISOString()
    },
    competition: {
      imageUrl: '',
      width: 800,
      height: 450,
      lastModified: new Date().toISOString()
    },
    vip: {
      imageUrl: '',
      width: 600,
      height: 400,
      lastModified: new Date().toISOString()
    },
    participate: {
      imageUrl: '',
      width: 1920,
      height: 1080,
      lastModified: new Date().toISOString()
    }
  },
  siteAssets: {
    backgrounds: {
      'hero-bg': {
        url: '',
        size: '',
        width: 1920,
        height: 1080,
        type: 'image'
      },
      'competition-bg': {
        url: '',
        size: '',
        width: 1920,
        height: 1080,
        type: 'image'
      },
      'dancers-bg': {
        url: '',
        size: '',
        width: 1920,
        height: 1080,
        type: 'image'
      },
      'partners-bg': {
        url: '',
        size: '',
        width: 1920,
        height: 1080,
        type: 'image'
      }
    },
    illustrations: {
      'about-section': {
        url: '',
        size: '',
        width: 800,
        height: 600,
        type: 'image'
      },
      'vip-section': {
        url: '',
        size: '',
        width: 800,
        height: 600,
        type: 'image'
      },
      'press-section': {
        url: '',
        size: '',
        width: 800,
        height: 600,
        type: 'image'
      }
    },
    videos: {
      'hero-video': {
        url: '',
        size: '',
        duration: '',
        type: 'video'
      },
      'promo-video': {
        url: '',
        size: '',
        duration: '',
        type: 'video'
      },
      'archive-video': {
        url: '',
        size: '',
        duration: '',
        type: 'video'
      }
    },
    logo: {
      url: '',
      alt: 'All Stars Battle International Logo',
      lastModified: ''
    }
  },
  organizers: [
    {
      id: '1',
      name: 'Elom Kodjo',
      role: 'Directeur Fondateur & Producteur',
      bio: 'Visionnaire et activiste culturel, Elom a fondé l\'ASBI pour propulser le breaking africain sur la scène mondiale.',
      photo: '',
      socialLinks: {
        instagram: '@elomkodjo',
        facebook: 'elomkodjo',
        twitter: '@elomkodjo'
      }
    },
    {
      id: '2',
      name: 'Sena Ayivi',
      role: 'Coordinatrice Artistique',
      bio: 'Experte en production artistique, Sena orchestre chaque détail pour créer une expérience inoubliable.',
      photo: '',
      socialLinks: {
        instagram: '@senaayivi',
        facebook: 'senaayivi'
      }
    }
  ],
  organizersConfig: {
    sectionTitle: 'L\'EQUIPE ORGANISATION',
    sectionDescription: 'Derrière le plus grand événement de breaking d\'Afrique de l\'Ouest, se trouve une équipe passionnée d\'activistes culturels et d\'experts en événementiel.',
    organizationName: 'ASBI Togo 2026'
  }
};

export const cmsService = {
  getData: async (): Promise<CMSData> => {
    try {
      // Try to fetch from API first
      const response = await api.get('/cms/data');
      const apiData = response.data;
      
      // Cache the data locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify(apiData));
      
      // Merge with initialData to ensure all properties exist
      const merged = {
        ...initialData,
        ...apiData,
        companies: apiData.companies || initialData.companies,
        featuredPiece: {
          ...initialData.featuredPiece,
          ...(apiData.featuredPiece || {})
        },
        globalConfig: {
          ...initialData.globalConfig,
          ...(apiData.globalConfig || {}),
          vip: {
            ...initialData.globalConfig.vip,
            ...(apiData.globalConfig?.vip || {}),
            features: apiData.globalConfig?.vip?.features || initialData.globalConfig.vip.features
          },
          // Ensure stats are never empty - preserve defaults if DB has no data
          stats: apiData.globalConfig?.stats && Array.isArray(apiData.globalConfig.stats) && apiData.globalConfig.stats.length > 0
            ? apiData.globalConfig.stats
            : initialData.globalConfig.stats,
          homepageStats: apiData.globalConfig?.homepageStats && Array.isArray(apiData.globalConfig.homepageStats) && apiData.globalConfig.homepageStats.length > 0
            ? apiData.globalConfig.homepageStats
            : initialData.globalConfig.stats, // Both point to same data
        },
        partners: {
          logos: apiData.partners?.logos || initialData.partners.logos,
          sponsoringPdfUrl: apiData.partners?.sponsoringPdfUrl || initialData.partners.sponsoringPdfUrl,
          cta: {
            ...initialData.partners.cta,
            ...(apiData.partners?.cta || {})
          }
        },
        contact: {
          hero: {
            ...initialData.contact.hero,
            ...(apiData.contact?.hero || {})
          },
          sections: {
            ...initialData.contact.sections,
            ...(apiData.contact?.sections || {})
          }
        },
        ticketing: {
          tickets: apiData.ticketing?.tickets || initialData.ticketing.tickets,
          faqs: apiData.ticketing?.faqs || initialData.ticketing.faqs
        },
        blog: {
          articles: apiData.blog?.articles || initialData.blog.articles
        },
        competition: {
          ...initialData.competition,
          ...(apiData.competition || {})
        },
        history: {
          hero: {
            ...initialData.history.hero,
            ...(apiData.history?.hero || {})
          },
          stats: {
            ...initialData.history.stats,
            ...(apiData.history?.stats || {})
          },
          wallOfFame: {
            ...initialData.history.wallOfFame,
            ...(apiData.history?.wallOfFame || {})
          },
          timeline: apiData.history?.timeline || initialData.history.timeline,
          legends: apiData.history?.legends || initialData.history.legends
        },
        theme: {
          ...initialData.theme,
          ...(apiData.theme || {})
        },
        pageBackgrounds: {
          ...initialData.pageBackgrounds,
          ...(apiData.pageBackgrounds || {})
        },
        participate: {
          hero: {
            ...initialData.participate.hero,
            ...(apiData.participate?.hero || {})
          },
          sections: {
            dancers: { ...initialData.participate.sections.dancers, ...(apiData.participate?.sections?.dancers || {}) },
            professionals: { ...initialData.participate.sections.professionals, ...(apiData.participate?.sections?.professionals || {}) },
            volunteers: { ...initialData.participate.sections.volunteers, ...(apiData.participate?.sections?.volunteers || {}) }
          },
          formFields: {
            ...initialData.participate.formFields,
            ...(apiData.participate?.formFields || {})
          },
          successMessage: {
            ...initialData.participate.successMessage,
            ...(apiData.participate?.successMessage || {})
          }
        },
        organizers: apiData.organizers || initialData.organizers,
        organizersConfig: {
          ...initialData.organizersConfig,
          ...(apiData.organizersConfig || {})
        },
        siteAssets: {
          backgrounds: { ...initialData.siteAssets.backgrounds, ...(apiData.siteAssets?.backgrounds || {}) },
          illustrations: { ...initialData.siteAssets.illustrations, ...(apiData.siteAssets?.illustrations || {}) },
          videos: { ...initialData.siteAssets.videos, ...(apiData.siteAssets?.videos || {}) },
          logo: { ...initialData.siteAssets.logo, ...(apiData.siteAssets?.logo || {}) }
        }
      };
      
      // Ensure program has at least one day with activities
      if (!merged.program || merged.program.length === 0) {
        merged.program = initialData.program;
      }
      
      return merged;
    } catch (error) {
      console.warn('Failed to load from API, using cached data:', error);
      
      // Fallback to localStorage
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          console.error('Failed to parse cached CMS data', e);
          return initialData;
        }
      }
      
      // Last resort - return initialData
      return initialData;
    }
  },

  saveData: async (data: CMSData) => {
    console.log('cmsService.saveData called with data:', data);
    try {
      // First, save to backend
      console.log('Making POST request to /cms/data');
      const response = await api.post('/cms/data', data);
      console.log('POST response status:', response.status);
      console.log('POST response data:', response.data);
      
      if (response.status === 200) {
        // Reload fresh data from backend after successful save
        console.log('Reloading fresh data from backend');
        const freshData = await api.get('/cms/data');
        const backendData = freshData.data;
        console.log('Fresh backend data:', backendData);
        
        // Cache fresh data locally
        localStorage.setItem(STORAGE_KEY, JSON.stringify(backendData));
        
        // Emit custom event with fresh data for real-time updates
        window.dispatchEvent(new CustomEvent('cmsDataChanged', { detail: backendData }));
      }
    } catch (error: any) {
      console.error('cmsService: Failed to save CMS data to API:', error?.response?.data || error?.message);
      // Fallback: still save to localStorage even if backend fails
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('cmsDataChanged', { detail: data }));
    }
  },

  // Participant management methods
  addParticipant: async (participantData: any) => {
    try {
      // Map frontend field names to backend field names
      const payload = {
        name: participantData.name,
        country: participantData.country,
        category: participantData.category,
        specialty: participantData.specialty || '',
        bio: participantData.bio || '',
        photo: participantData.image || participantData.photo || '', // Map 'image' to 'photo'
        countryCode: participantData.countryCode || '',
      };

      console.log('cmsService: Sending POST to /cms/participants with:', payload);
      const response = await api.post('/cms/participants', payload);
      console.log('cmsService: Participant created, ID:', response.data.id);
      
      // Clear cache force reload from API
      localStorage.removeItem(STORAGE_KEY);
      console.log('cmsService: Cache cleared');
      
      // Reload data immediately
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add participant:', error.response?.data || error.message);
      throw error;
    }
  },

  updateParticipant: async (id: string, participantData: any) => {
    try {
      // Map frontend field names to backend field names
      const payload = {
        name: participantData.name,
        country: participantData.country,
        category: participantData.category,
        specialty: participantData.specialty || '',
        bio: participantData.bio || '',
        photo: participantData.image || participantData.photo || '', // Map 'image' to 'photo'
        countryCode: participantData.countryCode || '',
      };

      console.log('cmsService: Sending PUT to /cms/participants/' + id + ' with:', payload);
      const response = await api.put(`/cms/participants/${id}`, payload);
      console.log('cmsService: Participant updated, ID:', response.data.id);
      
      // Clear cache to force reload from API
      localStorage.removeItem(STORAGE_KEY);
      console.log('cmsService: Cache cleared');
      
      // Reload data immediately
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to update participant:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteParticipant: async (id: string) => {
    try {
      console.log('cmsService: Sending DELETE to /cms/participants/' + id);
      await api.delete(`/cms/participants/${id}`);
      console.log('cmsService: Participant deleted');
      
      // Clear cache to force reload from API
      localStorage.removeItem(STORAGE_KEY);
      console.log('cmsService: Cache cleared');
      
      // Reload data immediately
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete participant:', error.response?.data || error.message);
      throw error;
    }
  },

  // Blog/Articles management
  addArticle: async (articleData: any) => {
    try {
      const payload = {
        title: articleData.title,
        content: articleData.content,
        category: articleData.category,
        coverImage: articleData.coverImage || '',
        tag: articleData.tag || 'EVENT',
      };

      console.log('cmsService: Sending POST to /cms/blog-articles with:', payload);
      const response = await api.post('/cms/blog-articles', payload);
      console.log('cmsService: Article created, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add article:', error.response?.data || error.message);
      throw error;
    }
  },

  updateArticle: async (id: string, articleData: any) => {
    try {
      const payload = {
        title: articleData.title,
        content: articleData.content,
        category: articleData.category,
        coverImage: articleData.coverImage || '',
        tag: articleData.tag || 'EVENT',
      };

      console.log('cmsService: Sending PUT to /cms/blog-articles/' + id + ' with:', payload);
      const response = await api.put(`/cms/blog-articles/${id}`, payload);
      console.log('cmsService: Article updated, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to update article:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteArticle: async (id: string) => {
    try {
      console.log('cmsService: DELETE /cms/blog-articles/' + id);
      await api.delete(`/cms/blog-articles/${id}`);
      console.log('cmsService: Article deleted');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete article:', error.response?.data || error.message);
      throw error;
    }
  },

  // Ticketing management
  addTicket: async (ticketData: any) => {
    try {
      const payload = {
        name: ticketData.name,
        price: ticketData.price,
        period: ticketData.period || 'Par jour',
        tag: ticketData.tag || 'Standard',
        features: ticketData.features || [],
        buttonText: ticketData.buttonText || 'Réserver',
        color: ticketData.color || 'primary',
        recommended: ticketData.recommended || false,
        paymentLink: ticketData.paymentLink || '#',
      };

      console.log('cmsService: Sending POST to /cms/tickets with:', payload);
      const response = await api.post('/cms/tickets', payload);
      console.log('cmsService: Ticket created, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add ticket:', error.response?.data || error.message);
      throw error;
    }
  },

  updateTicket: async (id: string, ticketData: any) => {
    try {
      const payload = {
        name: ticketData.name,
        price: ticketData.price,
        period: ticketData.period || 'Par jour',
        tag: ticketData.tag || 'Standard',
        features: ticketData.features || [],
        buttonText: ticketData.buttonText || 'Réserver',
        color: ticketData.color || 'primary',
        recommended: ticketData.recommended || false,
        paymentLink: ticketData.paymentLink || '#',
      };

      console.log('cmsService: Sending PUT to /cms/tickets/' + id + ' with:', payload);
      const response = await api.put(`/cms/tickets/${id}`, payload);
      console.log('cmsService: Ticket updated, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to update ticket:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteTicket: async (id: string) => {
    try {
      console.log('cmsService: DELETE /cms/tickets/' + id);
      await api.delete(`/cms/tickets/${id}`);
      console.log('cmsService: Ticket deleted');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete ticket:', error.response?.data || error.message);
      throw error;
    }
  },

  // FAQ management
  addFAQ: async (faqData: any) => {
    try {
      const payload = {
        question: faqData.question,
        answer: faqData.answer,
      };

      console.log('cmsService: Sending POST to /cms/faqs with:', payload);
      const response = await api.post('/cms/faqs', payload);
      console.log('cmsService: FAQ created, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add FAQ:', error.response?.data || error.message);
      throw error;
    }
  },

  updateFAQ: async (id: string, faqData: any) => {
    try {
      const payload = {
        question: faqData.question,
        answer: faqData.answer,
      };

      console.log('cmsService: Sending PUT to /cms/faqs/' + id + ' with:', payload);
      const response = await api.put(`/cms/faqs/${id}`, payload);
      console.log('cmsService: FAQ updated, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to update FAQ:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteFAQ: async (id: string) => {
    try {
      console.log('cmsService: DELETE /cms/faqs/' + id);
      await api.delete(`/cms/faqs/${id}`);
      console.log('cmsService: FAQ deleted');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete FAQ:', error.response?.data || error.message);
      throw error;
    }
  },

  // Program management
  addProgramDay: async (programData: any) => {
    try {
      const payload = {
        date: programData.date,
        label: programData.label,
      };

      console.log('cmsService: Sending POST to /cms/program-days with:', payload);
      const response = await api.post('/cms/program-days', payload);
      console.log('cmsService: Program day created, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add program day:', error.response?.data || error.message);
      throw error;
    }
  },

  updateProgramDay: async (id: string, programData: any) => {
    try {
      const payload = {
        date: programData.date,
        label: programData.label,
      };

      console.log('cmsService: Sending PUT to /cms/program-days/' + id + ' with:', payload);
      const response = await api.put(`/cms/program-days/${id}`, payload);
      console.log('cmsService: Program day updated, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to update program day:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteProgramDay: async (id: string) => {
    try {
      console.log('cmsService: DELETE /cms/program-days/' + id);
      await api.delete(`/cms/program-days/${id}`);
      console.log('cmsService: Program day deleted');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete program day:', error.response?.data || error.message);
      throw error;
    }
  },

  addActivity: async (activityData: any) => {
    try {
      const payload = {
        programDayId: activityData.programDayId,
        time: activityData.time,
        title: activityData.title,
        location: activityData.location || '',
        description: activityData.description || '',
        category: activityData.category || 'General',
      };

      console.log('cmsService: Sending POST to /cms/activities with:', payload);
      const response = await api.post('/cms/activities', payload);
      console.log('cmsService: Activity created, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add activity:', error.response?.data || error.message);
      throw error;
    }
  },

  updateActivity: async (id: string, activityData: any) => {
    try {
      const payload = {
        time: activityData.time,
        title: activityData.title,
        location: activityData.location || '',
        description: activityData.description || '',
        category: activityData.category || 'General',
      };

      console.log('cmsService: Sending PUT to /cms/activities/' + id + ' with:', payload);
      const response = await api.put(`/cms/activities/${id}`, payload);
      console.log('cmsService: Activity updated, ID:', response.data.id);
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to update activity:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteActivity: async (id: string) => {
    try {
      console.log('cmsService: DELETE /cms/activities/' + id);
      await api.delete(`/cms/activities/${id}`);
      console.log('cmsService: Activity deleted');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete activity:', error.response?.data || error.message);
      throw error;
    }
  },

  addCategory: async (categoryName: string) => {
    try {
      console.log('cmsService: Sending POST to /cms/categories with:', { name: categoryName });
      const response = await api.post('/cms/categories', { name: categoryName });
      console.log('cmsService: Category created');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
      return response.data;
    } catch (error: any) {
      console.error('cmsService: Failed to add category:', error.response?.data || error.message);
      throw error;
    }
  },

  deleteCategory: async (categoryName: string) => {
    try {
      console.log('cmsService: DELETE /cms/categories/' + encodeURIComponent(categoryName));
      await api.delete(`/cms/categories/${encodeURIComponent(categoryName)}`);
      console.log('cmsService: Category deleted');
      
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new CustomEvent('cmsDataChanged'));
    } catch (error: any) {
      console.error('cmsService: Failed to delete category:', error.response?.data || error.message);
      throw error;
    }
  },

  resetData: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};

export { initialData };
