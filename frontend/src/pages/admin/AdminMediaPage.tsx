import { useEffect, useRef, useState } from 'react';
import { Trash2, Upload } from 'lucide-react';
import { deleteMedia, fetchAdminMedia, uploadMedia } from '../../api/admin';
import { ApiError } from '../../api/client';
import type { MediaAsset } from '../../types';

export default function AdminMediaPage() {
  const [mediaList, setMediaList] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => {
    setLoading(true);
    fetchAdminMedia(1, 50)
      .then((res) => setMediaList(res.records))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    try {
      await uploadMedia(file);
      setMessage('上传成功');
      load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : '上传失败');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该媒体文件？')) return;
    try {
      await deleteMedia(id);
      load();
    } catch (err) {
      setMessage(err instanceof ApiError ? err.message : '删除失败');
    }
  };

  const formatSize = (size?: number) => {
    if (!size) return '-';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">媒体库</h1>
        <label className="flex items-center gap-1 px-3 py-2 rounded-lg bg-violet-500 text-white text-sm cursor-pointer">
          <Upload size={16} />
          {uploading ? '上传中...' : '上传文件'}
          <input ref={fileRef} type="file" accept="audio/*,video/*,image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      <p className="text-xs text-slate-500">支持 MP3/M4A/WAV、MP4/WebM、JPG/PNG/WebP</p>
      {message && <p className="text-sm text-amber-400">{message}</p>}

      {loading ? (
        <p className="text-slate-500">加载中...</p>
      ) : (
        <div className="rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-slate-400">
              <tr>
                <th className="text-left p-3">文件名</th>
                <th className="text-left p-3">类型</th>
                <th className="text-left p-3">大小</th>
                <th className="text-left p-3">引用</th>
                <th className="text-right p-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {mediaList.map((m) => (
                <tr key={m.id} className="border-t border-white/5">
                  <td className="p-3 text-white">{m.fileName}</td>
                  <td className="p-3 text-slate-400">{m.mediaType}</td>
                  <td className="p-3 text-slate-400">{formatSize(m.fileSize)}</td>
                  <td className="p-3 text-slate-500">{m.referenceCount ?? '-'}</td>
                  <td className="p-3 text-right space-x-2">
                    {m.url && m.mediaType === 'AUDIO' && (
                      <audio controls src={m.url} className="inline-block h-8 align-middle" />
                    )}
                    <button type="button" onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 inline-flex ml-2">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {mediaList.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-center text-slate-500">暂无媒体文件</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
