import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAdminPoems, fetchAdminStories, fetchAdminMedia } from '../../api/admin';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ poems: 0, stories: 0, media: 0 });

  useEffect(() => {
    Promise.all([
      fetchAdminPoems(1, 1),
      fetchAdminStories(1, 1),
      fetchAdminMedia(1, 1),
    ]).then(([p, s, m]) => {
      setStats({ poems: p.total, stories: s.total, media: m.total });
    }).catch(() => {});
  }, []);

  const cards = [
    { label: '诗词', count: stats.poems, to: '/admin/poems', color: 'text-emerald-400' },
    { label: '故事', count: stats.stories, to: '/admin/stories', color: 'text-amber-400' },
    { label: '媒体文件', count: stats.media, to: '/admin/media', color: 'text-violet-400' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-white">概览</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20">
            <p className="text-sm text-slate-500">{c.label}</p>
            <p className={`text-3xl font-bold mt-2 ${c.color}`}>{c.count}</p>
          </Link>
        ))}
      </div>
      <p className="text-xs text-slate-600">联调模式使用 H2 内存库，重启后数据重置（种子数据会自动导入）</p>
    </div>
  );
}
