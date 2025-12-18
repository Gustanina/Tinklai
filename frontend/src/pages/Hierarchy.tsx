import { useEffect, useState } from 'react';
import { projectService, Project } from '../services/projectService';
import { taskService, Task } from '../services/taskService';
import { commentService, Comment } from '../services/commentService';
import { FolderKanban, CheckSquare, MessageSquare, ChevronRight, Loader } from 'lucide-react';
import './Hierarchy.css';

interface ProjectWithTasks extends Project {
  tasks?: TaskWithComments[];
}

interface TaskWithComments extends Task {
  comments?: Comment[];
}

export const Hierarchy = () => {
  const [projects, setProjects] = useState<ProjectWithTasks[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProjects, setExpandedProjects] = useState<Set<number>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<number>>(new Set());
  const [loadingTasks, setLoadingTasks] = useState<Set<number>>(new Set());
  const [loadingComments, setLoadingComments] = useState<Set<number>>(new Set());

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

  const toggleProject = async (projectId: number) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
      // Remove tasks when collapsing
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? { ...p, tasks: undefined } : p))
      );
    } else {
      newExpanded.add(projectId);
      // Load tasks when expanding
      await loadTasksForProject(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const loadTasksForProject = async (projectId: number) => {
    setLoadingTasks((prev) => new Set(prev).add(projectId));
    try {
      const response = await taskService.getAll(1, 100, projectId);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, tasks: response.data } : p
        )
      );
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoadingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(projectId);
        return newSet;
      });
    }
  };

  const toggleTask = async (taskId: number, projectId: number) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
      // Remove comments when collapsing
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks?.map((t) =>
                  t.id === taskId ? { ...t, comments: undefined } : t
                ),
              }
            : p
        )
      );
    } else {
      newExpanded.add(taskId);
      // Load comments when expanding
      await loadCommentsForTask(taskId, projectId);
    }
    setExpandedTasks(newExpanded);
  };

  const loadCommentsForTask = async (taskId: number, projectId: number) => {
    setLoadingComments((prev) => new Set(prev).add(taskId));
    try {
      const response = await commentService.getAll(1, 100, taskId);
      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId
            ? {
                ...p,
                tasks: p.tasks?.map((t) =>
                  t.id === taskId ? { ...t, comments: response.data } : t
                ),
              }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="hierarchy-loading">
        <Loader className="spinner" />
        <p>Loading hierarchy...</p>
      </div>
    );
  }

  return (
    <div className="hierarchy-page">
      <div className="content-section">
        <div className="page-header">
          <div>
            <h1>Project Hierarchy</h1>
            <p>Explore the relationship between Projects, Tasks, and Comments</p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="empty-state">
            <FolderKanban className="empty-icon" />
            <h3>No projects yet</h3>
            <p>Create projects to see the hierarchy</p>
          </div>
        ) : (
          <div className="hierarchy-tree">
            {projects.map((project) => (
              <div key={project.id} className="hierarchy-item project-item">
                <div
                  className="hierarchy-header"
                  onClick={() => toggleProject(project.id)}
                >
                  <ChevronRight
                    className={`chevron ${expandedProjects.has(project.id) ? 'expanded' : ''}`}
                  />
                  <FolderKanban className="item-icon project-icon" />
                  <div className="item-content">
                    <h3>{project.title}</h3>
                    <span className="item-meta">Project</span>
                  </div>
                  {loadingTasks.has(project.id) && (
                    <Loader className="loading-icon" />
                  )}
                </div>

                {expandedProjects.has(project.id) && project.tasks && (
                  <div className="hierarchy-children">
                    {project.tasks.length === 0 ? (
                      <div className="empty-children">
                        <p>No tasks in this project</p>
                      </div>
                    ) : (
                      project.tasks.map((task) => (
                        <div key={task.id} className="hierarchy-item task-item">
                          <div
                            className="hierarchy-header"
                            onClick={() => toggleTask(task.id, project.id)}
                          >
                            <ChevronRight
                              className={`chevron ${expandedTasks.has(task.id) ? 'expanded' : ''}`}
                            />
                            <CheckSquare className="item-icon task-icon" />
                            <div className="item-content">
                              <h4>{task.title}</h4>
                              <div className="item-meta-group">
                                <span className="item-meta">Task</span>
                                <span className={`status-badge ${task.status.toLowerCase()}`}>
                                  {task.status}
                                </span>
                              </div>
                            </div>
                            {loadingComments.has(task.id) && (
                              <Loader className="loading-icon" />
                            )}
                          </div>

                          {expandedTasks.has(task.id) && task.comments && (
                            <div className="hierarchy-children">
                              {task.comments.length === 0 ? (
                                <div className="empty-children">
                                  <p>No comments on this task</p>
                                </div>
                              ) : (
                                task.comments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className="hierarchy-item comment-item"
                                  >
                                    <div className="hierarchy-header">
                                      <div className="spacer" />
                                      <MessageSquare className="item-icon comment-icon" />
                                      <div className="item-content">
                                        <p>{comment.content}</p>
                                        <span className="item-meta">
                                          Comment • {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

