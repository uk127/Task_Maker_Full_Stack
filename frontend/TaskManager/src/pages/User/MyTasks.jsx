import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../../utils/api';
import './MyTasks.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [statusSummary, setStatusSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getTasks(statusFilter || undefined);
      setTasks(data.tasks || []);
      setStatusSummary(data.statusSummary || {});
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'high';
      case 'Medium':
        return 'medium';
      case 'Low':
        return 'low';
      default:
        return '';
    }
  };

  const getStatusColor = (status) => {
    return status.toLowerCase().replace(' ', '-');
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div className="my-tasks">
      <h1>My Tasks</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="status-filters">
        <button
          className={`filter-btn ${statusFilter === '' ? 'active' : ''}`}
          onClick={() => setStatusFilter('')}
        >
          All ({statusSummary.all || 0})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'Pending' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Pending')}
        >
          Pending ({statusSummary.pendingTasks || 0})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'In Progress' ? 'active' : ''}`}
          onClick={() => setStatusFilter('In Progress')}
        >
          In Progress ({statusSummary.inProgressTasks || 0})
        </button>
        <button
          className={`filter-btn ${statusFilter === 'Completed' ? 'active' : ''}`}
          onClick={() => setStatusFilter('Completed')}
        >
          Completed ({statusSummary.completedTasks || 0})
        </button>
      </div>

      <div className="tasks-grid">
        {tasks.length === 0 ? (
          <div className="no-tasks">No tasks found</div>
        ) : (
          tasks.map((task) => (
            <Link
              key={task._id}
              to={`/user/taskdetails/${task._id}`}
              className="task-card"
            >
              <div className="task-header">
                <h3>{task.title}</h3>
              </div>
              <p className="task-description">{task.description}</p>
              <div className="task-meta">
                <span className={`status-badge status-${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`priority-badge priority-${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
              <div className="task-footer">
                <div className="task-due-date">
                  <strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}
                </div>
                {task.completedTodoCount !== undefined && (
                  <div className="task-progress">
                    <strong>Progress:</strong> {task.completedTodoCount}/
                    {task.todoChecklist?.length || 0} completed
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MyTasks;
