import { Link } from 'react-router-dom';
import type { Poem } from '../types';

interface PoemCardProps {
  poem: Poem;
}

export default function PoemCard({ poem }: PoemCardProps) {
  return (
    <Link
      to={`/poems/${poem.id}`}
      className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-emerald-500/30 transition-colors"
    >
      <h3 className="text-base font-semibold text-white">{poem.title}</h3>
      <p className="text-sm text-slate-500 mt-1">
        {poem.author} · {poem.dynasty}
      </p>
      <p className="text-sm text-slate-400 mt-2 line-clamp-2">
        {poem.lines.join(' ')}
      </p>
      {poem.audioUrl && (
        <span className="inline-block mt-2 text-xs text-emerald-400/80">已有朗读音频</span>
      )}
    </Link>
  );
}
