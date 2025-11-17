import React, { useState, useEffect } from 'react';
import { usersAPI } from '../../utils/api';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getUsers();
      setUsers(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="users-page">
      <h1>Users Management</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="users-grid">
        {users.length === 0 ? (
          <div className="no-users">No users found</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-header">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt={user.name}
                    className="user-avatar-large"
                  />
                ) : (
                  <div className="user-avatar-placeholder">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>
              <div className="user-stats">
                <div className="stat-item">
                  <span className="stat-label">Pending Tasks</span>
                  <span className="stat-value pending">{user.pendingTasks || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">In Progress</span>
                  <span className="stat-value in-progress">
                    {user.inProgressTasks || 0}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Completed</span>
                  <span className="stat-value completed">
                    {user.completedTasks || 0}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Users;
