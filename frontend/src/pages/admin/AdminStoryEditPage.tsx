import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  createStory, fetchAdminStory, generateStoryAudio, updateStory,
} from '../../api/admin';
import { ApiError } from '../../api/client';
import AdminMediaSection from '../../components/admin/AdminMediaSection';
import { AdminField, inputCls } from '../../components/admin/AdminField';

function toMediaId(id: string | null): number | null {
  if (!id) return null;
  const n = Number(id);
  return Number.isNaN(n) ? null : n;
}

export default function AdminStoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [storyType, setStoryType] = useState('童话');
  const [paragraphsText, setParagraphsText] = useState('');
  const [ageMin, setAgeMin] = useState(3);
  const [status, setStatus] = useState('draft');
  const [sortOrder, setSortOrder] = useState(0);
  const [coverId, setCoverId] = useState<string | null>(null);
  const [audioId, setAudioId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isNew || !id) return;
    fetchAdminStory(id).then((story) => {
      setTitle(story.title);
      setStoryType(story.storyType || '童话');
      setParagraphsText((story.paragraphs || []).join('\n\n'));
      setAgeMin(story.ageMin || 3);
      setStatus(story.status || 'draft');
      setSortOrder(story.sortOrder || 0);
      setCoverId(story.coverId || null);
      setAudioId(story.audioId || null);
      setVideoId(story.videoId || null);
      setAudioUrl(story.audioUrl || null);
    }).finally(() => setLoading(false));
  }, [id, isNew]);

  const buildPayload = () => ({
    title,
    storyType,
    paragraphs: paragraphsText.split('\n\n').map((p) => p.trim()).filter(Boolean),
    ageMin,
    status,
    sortOrder,
    coverId: toMediaId(coverId),
    audioId: toMediaId(audioId),
    videoId: toMediaId(videoId),
  });

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const payload = buildPayload();
      if (isNew) {
        const created = await createStory(payload);
        navigate(`/admin/stories/${created.id}/edit`, { replace: true });
        setMessage('创建成功');
      } else if (id) {
        await updateStory(id, payload);
        setMessage('保存成功');
      }
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAudio = async () => {
    if (!id || isNew) return;
    setGenerating(true);
    setMessage('');
    try {
      const story = await generateStoryAudio(id);
      setAudioId(story.audioId || null);
      setAudioUrl(story.audioUrl || null);
      setMessage('音频生成并绑定成功');
    } catch (e) {
      setMessage(e instanceof ApiError ? e.message : '生成失败，请检查网络或稍后重试');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) return <p className="text-slate-500">加载中...</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <Link to="/admin/stories" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300">
        <ArrowLeft size={16} /> 返回列表
      </Link>
      <h1 className="text-xl font-bold text-white">{isNew ? '新增故事' : '编辑故事'}</h1>
      {message && <p className="text-sm text-amber-400">{message}</p>}

      <div className="space-y-3">
        <AdminField label="标题"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} /></AdminField>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="类型">
            <select value={storyType} onChange={(e) => setStoryType(e.target.value)} className={inputCls}>
              <option value="童话">童话</option>
              <option value="寓言">寓言</option>
              <option value="成语">成语</option>
              <option value="原创">原创</option>
            </select>
          </AdminField>
          <AdminField label="适龄">
            <input type="number" value={ageMin} onChange={(e) => setAgeMin(Number(e.target.value))} className={inputCls} />
          </AdminField>
        </div>
        <AdminField label="正文（段与段之间空一行）">
          <textarea value={paragraphsText} onChange={(e) => setParagraphsText(e.target.value)} rows={10} className={inputCls} />
        </AdminField>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="状态">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </AdminField>
          <AdminField label="排序">
            <input type="number" value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} className={inputCls} />
          </AdminField>
        </div>

        <AdminMediaSection
          isNew={isNew}
          coverId={coverId}
          audioId={audioId}
          videoId={videoId}
          audioUrl={audioUrl}
          onCoverChange={setCoverId}
          onAudioChange={(mid, url) => { setAudioId(mid); if (url) setAudioUrl(url); }}
          onVideoChange={setVideoId}
          onGenerateAudio={handleGenerateAudio}
          generating={generating}
        />

        <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 rounded-lg bg-violet-500 text-white text-sm disabled:opacity-50">
          {saving ? '保存中...' : '保存'}
        </button>
      </div>
    </div>
  );
}
