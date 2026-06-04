import { api } from './client';
import type { HomeRecommend } from '../types';

export function fetchHomeRecommend() {
  return api.get<HomeRecommend>('/home/recommend');
}
