import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ChevronLeft, Clock, User, Sparkles } from 'lucide-react';

interface BlogPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const { articles } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('همه');

  const categories = ['همه', 'سلامت قلب', 'پوست و زیبایی', 'بهداشت روان', 'تغذیه و سلامتی'];

  const filteredArticles = articles.filter((art) => {
    if (selectedCategory !== 'همه' && art.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        art.title.toLowerCase().includes(q) ||
        art.summary.toLowerCase().includes(q) ||
        art.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 shadow-xl text-center space-y-4">
        <span className="bg-teal-500/20 text-teal-200 text-xs font-bold px-3 py-1 rounded-full border border-teal-400/30 inline-flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5" />
          مجله تخصصی پزشکی و آنلاین سلامت
        </span>
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">آخرین اخبار و توصیه‌های علمی سلامت</h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          مقالات و توصیه‌های پزشکی معتبر نگارش شده توسط پزشکان متخصص و فوق‌تخصص عضو سامانه.
        </p>

        {/* Search */}
        <div className="max-w-md mx-auto pt-2">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجو در مقالات (مثال: فشار خون، پوست، اضطراب)..."
              className="w-full bg-white text-slate-800 text-xs rounded-2xl pr-11 pl-4 py-3 focus:outline-none shadow-md"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs font-bold">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl shrink-0 transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            onClick={() => onNavigate('blog-detail', { articleId: art.id })}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <img
                src={art.image}
                alt={art.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80';
                }}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-5 space-y-2">
                <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-2.5 py-0.5 rounded-md inline-block">
                  {art.category}
                </span>
                <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-teal-600 transition-colors">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {art.summary}
                </p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium text-slate-600">{art.author}</span>
              <span>{art.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
