import type { MediaType } from '../../types';
import { fetchAdminMedia } from '../../api/admin';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface MediaPickerProps {
  label: string;
  mediaType: MediaType;
  value: string | null;
  onChange: (mediaId: string | null, previewUrl?: string) => void;
}

export default function MediaPicker({ label, mediaType, value, onChange }: MediaPickerProps) {
  const [options, setOptions] = useState<{ id: string; fileName: string; url?: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMedia(1, 100, mediaType)
      .then((res) => setOptions(res.records.map((m) => ({ id: m.id, fileName: m.fileName, url: m.url }))))
      .finally(() => setLoading(false));
  }, [mediaType]);

  const selected = options.find((o) => o.id === value);

  return (
    <div className="space-y-2">
      <label className="block text-sm text-slate-400">{label}</label>
      <div className="flex gap-2">
        <select
          value={value || ''}
          onChange={(e) => {
            const id = e.target.value || null;
            const item = options.find((o) => o.id === id);
            onChange(id, item?.url);
          }}
          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-violet-500/50"
        >
          <option value="">未绑定</option>
          {options.map((o) => (
            <option key={o.id} value={o.id}>{o.fileName}</option>
          ))}
        </select>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="px-3 py-2 text-sm text-slate-400 hover:text-red-400 border border-white/10 rounded-lg"
          >
            清除
          </button>
        )}
      </div>
      {loading && <p className="text-xs text-slate-600">加载媒体列表...</p>}
      {!loading && options.length === 0 && (
        <p className="text-xs text-slate-600">
          暂无{mediaType === 'IMAGE' ? '图片' : mediaType === 'AUDIO' ? '音频' : '视频'}，
          请先到 <Link to="/admin/media" className="text-violet-400 hover:underline">媒体库</Link> 上传
        </p>
      )}
      {selected?.url && mediaType === 'IMAGE' && (
        <img src={selected.url} alt="" className="h-20 rounded-lg object-cover" />
      )}
      {selected?.url && mediaType === 'AUDIO' && (
        <audio controls src={selected.url} className="w-full h-8" />
      )}
      {selected?.url && mediaType === 'VIDEO' && (
        <video controls src={selected.url} className="w-full max-h-40 rounded-lg" />
      )}
    </div>
  );
}
