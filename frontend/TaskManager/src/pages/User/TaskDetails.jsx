import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tasksAPI } from '../../utils/api';
import './TaskDetails.css';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getTaskById(id);
      setTask(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      await tasksAPI.updateTaskStatus(id, newStatus);
      fetchTask();
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const handleChecklistToggle = async (index) => {
    if (!task) return;

    const updatedChecklist = [...task.todoChecklist];
    updatedChecklist[index].completed = !updatedChecklist[index].completed;

    try {
      setUpdating(true);
      await tasksAPI.updateTaskChecklist(id, updatedChecklist);
      fetchTask();
    } catch (err) {
      alert('Failed to update checklist: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading task details...</div>;
  }

  if (error || !task) {
    return (
      <div className="error-container">
        <div className="error">{error || 'Task not found'}</div>
        <button onClick={() => navigate('/user/tasks')} className="back-button">
          Back to Tasks
        </button>
      </div>
    );
  }

  const progressPercentage =
    task.todoChecklist.length > 0
      ? Math.round(
          (task.todoChecklist.filter((item) => item.completed).length /
            task.todoChecklist.length) *
            100
        )
      : 0;

  return (
    <div className="task-details">
      <div className="task-details-header">
        <button onClick={() => navigate('/user/tasks')} className="back-button">
          ← Back to Tasks
        </button>
      </div>

      <div className="task-details-content">
        <div className="task-main">
          <div className="task-title-section">
            <h1>{task.title}</h1>
            <div className="task-badges">
              <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
              <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
          </div>

          <div className="task-description-section">
            <h2>Description</h2>
            <p>{task.description}</p>
          </div>

          <div className="task-info-grid">
            <div className="info-item">
              <strong>Due Date:</strong>
              <span>{new Date(task.dueDate).toLocaleString()}</span>
            </div>
            <div className="info-item">
              <strong>Assigned To:</strong>
              <span>
                {task.assignedTo && task.assignedTo.length > 0
                  ? task.assignedTo.map((user) => user.name).join(', ')
                  : 'Unassigned'}
              </span>
            </div>
            <div className="info-item">
              <strong>Progress:</strong>
              <span>{progressPercentage}%</span>
            </div>
          </div>

          {task.attachments && (
            <div className="task-attachments">
              <h2>Attachments</h2>
              <a
                href={task.attachments}
                target="_blank"
                rel="noopener noreferrer"
                className="attachment-link"
              >
                View Attachment
              </a>
            </div>
          )}

          <div className="task-status-control">
            <h2>Update Status</h2>
            <div className="status-buttons">
              <button
                onClick={() => handleStatusChange('Pending')}
                disabled={updating || task.status === 'Pending'}
                className={`status-btn ${task.status === 'Pending' ? 'active' : ''}`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusChange('In Progress')}
                disabled={updating || task.status === 'In Progress'}
                className={`status-btn ${task.status === 'In Progress' ? 'active' : ''}`}
              >
                In Progress
              </button>
              <button
                onClick={() => handleStatusChange('Completed')}
                disabled={updating || task.status === 'Completed'}
                className={`status-btn ${task.status === 'Completed' ? 'active' : ''}`}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="task-checklist-section">
          <h2>Checklist</h2>
          {task.todoChecklist.length === 0 ? (
            <p className="no-checklist">No checklist items</p>
          ) : (
            <>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <p className="progress-text">
                {task.todoChecklist.filter((item) => item.completed).length} of{' '}
                {task.todoChecklist.length} completed
              </p>
              <div className="checklist">
                {task.todoChecklist.map((item, index) => (
                  <label key={index} className="checklist-item">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(index)}
                      disabled={updating}
                    />
                    <span className={item.completed ? 'completed' : ''}>
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;
