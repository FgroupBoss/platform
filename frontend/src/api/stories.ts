import { api } from './client';
import type { Story } from '../types';

export function fetchStories(params?: { storyType?: string }) {
  const query = new URLSearchParams();
  if (params?.storyType) query.set('storyType', params.storyType);
  const qs = query.toString();
  return api.get<Story[]>(`/stories${qs ? `?${qs}` : ''}`);
}

export function fetchStoryDetail(id: string) {
  return api.get<Story>(`/stories/${id}`);
}
