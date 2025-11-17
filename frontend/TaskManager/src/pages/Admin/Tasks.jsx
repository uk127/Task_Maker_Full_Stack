import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tasksAPI } from '../../utils/api';
import './Tasks.css';

const Tasks = () => {
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await tasksAPI.deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
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
    <div className="tasks-page">
      <div className="tasks-header">
        <h1>All Tasks</h1>
        <Link to="/admin/createtasks" className="create-btn">
          + Create New Task
        </Link>
      </div>

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
            <div key={task._id} className="task-card">
              <div className="task-header">
                <h3>{task.title}</h3>
                <div className="task-actions">
                  <Link to={`/admin/tasks/${task._id}/edit`} className="action-btn edit">
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="action-btn delete"
                  >
                    Delete
                  </button>
                </div>
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
                <div className="task-assigned">
                  <strong>Assigned to:</strong>{' '}
                  {task.assignedTo && task.assignedTo.length > 0
                    ? task.assignedTo.map((user) => user.name).join(', ')
                    : 'Unassigned'}
                </div>
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
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
