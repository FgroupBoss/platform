import { useRef, useState } from 'react';
import { Upload, Volume2 } from 'lucide-react';
import { bindPoemAudio, bindStoryAudio, generatePoemAudio, generateStoryAudio } from '../../api/admin';
import { ApiError } from '../../api/client';

interface ListAudioActionsProps {
  contentId: string;
  contentType: 'poem' | 'story';
  hasAudio: boolean;
  onDone: (message: string) => void;
}

export default function ListAudioActions({ contentId, contentType, hasAudio, onDone }: ListAudioActionsProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleUploadBind = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      if (contentType === 'poem') {
        await bindPoemAudio(contentId, file);
      } else {
        await bindStoryAudio(contentId, file);
      }
      onDone('上传并绑定成功');
    } catch (err) {
      onDone(err instanceof ApiError ? err.message : '上传绑定失败');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleTts = async () => {
    setBusy(true);
    try {
      if (contentType === 'poem') {
        await generatePoemAudio(contentId);
      } else {
        await generateStoryAudio(contentId);
      }
      onDone('TTS 生成并绑定成功');
    } catch (err) {
      onDone(err instanceof ApiError ? err.message : 'TTS 生成失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      <input
        ref={fileRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav"
        className="hidden"
        onChange={handleUploadBind}
        disabled={busy}
      />
      <button
        type="button"
        title="上传音频并绑定"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        className="p-1 text-slate-400 hover:text-emerald-400 disabled:opacity-40"
      >
        <Upload size={16} />
      </button>
      <button
        type="button"
        title="文字转音频"
        disabled={busy}
        onClick={handleTts}
        className="p-1 text-slate-400 hover:text-violet-400 disabled:opacity-40"
      >
        <Volume2 size={16} />
      </button>
      {hasAudio && <span className="text-xs text-emerald-400/80 ml-1">有</span>}
      {busy && <span className="text-xs text-slate-500 ml-1">...</span>}
    </div>
  );
}
