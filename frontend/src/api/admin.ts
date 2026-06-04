import { adminApi, api } from './client';
import type { MediaAsset, Poem, Story } from '../types';

export interface LoginResult {
  token: string;
  username: string;
}

export interface PoemSavePayload {
  title: string;
  author?: string;
  dynasty?: string;
  lines: string[];
  pinyin?: string[];
  translation?: string;
  difficulty?: string;
  tags?: string[];
  coverId?: number | null;
  audioId?: number | null;
  videoId?: number | null;
  status?: string;
  sortOrder?: number;
}

export interface StorySavePayload {
  title: string;
  storyType?: string;
  paragraphs: string[];
  ageMin?: number;
  coverId?: number | null;
  audioId?: number | null;
  videoId?: number | null;
  status?: string;
  sortOrder?: number;
}

export function adminLogin(username: string, password: string) {
  return api.post<LoginResult>('/admin/auth/login', { username, password });
}

export function fetchAdminPoems(page = 1, size = 20) {
  return adminApi.get<import('./client').PageResult<Poem>>(`/admin/poems?page=${page}&size=${size}`);
}

export function fetchAdminPoem(id: string) {
  return adminApi.get<Poem>(`/admin/poems/${id}`);
}

export function createPoem(data: PoemSavePayload) {
  return adminApi.post<Poem>('/admin/poems', data);
}

export function updatePoem(id: string, data: PoemSavePayload) {
  return adminApi.put<Poem>(`/admin/poems/${id}`, data);
}

export function deletePoem(id: string) {
  return adminApi.delete<void>(`/admin/poems/${id}`);
}

export function updatePoemStatus(id: string, status: string) {
  return adminApi.patch<Poem>(`/admin/poems/${id}/status`, { status });
}

export function generatePoemAudio(id: string, voice?: string, rate?: string) {
  return adminApi.post<Poem>(`/admin/poems/${id}/generate-audio`, { voice, rate });
}

export function bindPoemAudio(id: string, file: File) {
  return adminApi.upload<Poem>(`/admin/poems/${id}/bind-audio`, file);
}

export function fetchAdminStories(page = 1, size = 20) {
  return adminApi.get<import('./client').PageResult<Story>>(`/admin/stories?page=${page}&size=${size}`);
}

export function fetchAdminStory(id: string) {
  return adminApi.get<Story>(`/admin/stories/${id}`);
}

export function createStory(data: StorySavePayload) {
  return adminApi.post<Story>('/admin/stories', data);
}

export function updateStory(id: string, data: StorySavePayload) {
  return adminApi.put<Story>(`/admin/stories/${id}`, data);
}

export function deleteStory(id: string) {
  return adminApi.delete<void>(`/admin/stories/${id}`);
}

export function updateStoryStatus(id: string, status: string) {
  return adminApi.patch<Story>(`/admin/stories/${id}/status`, { status });
}

export function generateStoryAudio(id: string, voice?: string, rate?: string) {
  return adminApi.post<Story>(`/admin/stories/${id}/generate-audio`, { voice, rate });
}

export function bindStoryAudio(id: string, file: File) {
  return adminApi.upload<Story>(`/admin/stories/${id}/bind-audio`, file);
}

export function fetchAdminMedia(page = 1, size = 20, mediaType?: string) {
  const typeQuery = mediaType ? `&mediaType=${mediaType}` : '';
  return adminApi.get<import('./client').PageResult<MediaAsset>>(
    `/admin/media?page=${page}&size=${size}${typeQuery}`,
  );
}

export function uploadMedia(file: File) {
  return adminApi.upload<MediaAsset>('/admin/media/upload', file);
}

export function deleteMedia(id: string) {
  return adminApi.delete<void>(`/admin/media/${id}`);
}
