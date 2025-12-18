import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/projectService';
import type { Project } from '../services/projectService';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import { Plus, Edit, Trash2, FolderKanban, Calendar, ArrowRight } from 'lucide-react';
import './Projects.css';

export const Projects = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({ title: '' });

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
        console.warn('Invalid date:', dateString);
        return 'Invalid Date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch (error) {
      console.error('Date formatting error:', error, dateString);
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll(1, 100);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await projectService.update(editingProject.id, formData);
      } else {
        await projectService.create(formData);
      }
      setShowModal(false);
      setEditingProject(null);
      setFormData({ title: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await projectService.delete(id);
      fetchProjects();
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project. Only ADMIN can delete projects.');
    }
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({ title: '' });
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({ title: project.title });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="projects-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="content-section">
        <div className="page-header">
          <div>
            <h1>Projects</h1>
            <p>Manage your projects and organize your work</p>
          </div>
          {canCreate && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              <Plus />
              <span>New Project</span>
            </button>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban className="empty-icon" />
            <h3>No projects yet</h3>
            <p>Create your first project to get started</p>
            {canCreate && (
              <button className="btn btn-primary" onClick={openCreateModal}>
                <Plus />
                <span>Create Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <div key={project.id} className="project-card">
                <div className="project-header">
                  <FolderKanban className="project-icon" />
                  <div className="project-actions">
                    {canCreate && (
                      <button
                        className="icon-btn"
                        onClick={() => openEditModal(project)}
                        title="Edit project"
                      >
                        <Edit />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(project.id)}
                        title="Delete project"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                </div>
                <h3 
                  className="project-title clickable"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {project.title}
                </h3>
                <div className="project-meta">
                  <div className="meta-item">
                    <Calendar />
                    <span>
                      {formatDate(project.createdAt)}
                    </span>
                  </div>
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    title="View project details"
                  >
                    <span>View Details</span>
                    <ArrowRight />
                  </button>
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
          setEditingProject(null);
          setFormData({ title: '' });
        }}
        title={editingProject ? 'Edit Project' : 'Create New Project'}
        size="small"
      >
        <form onSubmit={handleSubmit} className="project-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Project Title
            </label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ title: e.target.value })}
              required
              placeholder="Enter project title"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowModal(false);
                setEditingProject(null);
                setFormData({ title: '' });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingProject ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

