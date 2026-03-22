import React from 'react';
import { motion } from 'motion/react';
import { jsPDF } from 'jspdf';
import { cmsService } from './services/cmsService';
import { 
  Theater, 
  Utensils, 
  Truck, 
  Hotel, 
  Video, 
  Shield, 
  FileText, 
  Mail,
  ChevronRight
} from 'lucide-react';

interface PartnersProps {
  onContactClick?: (e: React.MouseEvent) => void;
}

const Partners = ({ onContactClick }: PartnersProps) => {
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [partners, setPartners] = React.useState<{
    institutional: string[];
    main: { src: string; tier: string }[];
    media: string[];
  }>({ institutional: [], main: [], media: [] });
  const [sponsoringPdfUrl, setSponsoringPdfUrl] = React.useState("");
  const [ctaData, setCtaData] = React.useState<{ title: string; subtitle: string; buttonText: string }>({
    title: "DEVENIR PARTENAIRE",
    subtitle: "Rejoignez l'élite de la culture urbaine africaine",
    buttonText: "Nous contacter"
  });

  React.useEffect(() => {
    const loadPartners = async () => {
      try {
        const data = await cmsService.getData();
        const allPartners = data?.partners?.logos || [];

        setPartners({
          institutional: allPartners.filter(p => p.category === 'Institutional').map(p => p.logo),
          main: allPartners.filter(p => p.category === 'Main').map(p => ({ src: p.logo, tier: p.tier || "Partenaire Officiel" })),
          media: allPartners.filter(p => p.category === 'Media').map(p => p.logo)
        });
        setSponsoringPdfUrl(data?.partners?.sponsoringPdfUrl || "");

        if (data?.partners?.cta) {
          setCtaData({
            title: data.partners.cta.title || "DEVENIR PARTENAIRE",
            subtitle: data.partners.cta.subtitle || "Rejoignez l'élite de la culture urbaine africaine",
            buttonText: data.partners.cta.buttonText || "Nous contacter"
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement des partenaires:', error);
      }
    };

    loadPartners();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: 'Demande d\'information - Partenariat/Sponsoring',
      message: `Entreprise: ${formData.get('company')}\nType de Partenariat: ${formData.get('partnershipType')}\n\n${formData.get('message')}`,
      source: 'sponsors'
    };

    try {
      const response = await fetch('http://localhost:8000/api/cms/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Demande envoyée ! Notre équipe de partenariat vous contactera sous peu.");
        (e.target as HTMLFormElement).reset();
      } else {
        alert("Erreur lors de l'envoi. Veuillez réessayer.");
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
      alert("Erreur réseau. Veuillez réessayer.");
    }
  };

  const handleDownload = () => {
    if (sponsoringPdfUrl) {
      window.open(sponsoringPdfUrl, '_blank');
      return;
    }
    
    setIsDownloading(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        const primaryColor = '#d35f17';
        
        // Header
        doc.setFillColor(10, 8, 7); // Background dark
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setTextColor(211, 95, 23); // Primary color
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('ALL STARS BATTLE INTERNATIONAL 2026', 105, 20, { align: 'center' });
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.text('DOSSIER DE SPONSORING OFFICIEL', 105, 30, { align: 'center' });
        
        // Content
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16);
        doc.text('PRÉSENTATION DE L\'ÉVÉNEMENT', 20, 55);
        doc.setDrawColor(211, 95, 23);
        doc.line(20, 57, 100, 57);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const intro = "L'All Stars Battle International est le plus grand événement de breakdance et de culture urbaine en Afrique de l'Ouest. Pour sa version 2026, nous réunissons l'élite mondiale au Palais des Congrès de Lomé pour une compétition sans précédent.";
        const splitIntro = doc.splitTextToSize(intro, 170);
        doc.text(splitIntro, 20, 65);
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('POURQUOI NOUS REJOINDRE ?', 20, 90);
        doc.line(20, 92, 100, 92);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        const benefits = [
          "- Visibilité internationale (TV, Web, Presse)",
          "- Accès à une audience jeune et dynamique (15-35 ans)",
          "- Soutien à la culture et à la jeunesse africaine",
          "- Espaces VIP et networking exclusifs"
        ];
        doc.text(benefits, 20, 100);
        
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text('NOS PACKS DE PARTENARIAT', 20, 130);
        doc.line(20, 132, 100, 132);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('1. PACK PLATINE', 20, 140);
        doc.setFont('helvetica', 'normal');
        doc.text('Visibilité maximale, logo sur scène principale, 10 pass VIP.', 20, 145);
        
        doc.setFont('helvetica', 'bold');
        doc.text('2. PACK OR', 20, 155);
        doc.setFont('helvetica', 'normal');
        doc.text('Logo sur supports de communication, 5 pass VIP.', 20, 160);
        
        doc.setFont('helvetica', 'bold');
        doc.text('3. PACK ARGENT', 20, 170);
        doc.setFont('helvetica', 'normal');
        doc.text('Logo sur site web et réseaux sociaux, 2 pass VIP.', 20, 175);
        
        // Footer
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 260, 190, 260);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Contact : partners@allstarsbattle.tg | Lomé, Togo', 105, 270, { align: 'center' });
        doc.text('www.allstarsbattle.tg', 105, 275, { align: 'center' });
        
        doc.save('Dossier_Sponsoring_ASB_2026.pdf');
        
        setIsDownloading(false);
        alert("Le dossier de sponsoring a été généré avec succès !");
      } catch (error) {
        console.error("Erreur lors de la génération du PDF:", error);
        setIsDownloading(false);
        alert("Une erreur est survenue lors de la création du PDF. Veuillez réessayer.");
      }
    }, 1500);
  };

  return (
    <div className="bg-background-dark text-slate-100 font-sans selection:bg-primary selection:text-background-dark">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-background-dark/40 via-background-dark/80 to-background-dark"></div>
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC0lkyndPxHdwEfazRdjB13822YZcjixIWE8WK5GcJSXMqMAh7JeFl7FbkST2Hxc8RIh1EwCqYDWe3PQ5GGsfa4-uOKdoswIZ94ZloqPZ81knxjnWfH4OPq_RwRBkExg-z2dVZomcNPPV1WyGd_v9sSVaOxliL2oHd88sZVXU713LuZ1o-ez0V8ipxQBCFmBxpH869-CcQov884KdaVd-JnSSbtCMBsw6VWyRsyMFF0937zmPyjYiNp7bPYGdFhxPVliuRDJFOaBngQ')" }}
          ></div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-accent-red font-bold tracking-[0.3em] uppercase mb-4 text-sm"
          >
            Alliance Stratégique
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="font-heading text-6xl md:text-9xl text-white mb-6 tracking-tight leading-none uppercase"
          >
            NOS <span className="text-primary">PARTENAIRES</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed italic"
          >
            Une synergie d'excellence au service de la culture urbaine internationale. Ensemble, nous repoussons les limites du breakdance au Togo.
          </motion.p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 space-y-32 pb-32">
        {/* Institutional Partners */}
        <section>
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-primary/30"></div>
            <h2 className="font-heading text-3xl text-primary tracking-widest uppercase px-4 text-center">Partenaires Institutionnels</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/30 to-primary/30"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.institutional.map((src, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-surface-dark/60 backdrop-blur-md border border-white/5 p-8 rounded-sm flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:border-primary/50"
              >
                <img src={src} alt="Partner" className="max-h-20 w-auto opacity-80 hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Sponsors (Gold Tier) */}
        <section>
          <div className="text-center mb-16">
            <h2 className="font-heading text-5xl text-white tracking-widest uppercase mb-2">Sponsors Officiels</h2>
            <div className="h-1 w-24 bg-primary mx-auto mb-8"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {partners.main.map((sponsor, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-surface-dark/60 backdrop-blur-md border border-primary/20 p-12 rounded-sm flex items-center justify-center relative group overflow-hidden hover:border-primary transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-2 bg-primary text-background-dark font-black text-[10px] uppercase tracking-tighter">
                  {sponsor.tier}
                </div>
                <img src={sponsor.src} alt="Sponsor" className="max-h-32 w-auto transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Media Partners */}
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-heading text-3xl text-accent-red tracking-widest uppercase">Media & Broadcasting</h2>
            <div className="h-px flex-1 ml-12 bg-gradient-to-r from-accent-red/40 to-transparent"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {partners.media.map((src, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 border border-white/10 hover:border-accent-red/40 p-6 flex items-center justify-center grayscale contrast-125 opacity-70 hover:opacity-100 hover:grayscale-0 transition-all duration-500"
              >
                <img src={src} alt="Media Partner" className="max-h-12 w-auto" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical & Local Partners */}
        <section>
          <div className="mb-12">
            <h2 className="font-heading text-3xl text-white tracking-widest uppercase mb-1">Production & Partenaires Locaux</h2>
            <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">L'excellence opérationnelle au cœur de l'événement</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: <Theater className="w-8 h-8" />, label: "Scénographie" },
              { icon: <Utensils className="w-8 h-8" />, label: "Catering" },
              { icon: <Truck className="w-8 h-8" />, label: "Logistique" },
              { icon: <Hotel className="w-8 h-8" />, label: "Hospitalité" },
              { icon: <Video className="w-8 h-8" />, label: "Production Vidéo" },
              { icon: <Shield className="w-8 h-8" />, label: "Sécurité" }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="border border-white/5 p-6 flex flex-col items-center gap-4 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-primary">
                  {item.icon}
                </div>
                <span className="text-[10px] text-center font-black tracking-tighter uppercase whitespace-nowrap">{item.label}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-surface-dark border border-primary/20 rounded-sm p-8 md:p-16 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h2 className="font-heading text-4xl md:text-6xl text-white mb-6 uppercase tracking-tight leading-none">{ctaData.title}</h2>
              <p className="text-slate-400 mb-10 leading-relaxed font-light italic">{ctaData.subtitle}</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`btn-luxury-primary shimmer-effect w-full sm:w-auto text-center flex items-center justify-center gap-2 ${isDownloading ? 'opacity-80 cursor-wait' : ''}`}
                >
                  {isDownloading ? (
                    <>
                      <motion.div 
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-background-dark border-t-transparent rounded-full"
                      />
                      Préparation...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Dossier de Sponsoring
                    </>
                  )}
                </button>
                <button 
                  onClick={onContactClick}
                  className="btn-luxury-secondary w-full sm:w-auto text-center flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {ctaData.buttonText}
                </button>
              </div>
            </div>
            <div className="bg-background-dark/50 backdrop-blur-md p-10 rounded-sm border border-white/5 shadow-inner">
              <h3 className="font-black text-xl mb-8 text-primary uppercase tracking-widest">Demande d'information</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <input required name="name" className="bg-surface-dark border border-white/10 rounded-sm focus:border-primary text-sm p-4 w-full outline-none transition-all" placeholder="Nom" type="text"/>
                  <input required name="company" className="bg-surface-dark border border-white/10 rounded-sm focus:border-primary text-sm p-4 w-full outline-none transition-all" placeholder="Entreprise" type="text"/>
                </div>
                <input required name="email" className="bg-surface-dark border border-white/10 rounded-sm focus:border-primary text-sm p-4 w-full outline-none transition-all" placeholder="Email professionnel" type="email"/>
                <select name="partnershipType" className="bg-surface-dark border border-white/10 rounded-sm focus:border-primary text-sm p-4 w-full outline-none transition-all text-slate-400 cursor-pointer">
                  <option>Type de Partenariat</option>
                  <option>Sponsoring Officiel</option>
                  <option>Partenariat Média</option>
                  <option>Support Technique</option>
                </select>
                <textarea required name="message" className="bg-surface-dark border border-white/10 rounded-sm focus:border-primary text-sm p-4 w-full outline-none transition-all resize-none" placeholder="Votre message" rows={4}></textarea>
                <button className="w-full bg-accent-red text-white font-black py-4 uppercase text-xs tracking-[0.3em] hover:bg-accent-red/90 transition-all flex items-center justify-center gap-2">
                  Envoyer <ChevronRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Partners;
