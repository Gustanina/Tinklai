import api from './api';

export interface Task {
  id: number;
  title: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId: number;
}

export interface UpdateTaskDto {
  title?: string;
  status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
  projectId?: number;
}

export interface ListTasksResponse {
  data: Task[];
  total: number;
  page: number;
  limit: number;
}

export const taskService = {
  getAll: async (page = 1, limit = 10, projectId?: number): Promise<ListTasksResponse> => {
    const response = await api.get<ListTasksResponse>('/tasks', {
      params: { page, limit, projectId },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Task> => {
    const response = await api.get<Task>(`/tasks/${id}`);
    return response.data;
  },

  create: async (data: CreateTaskDto): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTaskDto): Promise<Task> => {
    const response = await api.patch<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};

