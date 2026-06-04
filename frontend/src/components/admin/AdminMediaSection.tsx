import { Volume2 } from 'lucide-react';
import MediaPicker from './MediaPicker';

interface AdminMediaSectionProps {
  isNew: boolean;
  coverId: string | null;
  audioId: string | null;
  videoId: string | null;
  audioUrl: string | null;
  onCoverChange: (id: string | null) => void;
  onAudioChange: (id: string | null, url?: string) => void;
  onVideoChange: (id: string | null) => void;
  onGenerateAudio?: () => void;
  generating?: boolean;
}

export default function AdminMediaSection({
  isNew,
  coverId,
  audioId,
  videoId,
  audioUrl,
  onCoverChange,
  onAudioChange,
  onVideoChange,
  onGenerateAudio,
  generating,
}: AdminMediaSectionProps) {
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-4">
      <p className="text-sm font-medium text-slate-300">媒体绑定</p>
      <MediaPicker label="封面图" mediaType="IMAGE" value={coverId} onChange={(id) => onCoverChange(id)} />
      <MediaPicker label="朗读音频" mediaType="AUDIO" value={audioId} onChange={onAudioChange} />
      <MediaPicker label="讲解视频" mediaType="VIDEO" value={videoId} onChange={(id) => onVideoChange(id)} />

      {!isNew && onGenerateAudio && (
        <div className="pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onGenerateAudio}
            disabled={generating}
            className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 disabled:opacity-50"
          >
            <Volume2 size={16} />
            {generating ? '正在生成...' : '文字转音频（自动绑定）'}
          </button>
          <p className="text-xs text-slate-600 mt-1">需可访问外网；生成后自动写入媒体库并绑定音频</p>
        </div>
      )}
      {!audioId && audioUrl && (
        <p className="text-xs text-amber-400/80">提示：已有音频 URL 但未同步 ID，保存后刷新</p>
      )}
    </div>
  );
}
