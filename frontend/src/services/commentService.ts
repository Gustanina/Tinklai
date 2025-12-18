import api from './api';

export interface Comment {
  id: number;
  content: string;
  taskId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentDto {
  content: string;
  taskId: number;
}

export interface UpdateCommentDto {
  content: string;
}

export interface ListCommentsResponse {
  data: Comment[];
  total: number;
  page: number;
  limit: number;
}

export const commentService = {
  getAll: async (page = 1, limit = 10, taskId?: number): Promise<ListCommentsResponse> => {
    const response = await api.get<ListCommentsResponse>('/comments', {
      params: { page, limit, taskId },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Comment> => {
    const response = await api.get<Comment>(`/comments/${id}`);
    return response.data;
  },

  create: async (data: CreateCommentDto): Promise<Comment> => {
    const response = await api.post<Comment>('/comments', data);
    return response.data;
  },

  update: async (id: number, data: UpdateCommentDto): Promise<Comment> => {
    const response = await api.patch<Comment>(`/comments/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};

