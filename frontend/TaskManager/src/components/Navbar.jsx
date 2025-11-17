import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard,
  MdChecklist,
  MdAddTask,
  MdGroup,
  MdLogout,
  MdMenu,
  MdMenuOpen,
} from 'react-icons/md';
import './Navbar.css';

const Navbar = ({ isOpen, onToggle }) => {
  const { user, logout, isAdmin } = useAuth();

  if (!user) return null;

  const menuItems = isAdmin
    ? [
        { to: '/admin/dashboard', label: 'Dashboard', icon: MdDashboard },
        { to: '/admin/tasks', label: 'Manage Tasks', icon: MdChecklist },
        { to: '/admin/createtasks', label: 'Create Task', icon: MdAddTask },
        { to: '/admin/users', label: 'Team Members', icon: MdGroup },
      ]
    : [
        { to: '/user/dashboard', label: 'Dashboard', icon: MdDashboard },
        { to: '/user/tasks', label: 'My Tasks', icon: MdChecklist },
      ];

  const avatarContent = user.profileImageUrl ? (
    <img src={user.profileImageUrl} alt={user.name} className="profile-avatar" />
  ) : (
    <div className="profile-avatar placeholder">
      {user.name?.charAt(0).toUpperCase()}
    </div>
  );

  return (
    <nav className={`sidebar modern ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-inner">
        <div className="sidebar-header">
          <h2 className="sidebar-title">Task Maker</h2>
          <button
            type="button"
            className="sidebar-toggle"
            onClick={onToggle}
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <MdMenuOpen /> : <MdMenu />}
          </button>
        </div>

        <div className="sidebar-profile">
          {avatarContent}
          <span className={`role-badge ${isAdmin ? 'admin' : 'member'}`}>
            {isAdmin ? 'Admin' : 'Member'}
          </span>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>

        <div className="sidebar-menu">
          {menuItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar-link modern-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="sidebar-icon" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-logout modern-link">
            <MdLogout className="sidebar-icon" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

