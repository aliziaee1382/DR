import React from 'react';
import { useApp } from '../context/AppContext';
import { ChevronLeft, Calendar, Clock, User, Tag, Share2, Sparkles } from 'lucide-react';

interface BlogDetailPageProps {
  articleId: string;
  onNavigate: (page: string, params?: any) => void;
}

export const BlogDetailPage: React.FC<BlogDetailPageProps> = ({ articleId, onNavigate }) => {
  const { articles } = useApp();
  const article = articles.find((a) => a.id === articleId) || articles[0];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button
        onClick={() => onNavigate('blog')}
        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4 rotate-180" />
        <span>بازگشت به مجله سلامت</span>
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="space-y-3">
          <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full">
            {article.category}
          </span>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-100 pb-4">
            <span>نویسنده: <strong className="text-slate-800">{article.author} ({article.authorRole})</strong></span>
            <span>تاریخ: {article.date}</span>
            <span>زمان مطالعه: {article.readTime}</span>
          </div>
        </div>

        <img
          src={article.image}
          alt={article.title}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80';
          }}
          className="w-full h-80 object-cover rounded-3xl shadow-xs"
        />

        <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4 whitespace-pre-line font-normal">
          {article.content}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
          <Tag className="w-4 h-4 text-slate-400" />
          {article.tags.map((t, idx) => (
            <span key={idx} className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-lg">
              #{t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
