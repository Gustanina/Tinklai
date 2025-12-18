import api from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  role: 'GUEST' | 'MEMBER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRoleDto {
  role: 'GUEST' | 'MEMBER' | 'ADMIN';
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<User[]>('/users');
    return response.data;
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },

  updateRole: async (id: number, role: 'GUEST' | 'MEMBER' | 'ADMIN'): Promise<User> => {
    const response = await api.patch<User>(`/users/${id}/role`, { role });
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

