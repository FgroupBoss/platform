import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

interface AudioPlayerProps {
  src?: string | null;
  onFallbackPlay?: () => void;
  fallbackLabel?: string;
  isFallbackSpeaking?: boolean;
}

export default function AudioPlayer({
  src,
  onFallbackPlay,
  fallbackLabel = '浏览器朗读',
  isFallbackSpeaking,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setPlaying(false);
  }, [src]);

  const toggle = () => {
    if (src && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      return;
    }
    onFallbackPlay?.();
  };

  const active = src ? playing : isFallbackSpeaking;

  return (
    <div className="flex items-center gap-3">
      {src && <audio ref={audioRef} src={src} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} />}
      <button
        type="button"
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 hover:bg-emerald-500/25 transition-colors"
      >
        {active ? <Pause size={18} /> : <Play size={18} />}
        <span className="text-sm font-medium">{src ? (playing ? '暂停' : '播放') : fallbackLabel}</span>
      </button>
      {!src && (
        <span className="text-xs text-slate-500">无预录音频，使用浏览器朗读</span>
      )}
    </div>
  );
}
