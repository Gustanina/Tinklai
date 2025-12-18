import { useEffect, useState } from 'react';
import { taskService, Task } from '../services/taskService';
import { projectService, Project } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import { Plus, Edit, Trash2, CheckSquare, Calendar, FolderKanban } from 'lucide-react';
import './Tasks.css';

export const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    status: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'DONE',
    projectId: 0,
  });
  const [filterProjectId, setFilterProjectId] = useState<number | undefined>();

  const canCreate = user?.role === 'MEMBER' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';

  const formatDate = (dateString: string | Date | undefined | null): string => {
    if (!dateString) return 'No date';
    try {
      let date: Date;
      if (typeof dateString === 'string') {
        date = new Date(dateString);
        if (isNaN(date.getTime())) {
          const timestamp = parseInt(dateString, 10);
          if (!isNaN(timestamp)) {
            date = new Date(timestamp);
          }
        }
      } else {
        date = dateString;
      }
      
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const getProjectTitle = (projectId: number): string => {
    if (!projectId) return 'No Project';
    const project = projects.find((p) => p.id === projectId);
    if (!project && projects.length > 0) {
      // Projects are loaded but this one doesn't match - might be a sync issue
      console.warn('Project not found for task:', projectId, 'Available projects:', projects.map(p => p.id));
    }
    return project?.title || 'Unknown Project';
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [filterProjectId]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll(1, 100);
      setProjects(response.data);
      if (response.data.length > 0 && !formData.projectId) {
        setFormData((prev) => ({ ...prev, projectId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll(1, 100, filterProjectId);
      setTasks(response.data);
      // Ensure projects are loaded if not already
      if (projects.length === 0) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, formData);
      } else {
        await taskService.create(formData);
      }
      setShowModal(false);
      setEditingTask(null);
      setFormData({ title: '', status: 'TODO', projectId: projects[0]?.id || 0 });
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.delete(id);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task. Only ADMIN can delete tasks.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'TODO':
        return '#f59e0b';
      case 'IN_PROGRESS':
        return '#3b82f6';
      case 'DONE':
        return '#10b981';
      default:
        return '#718096';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ');
  };

  if (loading) {
    return (
      <div className="tasks-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="content-section">
        <div className="page-header">
          <div>
            <h1>Tasks</h1>
            <p>Manage and track your tasks</p>
          </div>
          {canCreate && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus />
              <span>New Task</span>
            </button>
          )}
        </div>

        <div className="tasks-filters">
          <div className="form-group">
            <label htmlFor="projectFilter" className="form-label">
              Filter by Project
            </label>
            <select
              id="projectFilter"
              className="form-select"
              value={filterProjectId || ''}
              onChange={(e) =>
                setFilterProjectId(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">All Projects</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="empty-state">
            <CheckSquare className="empty-icon" />
            <h3>No tasks yet</h3>
            <p>Create your first task to get started</p>
            {canCreate && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus />
                <span>Create Task</span>
              </button>
            )}
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <CheckSquare className="task-icon" />
                  <div className="task-actions">
                    {canCreate && (
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setEditingTask(task);
                          setFormData({
                            title: task.title,
                            status: task.status,
                            projectId: task.projectId,
                          });
                          setShowModal(true);
                        }}
                        title="Edit task"
                      >
                        <Edit />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(task.id)}
                        title="Delete task"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="task-title">{task.title}</h3>
                <div className="task-meta">
                  <div className="task-status" style={{ color: getStatusColor(task.status) }}>
                    <span className="status-dot" style={{ background: getStatusColor(task.status) }}></span>
                    {getStatusLabel(task.status)}
                  </div>
                  <div className="meta-item">
                    <FolderKanban />
                    <span>
                      {getProjectTitle(task.projectId)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <Calendar />
                    <span>{formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingTask(null);
          setFormData({ title: '', status: 'TODO', projectId: projects[0]?.id || 0 });
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Task Title
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter task title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="status" className="form-label">
              Status
            </label>
            <select
              id="status"
              className="form-select"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              required
            >
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="projectId" className="form-label">
              Project
            </label>
            <select
              id="projectId"
              className="form-select"
              value={formData.projectId}
              onChange={(e) =>
                setFormData({ ...formData, projectId: Number(e.target.value) })
              }
              required
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowModal(false);
                setEditingTask(null);
                setFormData({ title: '', status: 'TODO', projectId: projects[0]?.id || 0 });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTask ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

