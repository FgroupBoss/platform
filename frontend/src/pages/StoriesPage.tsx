import { useEffect, useState } from 'react';
import { fetchStories } from '../api/stories';
import StoryCard from '../components/StoryCard';
import Empty from '../components/Empty';
import { ApiError } from '../api/client';
import type { Story } from '../types';

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStories()
      .then(setStories)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '加载失败'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">讲故事</h1>
        <p className="text-sm text-slate-500 mt-1">共 {stories.length} 篇</p>
      </div>

      {loading && <p className="text-sm text-slate-500">加载中...</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}
      {!loading && !error && stories.length === 0 && (
        <Empty title="暂无故事" description="后台暂无已发布故事" />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stories.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
    </div>
  );
}
