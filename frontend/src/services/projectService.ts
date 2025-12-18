import api from './api';

export interface Project {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
}

export interface UpdateProjectDto {
  title: string;
}

export interface ListProjectsResponse {
  data: Project[];
  total: number;
  page: number;
  limit: number;
}

export const projectService = {
  getAll: async (page = 1, limit = 10): Promise<ListProjectsResponse> => {
    const response = await api.get<ListProjectsResponse>('/projects', {
      params: { page, limit },
    });
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: CreateProjectDto): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  update: async (id: number, data: UpdateProjectDto): Promise<Project> => {
    const response = await api.patch<Project>(`/projects/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

