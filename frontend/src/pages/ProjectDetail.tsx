import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, Project } from '../services/projectService';
import { taskService, Task } from '../services/taskService';
import { commentService, Comment } from '../services/commentService';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  CheckSquare,
  MessageSquare,
  FolderKanban,
  Calendar,
  Loader,
} from 'lucide-react';
import './ProjectDetail.css';

export const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Form data
  const [projectFormData, setProjectFormData] = useState({ title: '' });
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    status: 'TODO' as 'TODO' | 'IN_PROGRESS' | 'DONE',
  });
  const [commentFormData, setCommentFormData] = useState({ content: '' });

  const canEdit = user?.role === 'MEMBER' || user?.role === 'ADMIN';
  const canDelete = user?.role === 'ADMIN';

  const formatDate = (dateString: string | Date | undefined | null): string => {
    if (!dateString) return 'No date';
    try {
      let date: Date;
      if (typeof dateString === 'string') {
        // Try parsing as ISO string first
        date = new Date(dateString);
        // If that fails, try other formats
        if (isNaN(date.getTime())) {
          // Try parsing as timestamp
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
    if (id) {
      fetchProject();
      fetchTasks();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      const projectData = await projectService.getById(Number(id));
      setProject(projectData);
      setProjectFormData({ title: projectData.title });
    } catch (error) {
      console.error('Failed to fetch project:', error);
      alert('Project not found');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll(1, 100, Number(id));
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchComments = async (taskId: number) => {
    try {
      const response = await commentService.getAll(1, 100, taskId);
      setComments((prev) => ({ ...prev, [taskId]: response.data }));
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const toggleTask = (taskId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
      if (!comments[taskId]) {
        fetchComments(taskId);
      }
    }
    setExpandedTasks(newExpanded);
  };

  // Project handlers
  const handleProjectUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      await projectService.update(project.id, projectFormData);
      setShowProjectModal(false);
      fetchProject();
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project');
    }
  };

  const handleProjectDelete = async () => {
    if (!project) return;
    if (!confirm(`Are you sure you want to delete project "${project.title}"?`)) return;
    try {
      await projectService.delete(project.id);
      navigate('/projects');
    } catch (error) {
      console.error('Failed to delete project:', error);
      alert('Failed to delete project');
    }
  };

  // Task handlers
  const openTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTaskFormData({ title: task.title, status: task.status });
    } else {
      setEditingTask(null);
      setTaskFormData({ title: '', status: 'TODO' });
    }
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;
    try {
      if (editingTask) {
        await taskService.update(editingTask.id, {
          ...taskFormData,
          projectId: project.id,
        });
      } else {
        await taskService.create({
          ...taskFormData,
          projectId: project.id,
        });
      }
      setShowTaskModal(false);
      setEditingTask(null);
      setTaskFormData({ title: '', status: 'TODO' });
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task:', error);
      alert('Failed to save task');
    }
  };

  const handleTaskDelete = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskService.delete(taskId);
      fetchTasks();
      // Remove comments for deleted task
      setComments((prev) => {
        const newComments = { ...prev };
        delete newComments[taskId];
        return newComments;
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      alert('Failed to delete task');
    }
  };

  // Comment handlers
  const openCommentModal = (taskId: number, comment?: Comment) => {
    setSelectedTaskId(taskId);
    if (comment) {
      setEditingComment(comment);
      setCommentFormData({ content: comment.content });
    } else {
      setEditingComment(null);
      setCommentFormData({ content: '' });
    }
    setShowCommentModal(true);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) return;
    try {
      if (editingComment) {
        await commentService.update(editingComment.id, commentFormData);
      } else {
        await commentService.create({
          ...commentFormData,
          taskId: selectedTaskId,
        });
      }
      setShowCommentModal(false);
      setEditingComment(null);
      setCommentFormData({ content: '' });
      setSelectedTaskId(null);
      if (selectedTaskId) {
        fetchComments(selectedTaskId);
      }
    } catch (error) {
      console.error('Failed to save comment:', error);
      alert('Failed to save comment');
    }
  };

  const handleCommentDelete = async (taskId: number, commentId: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.delete(commentId);
      fetchComments(taskId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment');
    }
  };

  if (loading) {
    return (
      <div className="project-detail-loading">
        <Loader className="spinner" />
        <p>Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return null;
  }

  return (
    <div className="project-detail-page">
      <div className="content-section">
        {/* Header */}
        <div className="project-header">
          <button className="back-btn" onClick={() => navigate('/projects')}>
            <ArrowLeft />
            <span>Back to Projects</span>
          </button>
          <div className="project-title-section">
            <div className="project-title-group">
              <FolderKanban className="project-icon" />
              <div>
                <h1>{project.title}</h1>
                <div className="project-meta">
                  <Calendar className="meta-icon" />
                  <span>Created {formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="project-actions">
              {canEdit && (
                <button className="btn btn-secondary" onClick={() => setShowProjectModal(true)}>
                  <Edit />
                  <span>Edit Project</span>
                </button>
              )}
              {canDelete && (
                <button className="btn btn-danger" onClick={handleProjectDelete}>
                  <Trash2 />
                  <span>Delete Project</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="tasks-section">
          <div className="section-header">
            <h2>
              <CheckSquare className="section-icon" />
              Tasks ({tasks.length})
            </h2>
            {canEdit && (
              <button className="btn btn-primary" onClick={() => openTaskModal()}>
                <Plus />
                <span>Add Task</span>
              </button>
            )}
          </div>

          {tasks.length === 0 ? (
            <div className="empty-state">
              <CheckSquare className="empty-icon" />
              <p>No tasks yet. Create your first task!</p>
              {canEdit && (
                <button className="btn btn-primary" onClick={() => openTaskModal()}>
                  <Plus />
                  <span>Create Task</span>
                </button>
              )}
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <div className="task-main">
                      <button
                        className="task-expand-btn"
                        onClick={() => toggleTask(task.id)}
                      >
                        <CheckSquare className="task-icon" />
                        <div className="task-info">
                          <h3>{task.title}</h3>
                          <div className="task-meta">
                            <span className={`status-badge ${task.status.toLowerCase()}`}>
                              {task.status}
                            </span>
                            <span className="comment-count">
                              {comments[task.id]?.length || 0} comments
                            </span>
                          </div>
                        </div>
                      </button>
                    </div>
                    <div className="task-actions">
                      {canEdit && (
                        <button
                          className="icon-btn"
                          onClick={() => openTaskModal(task)}
                          title="Edit task"
                        >
                          <Edit />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="icon-btn danger"
                          onClick={() => handleTaskDelete(task.id)}
                          title="Delete task"
                        >
                          <Trash2 />
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedTasks.has(task.id) && (
                    <div className="task-comments">
                      <div className="comments-header">
                        <h4>
                          <MessageSquare className="comments-icon" />
                          Comments
                        </h4>
                        {canEdit && (
                          <button
                            className="btn btn-small"
                            onClick={() => openCommentModal(task.id)}
                          >
                            <Plus />
                            <span>Add Comment</span>
                          </button>
                        )}
                      </div>

                      {comments[task.id] ? (
                        comments[task.id].length === 0 ? (
                          <div className="empty-comments">
                            <p>No comments yet. Be the first to comment!</p>
                          </div>
                        ) : (
                          <div className="comments-list">
                            {comments[task.id].map((comment) => (
                              <div key={comment.id} className="comment-card">
                                <p>{comment.content}</p>
                                <div className="comment-footer">
                                  <span className="comment-date">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                  <div className="comment-actions">
                                    {canEdit && (
                                      <button
                                        className="icon-btn-small"
                                        onClick={() => openCommentModal(task.id, comment)}
                                        title="Edit comment"
                                      >
                                        <Edit />
                                      </button>
                                    )}
                                    {canDelete && (
                                      <button
                                        className="icon-btn-small danger"
                                        onClick={() => handleCommentDelete(task.id, comment.id)}
                                        title="Delete comment"
                                      >
                                        <Trash2 />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      ) : (
                        <div className="loading-comments">
                          <Loader className="small-spinner" />
                          <span>Loading comments...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Edit Modal */}
      <Modal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setProjectFormData({ title: project.title });
        }}
        title="Edit Project"
        size="small"
      >
        <form onSubmit={handleProjectUpdate} className="form">
          <div className="form-group">
            <label htmlFor="project-title" className="form-label">
              Project Title
            </label>
            <input
              type="text"
              id="project-title"
              className="form-input"
              value={projectFormData.title}
              onChange={(e) => setProjectFormData({ title: e.target.value })}
              required
              placeholder="Enter project title"
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowProjectModal(false);
                setProjectFormData({ title: project.title });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Modal */}
      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
          setTaskFormData({ title: '', status: 'TODO' });
        }}
        title={editingTask ? 'Edit Task' : 'Create Task'}
        size="small"
      >
        <form onSubmit={handleTaskSubmit} className="form">
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">
              Task Title
            </label>
            <input
              type="text"
              id="task-title"
              className="form-input"
              value={taskFormData.title}
              onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
              required
              placeholder="Enter task title"
            />
          </div>
          <div className="form-group">
            <label htmlFor="task-status" className="form-label">
              Status
            </label>
            <select
              id="task-status"
              className="form-select"
              value={taskFormData.status}
              onChange={(e) =>
                setTaskFormData({
                  ...taskFormData,
                  status: e.target.value as 'TODO' | 'IN_PROGRESS' | 'DONE',
                })
              }
            >
              <option value="TODO">TODO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="DONE">DONE</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowTaskModal(false);
                setEditingTask(null);
                setTaskFormData({ title: '', status: 'TODO' });
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

      {/* Comment Modal */}
      <Modal
        isOpen={showCommentModal}
        onClose={() => {
          setShowCommentModal(false);
          setEditingComment(null);
          setCommentFormData({ content: '' });
          setSelectedTaskId(null);
        }}
        title={editingComment ? 'Edit Comment' : 'Add Comment'}
        size="small"
      >
        <form onSubmit={handleCommentSubmit} className="form">
          <div className="form-group">
            <label htmlFor="comment-content" className="form-label">
              Comment
            </label>
            <textarea
              id="comment-content"
              className="form-textarea"
              value={commentFormData.content}
              onChange={(e) => setCommentFormData({ content: e.target.value })}
              required
              placeholder="Enter your comment"
              rows={4}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowCommentModal(false);
                setEditingComment(null);
                setCommentFormData({ content: '' });
                setSelectedTaskId(null);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingComment ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

