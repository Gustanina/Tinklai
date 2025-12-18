import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { projectService } from '../services/projectService';
import { taskService } from '../services/taskService';
import { commentService } from '../services/commentService';
import { FolderKanban, CheckSquare, MessageSquare, TrendingUp } from 'lucide-react';
import { Modal } from '../components/Modal';
import './Dashboard.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    comments: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, tasksRes, commentsRes] = await Promise.all([
          projectService.getAll(1, 1),
          taskService.getAll(1, 1),
          commentService.getAll(1, 1),
        ]);

        const allTasks = await taskService.getAll(1, 100);
        const completedTasks = allTasks.data.filter((t) => t.status === 'DONE').length;

        setStats({
          projects: projectsRes.total,
          tasks: tasksRes.total,
          comments: commentsRes.total,
          completedTasks,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Show welcome modal for new users
    if (!localStorage.getItem('welcomeShown')) {
      setShowWelcomeModal(true);
      localStorage.setItem('welcomeShown', 'true');
    }
  }, []);

  const statCards = [
    {
      title: 'Projects',
      value: stats.projects,
      icon: FolderKanban,
      color: '#667eea',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      title: 'Tasks',
      value: stats.tasks,
      icon: CheckSquare,
      color: '#10b981',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    },
    {
      title: 'Comments',
      value: stats.comments,
      icon: MessageSquare,
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: TrendingUp,
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    },
  ];

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="content-section">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.username}!</h1>
          <p>Here's an overview of your projects and tasks</p>
        </div>

        <div className="stats-grid">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="stat-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="stat-icon" style={{ background: stat.gradient }}>
                  <Icon />
                </div>
                <div className="stat-content">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-title">{stat.title}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="dashboard-actions">
          <div className="action-card">
            <FolderKanban className="action-icon" />
            <h3>Manage Projects</h3>
            <p>Create and organize your projects</p>
            <a href="/projects" className="btn btn-primary">
              Go to Projects
            </a>
          </div>

          <div className="action-card">
            <CheckSquare className="action-icon" />
            <h3>View Tasks</h3>
            <p>Track and manage your tasks</p>
            <a href="/tasks" className="btn btn-primary">
              Go to Tasks
            </a>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showWelcomeModal}
        onClose={() => setShowWelcomeModal(false)}
        title="Welcome to Reader!"
        size="medium"
      >
        <div className="welcome-modal-content">
          <p>
            Welcome to Reader Project Management System! This platform helps you manage
            your projects, tasks, and comments efficiently.
          </p>
          <div className="welcome-features">
            <h4>Key Features:</h4>
            <ul>
              <li>Create and manage multiple projects</li>
              <li>Organize tasks with different statuses</li>
              <li>Add comments to tasks</li>
              <li>Track your progress with statistics</li>
            </ul>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowWelcomeModal(false)}
          >
            Get Started
          </button>
        </div>
      </Modal>
    </div>
  );
};

