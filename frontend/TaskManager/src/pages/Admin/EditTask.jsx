import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { tasksAPI, usersAPI } from '../../utils/api';
import './CreateTask.css';

const EditTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedTo: [],
    todoChecklist: [{ text: '', completed: false }],
    attachments: '',
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchTask = async () => {
    try {
      const task = await tasksAPI.getTaskById(id);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate || '',
        assignedTo: task.assignedTo?.map((user) => user._id) || [],
        todoChecklist:
          task.todoChecklist && task.todoChecklist.length > 0
            ? task.todoChecklist
            : [{ text: '', completed: false }],
        attachments: task.attachments || '',
      });
      setError('');
    } catch (err) {
      console.error('Failed to load task:', err);
      setError(err.message || 'Unable to load task details');
    } finally {
      setInitialLoading(false);
    }
  };

  const formatDateForInput = (isoDate) => {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) {
      return '';
    }
    const pad = (n) => (n < 10 ? '0' + n : n);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const getDueDateInputValue = (value) => {
    if (!value) return '';
    const isLocalFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
    if (isLocalFormat) {
      return value;
    }
    return formatDateForInput(value);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAssignedToChange = (userId) => {
    const assignedTo = formData.assignedTo.includes(userId)
      ? formData.assignedTo.filter((uid) => uid !== userId)
      : [...formData.assignedTo, userId];
    setFormData({ ...formData, assignedTo });
  };

  const handleChecklistChange = (index, value) => {
    const todoChecklist = [...formData.todoChecklist];
    todoChecklist[index].text = value;
    setFormData({ ...formData, todoChecklist });
  };

  const addChecklistItem = () => {
    setFormData({
      ...formData,
      todoChecklist: [...formData.todoChecklist, { text: '', completed: false }],
    });
  };

  const removeChecklistItem = (index) => {
    const todoChecklist = formData.todoChecklist.filter((_, i) => i !== index);
    setFormData({ ...formData, todoChecklist });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.description || !formData.dueDate) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.assignedTo.length === 0) {
      setError('Please assign the task to at least one user');
      return;
    }

    const parsedDueDate = new Date(formData.dueDate);
    if (Number.isNaN(parsedDueDate.getTime())) {
      setError('Please select a valid due date and time');
      return;
    }

    const todoChecklist = formData.todoChecklist.filter(
      (item) => item.text.trim() !== ''
    );

    setLoading(true);
    try {
      await tasksAPI.updateTask(id, {
        ...formData,
        dueDate: parsedDueDate.toISOString(),
        todoChecklist,
        assignedTo: formData.assignedTo,
      });
      navigate('/admin/tasks');
    } catch (err) {
      setError(err.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="create-task">
        <div className="create-task-header">
          <h1>Loading task...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="create-task">
      <div className="create-task-header">
        <h1>Edit Task</h1>
        <button onClick={() => navigate('/admin/tasks')} className="back-btn">
          ← Back to Tasks
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter task title"
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority *</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Enter task description"
          />
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="datetime-local"
            id="dueDate"
            name="dueDate"
            value={getDueDateInputValue(formData.dueDate)}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Assign To *</label>
          <div className="users-checkbox-list">
            {users.length === 0 ? (
              <p>No users available</p>
            ) : (
              users.map((user) => (
                <label key={user._id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.assignedTo.includes(user._id)}
                    onChange={() => handleAssignedToChange(user._id)}
                  />
                  <span>
                    {user.name} ({user.email})
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Todo Checklist</label>
          {formData.todoChecklist.map((item, index) => (
            <div key={index} className="checklist-item">
              <input
                type="text"
                value={item.text}
                onChange={(e) => handleChecklistChange(index, e.target.value)}
                placeholder="Enter checklist item"
              />
              {formData.todoChecklist.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeChecklistItem(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addChecklistItem}
            className="add-checklist-btn"
          >
            + Add Checklist Item
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="attachments">Attachments (URL)</label>
          <input
            type="text"
            id="attachments"
            name="attachments"
            value={formData.attachments}
            onChange={handleChange}
            placeholder="Enter attachment URL"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Update Task'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/tasks')}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTask;

