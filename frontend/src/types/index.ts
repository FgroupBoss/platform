export type MediaType = 'AUDIO' | 'VIDEO' | 'IMAGE';
export type ContentStatus = 'draft' | 'published';

export interface MediaAsset {
  id: string;
  fileName: string;
  mediaType: MediaType;
  mimeType?: string;
  fileSize?: number;
  durationSec?: number;
  url?: string;
  referenceCount?: number;
}

export interface Poem {
  id: string;
  title: string;
  author: string;
  dynasty: string;
  lines: string[];
  pinyin?: string[];
  translation?: string;
  difficulty?: 'easy' | 'medium';
  tags?: string[];
  coverUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  coverId?: string;
  audioId?: string;
  videoId?: string;
  status: ContentStatus;
  sortOrder: number;
}

export interface Story {
  id: string;
  title: string;
  storyType: '童话' | '寓言' | '成语' | '原创';
  paragraphs: string[];
  ageMin: number;
  coverUrl?: string;
  audioUrl?: string;
  videoUrl?: string;
  coverId?: string;
  audioId?: string;
  videoId?: string;
  status: ContentStatus;
  sortOrder: number;
}

export interface HomeRecommend {
  poem: Poem | null;
  story: Story | null;
}
