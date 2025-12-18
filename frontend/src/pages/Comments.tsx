import { useEffect, useState } from 'react';
import { commentService, Comment } from '../services/commentService';
import { taskService, Task } from '../services/taskService';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/Modal';
import { Plus, Edit, Trash2, MessageSquare, Calendar, CheckSquare } from 'lucide-react';
import './Comments.css';

export const Comments = () => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [formData, setFormData] = useState({
    content: '',
    taskId: 0,
  });
  const [filterTaskId, setFilterTaskId] = useState<number | undefined>();

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

  const getTaskTitle = (taskId: number): string => {
    if (!taskId) return 'No Task';
    const task = tasks.find((t) => t.id === taskId);
    if (!task && tasks.length > 0) {
      // Tasks are loaded but this one doesn't match - might be a sync issue
      console.warn('Task not found for comment:', taskId, 'Available tasks:', tasks.map(t => t.id));
    }
    return task?.title || 'Unknown Task';
  };

  useEffect(() => {
    fetchTasks();
    fetchComments();
  }, [filterTaskId]);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAll(1, 100);
      setTasks(response.data);
      if (response.data.length > 0 && !formData.taskId) {
        setFormData((prev) => ({ ...prev, taskId: response.data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await commentService.getAll(1, 100, filterTaskId);
      setComments(response.data);
      // Ensure tasks are loaded if not already
      if (tasks.length === 0) {
        await fetchTasks();
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingComment) {
        await commentService.update(editingComment.id, { content: formData.content });
      } else {
        await commentService.create(formData);
      }
      setShowModal(false);
      setEditingComment(null);
      setFormData({ content: '', taskId: tasks[0]?.id || 0 });
      fetchComments();
    } catch (error) {
      console.error('Failed to save comment:', error);
      alert('Failed to save comment. Please try again.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.delete(id);
      fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment. Only ADMIN can delete comments.');
    }
  };

  if (loading) {
    return (
      <div className="comments-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="comments-page">
      <div className="content-section">
        <div className="page-header">
          <div>
            <h1>Comments</h1>
            <p>View and manage comments on tasks</p>
          </div>
          {canCreate && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus />
              <span>New Comment</span>
            </button>
          )}
        </div>

        <div className="comments-filters">
          <div className="form-group">
            <label htmlFor="taskFilter" className="form-label">
              Filter by Task
            </label>
            <select
              id="taskFilter"
              className="form-select"
              value={filterTaskId || ''}
              onChange={(e) =>
                setFilterTaskId(e.target.value ? Number(e.target.value) : undefined)
              }
            >
              <option value="">All Tasks</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {comments.length === 0 ? (
          <div className="empty-state">
            <MessageSquare className="empty-icon" />
            <h3>No comments yet</h3>
            <p>Create your first comment to get started</p>
            {canCreate && (
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                <Plus />
                <span>Create Comment</span>
              </button>
            )}
          </div>
        ) : (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="comment-header">
                  <MessageSquare className="comment-icon" />
                  <div className="comment-actions">
                    {canCreate && (
                      <button
                        className="icon-btn"
                        onClick={() => {
                          setEditingComment(comment);
                          setFormData({
                            content: comment.content,
                            taskId: comment.taskId,
                          });
                          setShowModal(true);
                        }}
                        title="Edit comment"
                      >
                        <Edit />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="icon-btn danger"
                        onClick={() => handleDelete(comment.id)}
                        title="Delete comment"
                      >
                        <Trash2 />
                      </button>
                    )}
                  </div>
                </div>
                <p className="comment-content">{comment.content}</p>
                <div className="comment-meta">
                  <div className="meta-item">
                    <CheckSquare />
                    <span>
                      {getTaskTitle(comment.taskId)}
                    </span>
                  </div>
                  <div className="meta-item">
                    <Calendar />
                    <span>{formatDate(comment.createdAt)}</span>
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
          setEditingComment(null);
          setFormData({ content: '', taskId: tasks[0]?.id || 0 });
        }}
        title={editingComment ? 'Edit Comment' : 'Create New Comment'}
        size="medium"
      >
        <form onSubmit={handleSubmit} className="comment-form">
          <div className="form-group">
            <label htmlFor="taskId" className="form-label">
              Task
            </label>
            <select
              id="taskId"
              className="form-select"
              value={formData.taskId}
              onChange={(e) =>
                setFormData({ ...formData, taskId: Number(e.target.value) })
              }
              required
            >
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="content" className="form-label">
              Comment
            </label>
            <textarea
              id="content"
              className="form-textarea"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              placeholder="Enter your comment"
              rows={5}
            />
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setShowModal(false);
                setEditingComment(null);
                setFormData({ content: '', taskId: tasks[0]?.id || 0 });
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingComment ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

