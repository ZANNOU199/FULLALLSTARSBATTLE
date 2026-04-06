import React from 'react';
import { motion } from 'motion/react';
import { cmsService } from './services/cmsService';
import { ArrowLeft, Calendar, User, Tag, Share2 } from 'lucide-react';

interface Article {
  id: string;
  date: string;
  title: string;
  desc: string;
  tag: string;
  content: string;
  image: string;
  author: string;
  category: string;
}

const articles: Article[] = []; // Removed hardcoded data

interface NewsProps {
  onBack: () => void;
  initialArticleId?: string;
}

export default function News({ onBack, initialArticleId }: NewsProps) {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = React.useState<Article | null>(null);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await cmsService.getData();
        const formattedArticles = data.blog.articles.map(a => ({
          id: a.id,
          date: a.date,
          title: a.title,
          desc: a.content.substring(0, 150) + "...",
          tag: a.category,
          content: a.content,
          image: a.coverImage,
          author: "Admin All Star", // Default author
          category: a.category
        }));
        setArticles(formattedArticles);
        
        if (initialArticleId) {
          const found = formattedArticles.find(a => a.id === initialArticleId);
          if (found) setSelectedArticle(found);
        }
      } catch (error) {
        console.error('Failed to load news articles:', error);
      }
    };
    
    loadData();
  }, [initialArticleId]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedArticle]);

  if (selectedArticle) {
    return (
      <div className="bg-background-dark min-h-screen text-slate-100 font-display pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <button 
            onClick={() => setSelectedArticle(null)}
            className="flex items-center gap-2 text-primary hover:text-white transition-colors mb-12 uppercase font-black tracking-widest text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Retour aux actualités
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative aspect-video mb-12 overflow-hidden rounded-lg border border-white/10">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-primary text-background-dark px-4 py-1 font-black tracking-widest text-xs uppercase">
                {selectedArticle.tag}
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mb-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest border-b border-white/5 pb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" /> {selectedArticle.date}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> {selectedArticle.author}
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" /> {selectedArticle.category}
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-heading text-white mb-10 leading-none uppercase">
              {selectedArticle.title}
            </h1>

            <div className="prose prose-invert max-w-none">
              {selectedArticle.content.split('\n').map((paragraph, idx) => (
                <p key={idx} className="text-slate-300 text-lg leading-relaxed mb-6 font-light">
                  {paragraph.trim()}
                </p>
              ))}
            </div>

            <div className="mt-20 pt-10 border-t border-white/10 flex justify-between items-center">
              <div className="flex gap-4">
                <button className="p-3 border border-white/10 hover:bg-primary hover:text-background-dark transition-all" aria-label="Partager cet article">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
              <button 
                onClick={onBack}
                className="btn-luxury-primary"
              >
                RETOUR AU SITE
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-dark min-h-screen text-slate-100 font-display pt-32 pb-20 grainy-bg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center">
          <span className="text-accent-red font-bold tracking-[0.5em] uppercase text-xs block mb-4">Le Blog Officiel</span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-heading text-white leading-none uppercase tracking-tighter">
            ACTUALITÉS <br/> <span className="text-primary italic">& NEWS</span>
          </h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {articles.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -10 }}
              className="group bg-surface-dark border border-white/5 overflow-hidden transition-all duration-500 hover:border-primary/50"
            >
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 z-20 bg-primary text-background-dark px-3 py-1 text-[10px] font-black tracking-widest">
                  {article.tag}
                </div>
              </div>
              <div className="p-8">
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{article.date}</span>
                <h3 className="text-white font-heading text-2xl mt-3 mb-4 group-hover:text-primary transition-colors leading-tight uppercase">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light line-clamp-3">
                  {article.desc}
                </p>
                <button 
                  onClick={() => setSelectedArticle(article)}
                  className="inline-flex items-center gap-3 text-[10px] font-black tracking-[0.3em] uppercase text-white hover:text-primary transition-all"
                >
                  LIRE LA SUITE
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
