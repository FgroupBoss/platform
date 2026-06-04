import { Link } from 'react-router-dom';
import type { Story } from '../types';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      to={`/stories/${story.id}`}
      className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/30 transition-colors"
    >
      <div className="flex items-center gap-2">
        <h3 className="text-base font-semibold text-white">{story.title}</h3>
        {story.storyType && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
            {story.storyType}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400 mt-2 line-clamp-2">
        {story.paragraphs[0]}
      </p>
      {story.audioUrl && (
        <span className="inline-block mt-2 text-xs text-amber-400/80">已有朗读音频</span>
      )}
    </Link>
  );
}
