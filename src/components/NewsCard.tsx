import React, { useState } from 'react';
import { Calendar, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { NewsItem, Language } from '../types';
import { formatDate, getPlaceholderCover, normalizeUrl, isToday } from '../utils/helpers';

interface NewsCardProps {
  news: NewsItem;
  onOpenDetails: (news: NewsItem) => void;
  lang: Language;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onOpenDetails, lang }) => {
  const [imageError, setImageError] = useState(false);
  const isNewsToday = isToday(news.date);
  const coverSrc = !imageError && news.image ? normalizeUrl(news.image) : getPlaceholderCover(news.title);

  return (
    <article
      onClick={() => onOpenDetails(news)}
      className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-sky-950/20 flex flex-col"
    >
      {/* Thumbnail */}
      <div className="w-full aspect-video overflow-hidden relative bg-slate-950">
        <img
          src={coverSrc}
          alt={news.title}
          onError={() => setImageError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Category tag */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full backdrop-blur-md border ${
              news.type === 'today'
                ? 'bg-amber-500/90 text-slate-950 border-amber-300 font-extrabold'
                : 'bg-red-600/90 text-white border-red-400'
            }`}
          >
            {news.type === 'today' ? 'Tudo de Hoje' : 'News Hoje'}
          </span>
        </div>

        {isNewsToday && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[9px] font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/40">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Hoje</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata */}
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-500" />
              <span>{formatDate(news.date, lang)}</span>
            </span>
            {news.views ? (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-slate-500" />
                  <span>{news.views.toLocaleString()}</span>
                </span>
              </>
            ) : null}
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug mb-1.5">
            {news.title}
          </h3>

          {/* Excerpt */}
          <p className="text-[11px] text-slate-400 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-2.5">
            {news.content}
          </p>
        </div>

        {/* Read More Link */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-semibold text-sky-400 group-hover:text-amber-300 transition-colors">
          <span>Ler notícia completa</span>
          <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};
