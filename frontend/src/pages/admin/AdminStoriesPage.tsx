import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { deleteStory, fetchAdminStories, updateStoryStatus } from '../../api/admin';
import ListAudioActions from '../../components/admin/ListAudioActions';
import type { Story } from '../../types';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = () => {
    setLoading(true);
    fetchAdminStories(1, 50)
      .then((res) => setStories(res.records))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除这篇故事？')) return;
    await deleteStory(id);
    load();
  };

  const toggleStatus = async (story: Story) => {
    const next = story.status === 'published' ? 'draft' : 'published';
    await updateStoryStatus(story.id, next);
    load();
  };

  const handleAudioDone = (msg: string) => {
    setMessage(msg);
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">故事管理</h1>
        <Link to="/admin/stories/new" className="flex items-center gap-1 px-3 py-2 rounded-lg bg-violet-500 text-white text-sm">
          <Plus size={16} /> 新增
        </Link>
      </div>
      <p className="text-xs text-slate-500">音频列：上传图标 = 选择 MP3 并一键绑定 · 喇叭图标 = 文字转音频</p>
      {message && <p className="text-sm text-amber-400">{message}</p>}
      {loading ? (
        <p className="text-slate-500">加载中...</p>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="text-left p-3">标题</th>
                <th className="text-left p-3">类型</th>
                <th className="text-left p-3">状态</th>
                <th className="text-left p-3">音频</th>
                <th className="text-right p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story) => (
                <tr key={story.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                  <td className="p-3 text-white">{story.title}</td>
                  <td className="p-3 text-slate-400">{story.storyType}</td>
                  <td className="p-3">
                    <button type="button" onClick={() => toggleStatus(story)} className={`text-xs px-2 py-0.5 rounded-full ${story.status === 'published' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-500/15 text-slate-400'}`}>
                      {story.status === 'published' ? '已发布' : '草稿'}
                    </button>
                  </td>
                  <td className="p-3">
                    <ListAudioActions
                      contentId={story.id}
                      contentType="story"
                      hasAudio={!!story.audioUrl}
                      onDone={handleAudioDone}
                    />
                  </td>
                  <td className="p-3 text-right space-x-2">
                    <Link to={`/admin/stories/${story.id}/edit`} className="text-violet-400 hover:underline">编辑</Link>
                    <button type="button" onClick={() => handleDelete(story.id)} className="text-red-400 hover:text-red-300 inline-flex">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
