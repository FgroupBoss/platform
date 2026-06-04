import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchPoemDetail } from '../api/poems';
import AudioPlayer from '../components/AudioPlayer';
import { useSpeech } from '../hooks/useSpeech';
import { ApiError } from '../api/client';
import type { Poem } from '../types';

export default function PoemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [poem, setPoem] = useState<Poem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPinyin, setShowPinyin] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const { speakLines, cancel, isSpeaking } = useSpeech();

  useEffect(() => {
    if (!id) return;
    fetchPoemDetail(id)
      .then(setPoem)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => () => cancel(), [cancel]);

  const handleFallbackPlay = () => {
    if (!poem) return;
    if (isSpeaking) {
      cancel();
      return;
    }
    const lines = [poem.title, ...(poem.lines || [])];
    speakLines(lines);
  };

  if (loading) return <p className="text-slate-500">加载中...</p>;
  if (error || !poem) return <p className="text-red-400">{error || '诗词不存在'}</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/poems" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300">
        <ArrowLeft size={16} /> 返回列表
      </Link>

      <div className="text-center space-y-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{poem.title}</h1>
          <p className="text-slate-500 mt-2">{poem.author} · {poem.dynasty}</p>
        </div>

        <div className="space-y-4">
          {poem.lines.map((line, i) => (
            <div key={i}>
              <p className="text-xl leading-relaxed text-white tracking-widest">{line}</p>
              {showPinyin && poem.pinyin?.[i] && (
                <p className="text-sm text-slate-500 mt-1">{poem.pinyin[i]}</p>
              )}
            </div>
          ))}
        </div>

        {showTranslation && poem.translation && (
          <p className="text-sm text-slate-400 text-left p-4 rounded-lg bg-white/5 border border-white/10">
            {poem.translation}
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-4 text-sm">
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" checked={showPinyin} onChange={(e) => setShowPinyin(e.target.checked)} className="rounded" />
            显示拼音
          </label>
          <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
            <input type="checkbox" checked={showTranslation} onChange={(e) => setShowTranslation(e.target.checked)} className="rounded" />
            显示释义
          </label>
        </div>

        <div className="flex justify-center pt-2">
          <AudioPlayer
            src={poem.audioUrl}
            onFallbackPlay={handleFallbackPlay}
            isFallbackSpeaking={isSpeaking}
          />
        </div>
      </div>
    </div>
  );
}
