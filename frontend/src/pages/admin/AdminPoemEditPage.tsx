import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import {
  createPoem, fetchAdminPoem, generatePoemAudio, updatePoem,
} from '../../api/admin';
import { ApiError } from '../../api/client';
import AdminMediaSection from '../../components/admin/AdminMediaSection';
import { AdminField, inputCls } from '../../components/admin/AdminField';

function toMediaId(id: string | null): number | null {
  if (!id) return null;
  const n = Number(id);
  return Number.isNaN(n) ? null : n;
}

export default function AdminPoemEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [dynasty, setDynasty] = useState('唐');
  const [linesText, setLinesText] = useState('');
  const [pinyinText, setPinyinText] = useState('');
  const [translation, setTranslation] = useState('');
  const [difficulty, setDifficulty] = useState('easy');
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
    fetchAdminPoem(id).then((poem) => {
      setTitle(poem.title);
      setAuthor(poem.author || '');
      setDynasty(poem.dynasty || '唐');
      setLinesText((poem.lines || []).join('\n'));
      setPinyinText((poem.pinyin || []).join('\n'));
      setTranslation(poem.translation || '');
      setDifficulty(poem.difficulty || 'easy');
      setStatus(poem.status || 'draft');
      setSortOrder(poem.sortOrder || 0);
      setCoverId(poem.coverId || null);
      setAudioId(poem.audioId || null);
      setVideoId(poem.videoId || null);
      setAudioUrl(poem.audioUrl || null);
    }).finally(() => setLoading(false));
  }, [id, isNew]);

  const buildPayload = () => ({
    title,
    author,
    dynasty,
    lines: linesText.split('\n').map((l) => l.trim()).filter(Boolean),
    pinyin: pinyinText.split('\n').map((l) => l.trim()).filter(Boolean),
    translation,
    difficulty,
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
        const created = await createPoem(payload);
        navigate(`/admin/poems/${created.id}/edit`, { replace: true });
        setMessage('创建成功');
      } else if (id) {
        await updatePoem(id, payload);
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
      const poem = await generatePoemAudio(id);
      setAudioId(poem.audioId || null);
      setAudioUrl(poem.audioUrl || null);
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
      <Link to="/admin/poems" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300">
        <ArrowLeft size={16} /> 返回列表
      </Link>
      <h1 className="text-xl font-bold text-white">{isNew ? '新增诗词' : '编辑诗词'}</h1>
      {message && <p className="text-sm text-amber-400">{message}</p>}

      <div className="space-y-3">
        <AdminField label="标题"><input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} /></AdminField>
        <div className="grid grid-cols-2 gap-3">
          <AdminField label="作者"><input value={author} onChange={(e) => setAuthor(e.target.value)} className={inputCls} /></AdminField>
          <AdminField label="朝代"><input value={dynasty} onChange={(e) => setDynasty(e.target.value)} className={inputCls} /></AdminField>
        </div>
        <AdminField label="诗句（每行一句）">
          <textarea value={linesText} onChange={(e) => setLinesText(e.target.value)} rows={5} className={inputCls} />
        </AdminField>
        <AdminField label="拼音（每行一句，可选）">
          <textarea value={pinyinText} onChange={(e) => setPinyinText(e.target.value)} rows={5} className={inputCls} />
        </AdminField>
        <AdminField label="释义">
          <textarea value={translation} onChange={(e) => setTranslation(e.target.value)} rows={3} className={inputCls} />
        </AdminField>
        <div className="grid grid-cols-3 gap-3">
          <AdminField label="难度">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={inputCls}>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
            </select>
          </AdminField>
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
