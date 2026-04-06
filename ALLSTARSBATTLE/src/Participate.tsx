import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Briefcase,
  Heart,
  ArrowLeft,
  Send,
  CheckCircle,
  Mail,
  User,
  Phone,
  MapPin,
  Search,
  ChevronDown,
} from 'lucide-react';
import { API_URL } from './services/api';

interface FormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  message: string;
}

interface SubmissionState {
  type: 'dancers' | 'professionals' | 'volunteers' | null;
  isSubmitted: boolean;
}

const Participate = ({ onBack, data, pageBackgrounds }: { onBack?: () => void, data?: any, pageBackgrounds?: any }) => {
  const [activeTab, setActiveTab] = useState<'dancers' | 'professionals' | 'volunteers' | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionState>({ type: null, isSubmitted: false });
  const [countries, setCountries] = useState<Array<{ name: string; code: string }>>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = React.useRef<HTMLDivElement>(null);
  const formRef = React.useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    country: '',
    message: ''
  });

  // Charger la liste des pays depuis l'API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoadingCountries(true);
        // Essayer d'abord la nouvelle API endpoint
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        
        // Transformer les données et trier par nom
        const countryList = data
          .map((country: any) => ({
            name: country.name.common || country.name,
            code: country.cca2 || country.cca3
          }))
          .filter((country: any) => country.name && country.code) // Filtrer les entrées invalides
          .sort((a: any, b: any) => a.name.localeCompare(b.name));
        
        console.log('✅ Pays chargés:', countryList.length); // Debug
        setCountries(countryList);
      } catch (error) {
        console.error('Erreur lors du chargement des pays:', error);
        
        // Fallback: télécharger une liste statique complète de tous les pays
        try {
          const response = await fetch('https://cdn.jsdelivr.net/npm/country-list@2.2.0/data.json');
          const data = await response.json();
          const countryList = data
            .map((country: any) => ({
              name: country.name,
              code: country.code
            }))
            .sort((a: any, b: any) => a.name.localeCompare(b.name));
          
          console.log('✅ Pays chargés (CDN):', countryList.length);
          setCountries(countryList);
        } catch (cdnError) {
          console.error('Erreur CDN:', cdnError);
          // Fallback final: liste complète de tous les pays du monde
          setCountries([
            { name: 'Afghanistan', code: 'AF' },
            { name: 'Afrique du Sud', code: 'ZA' },
            { name: 'Albanie', code: 'AL' },
            { name: 'Algérie', code: 'DZ' },
            { name: 'Allemagne', code: 'DE' },
            { name: 'Andorre', code: 'AD' },
            { name: 'Angola', code: 'AO' },
            { name: 'Anguilla', code: 'AI' },
            { name: 'Antarctique', code: 'AQ' },
            { name: 'Antigua-et-Barbuda', code: 'AG' },
            { name: 'Arabie Saoudite', code: 'SA' },
            { name: 'Argentine', code: 'AR' },
            { name: 'Arménie', code: 'AM' },
            { name: 'Aruba', code: 'AW' },
            { name: 'Australie', code: 'AU' },
            { name: 'Autriche', code: 'AT' },
            { name: 'Azerbaïdjan', code: 'AZ' },
            { name: 'Bahamas', code: 'BS' },
            { name: 'Bahreïn', code: 'BH' },
            { name: 'Bangladesh', code: 'BD' },
            { name: 'Barbade', code: 'BB' },
            { name: 'Belgique', code: 'BE' },
            { name: 'Belize', code: 'BZ' },
            { name: 'Bénin', code: 'BJ' },
            { name: 'Bermudes', code: 'BM' },
            { name: 'Bhoutan', code: 'BT' },
            { name: 'Biélorussie', code: 'BY' },
            { name: 'Birmanie (Myanmar)', code: 'MM' },
            { name: 'Birmanie', code: 'MM' },
            { name: 'Birmanie', code: 'MM' },
            { name: 'Bosnie-Herzégovine', code: 'BA' },
            { name: 'Botswana', code: 'BW' },
            { name: 'Brésil', code: 'BR' },
            { name: 'Brunei', code: 'BN' },
            { name: 'Bulgarie', code: 'BG' },
            { name: 'Burkina Faso', code: 'BF' },
            { name: 'Burundi', code: 'BI' },
            { name: 'Cambodge', code: 'KH' },
            { name: 'Cameroun', code: 'CM' },
            { name: 'Canada', code: 'CA' },
            { name: 'Cap-Vert', code: 'CV' },
            { name: 'Chili', code: 'CL' },
            { name: 'Chine', code: 'CN' },
            { name: 'Chypre', code: 'CY' },
            { name: 'Colombie', code: 'CO' },
            { name: 'Comores', code: 'KM' },
            { name: 'Corée du Nord', code: 'KP' },
            { name: 'Corée du Sud', code: 'KR' },
            { name: 'Costa Rica', code: 'CR' },
            { name: 'Côte d\'Ivoire', code: 'CI' },
            { name: 'Croatie', code: 'HR' },
            { name: 'Cuba', code: 'CU' },
            { name: 'Curaçao', code: 'CW' },
            { name: 'Danemark', code: 'DK' },
            { name: 'Djibouti', code: 'DJ' },
            { name: 'Dominique', code: 'DM' },
            { name: 'Égypte', code: 'EG' },
            { name: 'Émirats Arabes Unis', code: 'AE' },
            { name: 'Équateur', code: 'EC' },
            { name: 'Érythrée', code: 'ER' },
            { name: 'Espagne', code: 'ES' },
            { name: 'Estonie', code: 'EE' },
            { name: 'États-Unis', code: 'US' },
            { name: 'Éthiopie', code: 'ET' },
            { name: 'Fidji', code: 'FJ' },
            { name: 'Finlande', code: 'FI' },
            { name: 'France', code: 'FR' },
            { name: 'Gabon', code: 'GA' },
            { name: 'Gambie', code: 'GM' },
            { name: 'Géorgie', code: 'GE' },
            { name: 'Géorgie du Sud et les Îles Sandwich du Sud', code: 'GS' },
            { name: 'Ghana', code: 'GH' },
            { name: 'Gibraltar', code: 'GI' },
            { name: 'Grèce', code: 'GR' },
            { name: 'Grenade', code: 'GD' },
            { name: 'Groenland', code: 'GL' },
            { name: 'Guadeloupe', code: 'GP' },
            { name: 'Guam', code: 'GU' },
            { name: 'Guatemala', code: 'GT' },
            { name: 'Guernesey', code: 'GG' },
            { name: 'Guinée', code: 'GN' },
            { name: 'Guinée équatoriale', code: 'GQ' },
            { name: 'Guinée-Bissau', code: 'GW' },
            { name: 'Guyana', code: 'GY' },
            { name: 'Guyane française', code: 'GF' },
            { name: 'Haïti', code: 'HT' },
            { name: 'Honduras', code: 'HN' },
            { name: 'Hong Kong', code: 'HK' },
            { name: 'Hongrie', code: 'HU' },
            { name: 'Île Bouvet', code: 'BV' },
            { name: 'Île Christmas', code: 'CX' },
            { name: 'Île Norfolk', code: 'NF' },
            { name: 'Îles Åland', code: 'AX' },
            { name: 'Îles Caïmans', code: 'KY' },
            { name: 'Îles Cocos', code: 'CC' },
            { name: 'Îles Féroé', code: 'FO' },
            { name: 'Îles Heard et McDonald', code: 'HM' },
            { name: 'Îles Malouines', code: 'FK' },
            { name: 'Îles Mariannes du Nord', code: 'MP' },
            { name: 'Îles Marshall', code: 'MH' },
            { name: 'Îles Pitcairn', code: 'PN' },
            { name: 'Îles Salomon', code: 'SB' },
            { name: 'Îles Turques-et-Caïques', code: 'TC' },
            { name: 'Îles Vierges britanniques', code: 'VG' },
            { name: 'Îles Vierges des États-Unis', code: 'VI' },
            { name: 'Inde', code: 'IN' },
            { name: 'Indonésie', code: 'ID' },
            { name: 'Irak', code: 'IQ' },
            { name: 'Iran', code: 'IR' },
            { name: 'Irlande', code: 'IE' },
            { name: 'Islande', code: 'IS' },
            { name: 'Israël', code: 'IL' },
            { name: 'Italie', code: 'IT' },
            { name: 'Jamaïque', code: 'JM' },
            { name: 'Japon', code: 'JP' },
            { name: 'Jersey', code: 'JE' },
            { name: 'Jordanie', code: 'JO' },
            { name: 'Kazakhstan', code: 'KZ' },
            { name: 'Kenya', code: 'KE' },
            { name: 'Kirghizistan', code: 'KG' },
            { name: 'Kiribati', code: 'KI' },
            { name: 'Koweït', code: 'KW' },
            { name: 'Laos', code: 'LA' },
            { name: 'Lesotho', code: 'LS' },
            { name: 'Lettonie', code: 'LV' },
            { name: 'Liban', code: 'LB' },
            { name: 'Liberia', code: 'LR' },
            { name: 'Libye', code: 'LY' },
            { name: 'Liechtenstein', code: 'LI' },
            { name: 'Lituanie', code: 'LT' },
            { name: 'Luxembourg', code: 'LU' },
            { name: 'Macao', code: 'MO' },
            { name: 'Macédoine du Nord', code: 'MK' },
            { name: 'Madagascar', code: 'MG' },
            { name: 'Malaisie', code: 'MY' },
            { name: 'Malawi', code: 'MW' },
            { name: 'Maldives', code: 'MV' },
            { name: 'Mali', code: 'ML' },
            { name: 'Malte', code: 'MT' },
            { name: 'Maroc', code: 'MA' },
            { name: 'Martinique', code: 'MQ' },
            { name: 'Mauritanie', code: 'MR' },
            { name: 'Maurice', code: 'MU' },
            { name: 'Mayotte', code: 'YT' },
            { name: 'Mexique', code: 'MX' },
            { name: 'Micronésie', code: 'FM' },
            { name: 'Moldavie', code: 'MD' },
            { name: 'Monaco', code: 'MC' },
            { name: 'Mongolie', code: 'MN' },
            { name: 'Monténégro', code: 'ME' },
            { name: 'Montserrat', code: 'MS' },
            { name: 'Mozambique', code: 'MZ' },
            { name: 'Namibie', code: 'NA' },
            { name: 'Nauru', code: 'NR' },
            { name: 'Népal', code: 'NP' },
            { name: 'Nicaragua', code: 'NI' },
            { name: 'Niger', code: 'NE' },
            { name: 'Nigeria', code: 'NG' },
            { name: 'Niue', code: 'NU' },
            { name: 'Norvège', code: 'NO' },
            { name: 'Nouvelle-Calédonie', code: 'NC' },
            { name: 'Nouvelle-Zélande', code: 'NZ' },
            { name: 'Oman', code: 'OM' },
            { name: 'Ouganda', code: 'UG' },
            { name: 'Ouzbékistan', code: 'UZ' },
            { name: 'Pakistan', code: 'PK' },
            { name: 'Palaos', code: 'PW' },
            { name: 'Palestine', code: 'PS' },
            { name: 'Panama', code: 'PA' },
            { name: 'Papouasie-Nouvelle-Guinée', code: 'PG' },
            { name: 'Pâques (Île)', code: 'CL' },
            { name: 'Paraguay', code: 'PY' },
            { name: 'Pays-Bas', code: 'NL' },
            { name: 'Pérou', code: 'PE' },
            { name: 'Philipines', code: 'PH' },
            { name: 'Pologne', code: 'PL' },
            { name: 'Polynésie française', code: 'PF' },
            { name: 'Porto Rico', code: 'PR' },
            { name: 'Portugal', code: 'PT' },
            { name: 'Qatar', code: 'QA' },
            { name: 'La Réunion', code: 'RE' },
            { name: 'Roumanie', code: 'RO' },
            { name: 'Royaume-Uni', code: 'GB' },
            { name: 'Russie', code: 'RU' },
            { name: 'Rwanda', code: 'RW' },
            { name: 'Sahara occidental', code: 'EH' },
            { name: 'Saint-Barthélemy', code: 'BL' },
            { name: 'Saint-Marin', code: 'SM' },
            { name: 'Saint-Martin', code: 'MF' },
            { name: 'Saint-Pierre-et-Miquelon', code: 'PM' },
            { name: 'Sainte-Hélène, Ascension et Tristan da Cunha', code: 'SH' },
            { name: 'Sainte-Lucie', code: 'LC' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa américaines', code: 'AS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
            { name: 'Samoa', code: 'WS' },
          ]);
        }
      } finally {
        setLoadingCountries(false);
      }
    };
    
    fetchCountries();
  }, []);

  // Fermer le dropdown si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtrer les pays par recherche
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSelectCountry = (countryName: string) => {
    setFormData({ ...formData, country: countryName });
    setCountrySearch('');
    setShowCountryDropdown(false);
  };

  // Utiliser les données du CMS ou les valeurs par défaut
  const participateData = data || {
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
  };

  const handleSubscribeClick = (type: 'dancers' | 'professionals' | 'volunteers') => {
    setActiveTab(type);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (type: 'dancers' | 'professionals' | 'volunteers') => {
    if (formData.name && formData.email && formData.phone && formData.country) {
      try {
        // Envoyer les données à l'API contact-messages
        const data = {
          name: formData.name,
          email: formData.email,
          subject: getSubjectForType(type),
          message: `Téléphone: ${formData.phone}\nPays: ${formData.country}\n\n${formData.message || 'Demande d\'inscription'}`,
          source: getSourceForType(type)
        };

        const response = await fetch(`${API_URL}/cms/contact-messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          setSubmissions({ type, isSubmitted: true });
          setTimeout(() => {
            setActiveTab(null);
            setSubmissions({ type: null, isSubmitted: false });
            setFormData({ name: '', email: '', phone: '', country: '', message: '' });
            // Redirect to home after 3 seconds
            if (onBack) {
              onBack();
            }
          }, 3000);
        } else {
          console.error('Erreur lors de l\'envoi du formulaire');
          // Afficher un message d'erreur si nécessaire
        }
      } catch (error) {
        console.error('Erreur réseau:', error);
        // Afficher un message d'erreur si nécessaire
      }
    }
  };

  const getSubjectForType = (type: 'dancers' | 'professionals' | 'volunteers') => {
    switch (type) {
      case 'dancers':
        return 'Inscription Danseurs';
      case 'professionals':
        return 'Inscription Professionnels';
      case 'volunteers':
        return 'Inscription Bénévoles';
      default:
        return 'Inscription';
    }
  };

  const getSourceForType = (type: 'dancers' | 'professionals' | 'volunteers') => {
    switch (type) {
      case 'dancers':
        return 'danseurs';
      case 'professionals':
        return 'professionnels';
      case 'volunteers':
        return 'benevoles';
      default:
        return 'website';
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', country: '', message: '' });
    setActiveTab(null);
    setTimeout(() => scrollToTop(), 100);
  };

  return (
    <div className="bg-background-dark text-slate-100 font-display antialiased">
      {/* HERO SECTION */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden grainy-bg pt-32">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-40 scale-110"
            style={{ backgroundImage: `url('${pageBackgrounds?.participate?.imageUrl || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=60&w=1920'}')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/70 via-background-dark/20 to-background-dark/80"></div>
          <div className="absolute inset-0 grainy-bg opacity-20"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-5xl md:text-7xl leading-none mb-6 tracking-tighter text-white text-luxury-glow"
          >
            {participateData.hero.title} <span className="text-primary">{participateData.hero.titleHighlight}</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg font-light tracking-wide text-slate-300 mb-8"
          >
            {participateData.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-slate-400"
          >
            Sélectionnez votre profil ci-dessous pour commencer
          </motion.div>
        </div>
      </section>

      {/* PARTICIPATION OPTIONS */}
      <section className="py-24 bg-surface-dark/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* DANSEURS */}
            <motion.div
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                activeTab === 'dancers' 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : 'bg-white/5 border border-white/10 hover:border-primary/50'
              }`}
              onClick={() => setActiveTab('dancers')}
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300"></div>
              
              <Users className={`w-12 h-12 mb-4 transition-colors ${activeTab === 'dancers' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
              
              <h3 className="text-2xl font-heading text-white mb-3">{participateData.sections.dancers.title}</h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {participateData.sections.dancers.description}
              </p>
              
              <button 
                onClick={() => handleSubscribeClick('dancers')}
                className="text-primary font-bold text-sm uppercase tracking-widest hover:text-accent-red transition-colors flex items-center gap-2"
              >
                S'inscrire <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
              </button>
            </motion.div>

            {/* PROFESSIONNELS */}
            <motion.div
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                activeTab === 'professionals' 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : 'bg-white/5 border border-white/10 hover:border-primary/50'
              }`}
              onClick={() => setActiveTab('professionals')}
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300"></div>
              
              <Briefcase className={`w-12 h-12 mb-4 transition-colors ${activeTab === 'professionals' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
              
              <h3 className="text-2xl font-heading text-white mb-3">{participateData.sections.professionals.title}</h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {participateData.sections.professionals.description}
              </p>
              
              <button 
                onClick={() => handleSubscribeClick('professionals')}
                className="text-primary font-bold text-sm uppercase tracking-widest hover:text-accent-red transition-colors flex items-center gap-2"
              >
                Rejoindre le réseau <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
              </button>
            </motion.div>

            {/* VOLONTAIRES */}
            <motion.div
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 cursor-pointer ${
                activeTab === 'volunteers' 
                  ? 'bg-primary/20 border-2 border-primary' 
                  : 'bg-white/5 border border-white/10 hover:border-primary/50'
              }`}
              onClick={() => setActiveTab('volunteers')}
            >
              <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all duration-300"></div>
              
              <Heart className={`w-12 h-12 mb-4 transition-colors ${activeTab === 'volunteers' ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`} />
              
              <h3 className="text-2xl font-heading text-white mb-3">{participateData.sections.volunteers.title}</h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {participateData.sections.volunteers.description}
              </p>
              
              <button 
                onClick={() => handleSubscribeClick('volunteers')}
                className="text-primary font-bold text-sm uppercase tracking-widest hover:text-accent-red transition-colors flex items-center gap-2"
              >
                S'inscrire <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FORMULAIRES */}
      <AnimatePresence>
        {activeTab && (
          <motion.section
            ref={formRef}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="py-16 bg-primary/5 border-t border-primary/20"
          >
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
              <AnimatePresence>
                {submissions.isSubmitted && submissions.type === activeTab ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-12"
                  >
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.4, type: "spring", stiffness: 200 }}
                    >
                      <CheckCircle className="w-20 h-20 text-primary mx-auto mb-6 drop-shadow-lg" />
                    </motion.div>
                    
                    <motion.h3 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-3xl font-heading text-white mb-3"
                    >
                      {participateData.successMessage.title}
                    </motion.h3>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-slate-300 mb-4 text-lg"
                    >
                      Merci de votre intérêt pour l'All Star Battle International !
                    </motion.p>
                    
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-slate-400 text-sm mb-8 bg-primary/10 border border-primary/30 rounded-lg p-4"
                    >
                      <p>{participateData.successMessage.subtitle}</p>
                      <p className="mt-2 text-xs text-slate-500">Retour à l'accueil dans <span className="text-primary font-bold">3 secondes</span>...</p>
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-3xl font-heading text-white">
                        {activeTab === 'dancers' && 'Inscription Danseurs'}
                        {activeTab === 'professionals' && 'Réseau Professionnels'}
                        {activeTab === 'volunteers' && 'Inscription Volontaires'}
                      </h2>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <User className="w-4 h-4" /> {participateData.formFields.nameLabel}
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Votre nom complet"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:border-primary outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Mail className="w-4 h-4" /> {participateData.formFields.emailLabel}
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          placeholder="votre@email.com"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:border-primary outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <Phone className="w-4 h-4" /> {participateData.formFields.phoneLabel}
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+228 XX XX XX XX"
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:border-primary outline-none transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                          <MapPin className="w-4 h-4" /> {participateData.formFields.countryLabel}
                        </label>
                        <div ref={countryDropdownRef} className="relative">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Sélectionnez ou recherchez un pays..."
                              value={showCountryDropdown ? countrySearch : formData.country}
                              onChange={e => setCountrySearch(e.target.value)}
                              onFocus={() => setShowCountryDropdown(true)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:border-primary outline-none transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                              <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
                            </div>
                          </div>

                          <AnimatePresence>
                            {showCountryDropdown && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto"
                              >
                                {loadingCountries ? (
                                  <div className="p-4 text-center text-slate-400">
                                    Chargement des pays...
                                  </div>
                                ) : filteredCountries.length > 0 ? (
                                  filteredCountries.map((country) => (
                                    <motion.button
                                      key={country.code}
                                      type="button"
                                      onClick={() => handleSelectCountry(country.name)}
                                      className={`w-full text-left px-4 py-3 transition-colors hover:bg-primary/20 ${
                                        formData.country === country.name ? 'bg-primary/30 text-primary' : 'text-white'
                                      }`}
                                      whileHover={{ x: 5 }}
                                    >
                                      <span className="flex items-center gap-2">
                                        <span className="text-slate-500 text-xs font-mono">{country.code}</span>
                                        <span>{country.name}</span>
                                      </span>
                                    </motion.button>
                                  ))
                                ) : (
                                  <div className="p-4 text-center text-slate-400 text-sm">
                                    Aucun pays trouvé pour "{countrySearch}"
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{participateData.formFields.messageLabel}</label>
                      <textarea
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Parlez-nous de vous..."
                        rows={5}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder-slate-600 focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>

                    <div className="flex gap-4 justify-end">
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-3 border border-white/20 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white/5 transition-all"
                      >
                        Annuler
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmit(activeTab)}
                        disabled={!formData.name || !formData.email || !formData.phone || !formData.country}
                        className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-background-dark rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Send className="w-4 h-4" /> Envoyer
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Participate;
