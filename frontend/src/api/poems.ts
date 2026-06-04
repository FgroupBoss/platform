import { api } from './client';
import type { Poem } from '../types';

export function fetchPoems(params?: { dynasty?: string; difficulty?: string }) {
  const query = new URLSearchParams();
  if (params?.dynasty) query.set('dynasty', params.dynasty);
  if (params?.difficulty) query.set('difficulty', params.difficulty);
  const qs = query.toString();
  return api.get<Poem[]>(`/poems${qs ? `?${qs}` : ''}`);
}

export function fetchPoemDetail(id: string) {
  return api.get<Poem>(`/poems/${id}`);
}
