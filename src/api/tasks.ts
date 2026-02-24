import { api } from './client';
import type { Task, TaskCreate, TaskUpdate } from '../types/task';

export interface GetTasksParams {
  column?: string;
  _page?: number;
  _limit?: number;
}

export async function getTasks(params?: GetTasksParams): Promise<Task[]> {
  const search = new URLSearchParams();
  if (params?.column) search.set('column', params.column);
  if (params?._page != null) search.set('_page', String(params._page));
  if (params?._limit != null) search.set('_limit', String(params._limit));
  const qs = search.toString();
  return api.get<Task[]>(`/tasks${qs ? `?${qs}` : ''}`);
}

export async function getTask(id: number): Promise<Task> {
  return api.get<Task>(`/tasks/${id}`);
}

export async function createTask(task: TaskCreate): Promise<Task> {
  return api.post<Task>('/tasks', task);
}

export async function updateTask(id: number, patch: TaskUpdate): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}`, patch);
}

export async function deleteTask(id: number): Promise<void> {
  return api.delete(`/tasks/${id}`);
}
