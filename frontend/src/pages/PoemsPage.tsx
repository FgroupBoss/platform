import { useEffect, useState } from 'react';
import { fetchPoems } from '../api/poems';
import PoemCard from '../components/PoemCard';
import Empty from '../components/Empty';
import { ApiError } from '../api/client';
import type { Poem } from '../types';

export default function PoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPoems()
      .then(setPoems)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '加载失败'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">唐诗宋词</h1>
        <p className="text-sm text-slate-500 mt-1">共 {poems.length} 首</p>
      </div>

      {loading && <p className="text-sm text-slate-500">加载中...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && poems.length === 0 && (
        <Empty title="暂无诗词" description="后台暂无已发布诗词" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {poems.map((poem) => (
          <PoemCard key={poem.id} poem={poem} />
        ))}
      </div>
    </div>
  );
}
