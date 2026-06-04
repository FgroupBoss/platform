import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ScrollText } from 'lucide-react';
import { fetchHomeRecommend } from '../api/home';
import type { HomeRecommend } from '../types';
import { ApiError } from '../api/client';

export default function HomePage() {
  const [recommend, setRecommend] = useState<HomeRecommend | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHomeRecommend()
      .then(setRecommend)
      .catch((e: unknown) => {
        setError(e instanceof ApiError ? e.message : '加载失败，请确认后端已启动');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">诗词故事</h1>
        <p className="text-sm text-slate-500 mt-1">家庭幼儿文化启蒙 · 听诗读故事</p>
      </div>

      {loading && <p className="text-sm text-slate-500">加载中...</p>}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
          <p className="text-xs text-slate-500 mt-2">请先运行：cd backend &amp;&amp; mvn spring-boot:run</p>
        </div>
      )}

      {recommend && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-slate-400">今日推荐</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommend.poem ? (
              <Link to={`/poems/${recommend.poem.id}`} className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors">
                <ScrollText size={22} className="text-emerald-400 mb-2" />
                <p className="text-xs text-emerald-400/70">诗词</p>
                <h3 className="text-lg font-semibold text-white mt-1">{recommend.poem.title}</h3>
                <p className="text-sm text-slate-500">{recommend.poem.author} · {recommend.poem.dynasty}</p>
              </Link>
            ) : (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-sm">暂无推荐诗词</div>
            )}
            {recommend.story ? (
              <Link to={`/stories/${recommend.story.id}`} className="p-5 rounded-xl bg-amber-500/5 border border-amber-500/20 hover:border-amber-500/40 transition-colors">
                <BookOpen size={22} className="text-amber-400 mb-2" />
                <p className="text-xs text-amber-400/70">故事</p>
                <h3 className="text-lg font-semibold text-white mt-1">{recommend.story.title}</h3>
                <p className="text-sm text-slate-500">{recommend.story.storyType}</p>
              </Link>
            ) : (
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-slate-500 text-sm">暂无推荐故事</div>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/poems" className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors group">
          <ScrollText size={28} className="text-emerald-400 mb-3" />
          <h2 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">唐诗宋词</h2>
          <p className="text-sm text-slate-500 mt-1">名篇朗读，跟读启蒙</p>
        </Link>
        <Link to="/stories" className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors group">
          <BookOpen size={28} className="text-amber-400 mb-3" />
          <h2 className="text-lg font-semibold text-white group-hover:text-amber-400 transition-colors">讲故事</h2>
          <p className="text-sm text-slate-500 mt-1">童话寓言，睡前陪伴</p>
        </Link>
      </div>
    </div>
  );
}
