import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { fetchStoryDetail } from '../api/stories';
import AudioPlayer from '../components/AudioPlayer';
import { useSpeech } from '../hooks/useSpeech';
import { ApiError } from '../api/client';
import type { Story } from '../types';

export default function StoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const { speak, cancel, isSpeaking } = useSpeech();

  useEffect(() => {
    if (!id) return;
    fetchStoryDetail(id)
      .then(setStory)
      .catch((e: unknown) => setError(e instanceof ApiError ? e.message : '加载失败'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => () => cancel(), [cancel]);

  const handleFallbackPlay = () => {
    if (!story) return;
    if (isSpeaking) {
      cancel();
      return;
    }
    const fullText = [story.title, ...story.paragraphs].join('。');
    speak(fullText);
  };

  if (loading) return <p className="text-slate-500">加载中...</p>;
  if (error || !story) return <p className="text-red-400">{error || '故事不存在'}</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to="/stories" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-300">
        <ArrowLeft size={16} /> 返回列表
      </Link>

      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{story.title}</h1>
          {story.storyType && (
            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
              {story.storyType}
            </span>
          )}
        </div>

        <div className="flex justify-start">
          <AudioPlayer
            src={story.audioUrl}
            onFallbackPlay={handleFallbackPlay}
            isFallbackSpeaking={isSpeaking}
          />
        </div>

        <div className="space-y-4 pt-2">
          {story.paragraphs.map((para, i) => (
            <p
              key={i}
              className={`text-base leading-relaxed ${
                i === activeIndex ? 'text-white' : 'text-slate-400'
              }`}
              onClick={() => setActiveIndex(i)}
            >
              {para}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
