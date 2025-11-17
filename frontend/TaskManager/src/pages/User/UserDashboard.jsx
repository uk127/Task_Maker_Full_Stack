import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from 'recharts';
import { tasksAPI } from '../../utils/api';
import './UserDashboard.css';

const UserDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getUserDashboardData();
      setDashboardData(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available</div>;
  }

  const { statistics, charts, recentTasks } = dashboardData;

  const statusColors = ['#7C3AED', '#06B6D4', '#22C55E'];
  const priorityColors = ['#10B981', '#F59E0B', '#EF4444'];

  const statusChartData = Object.entries(charts.taskDistribution || {})
    .filter(([key]) => key !== 'All')
    .map(([key, value]) => ({
      name: key === 'InProgress' ? 'In Progress' : key,
      value,
    }));

  const priorityChartData = Object.entries(charts.taskPriorityLevels || {}).map(
    ([key, value]) => ({
      name: key,
      value,
    })
  );

  return (
    <div className="user-dashboard">
      <h1>My Dashboard</h1>

      <div className="hero-cards">
        <div className="hero-card total">
          <div className="hero-indicator" />
          <div>
            <p className="hero-label">Total Tasks</p>
            <p className="hero-value">{statistics.totalTasks}</p>
          </div>
        </div>
        <div className="hero-card pending">
          <div className="hero-indicator" />
          <div>
            <p className="hero-label">Pending Tasks</p>
            <p className="hero-value">{statistics.pendingTasks}</p>
          </div>
        </div>
        <div className="hero-card in-progress">
          <div className="hero-indicator" />
          <div>
            <p className="hero-label">In Progress</p>
            <p className="hero-value">{statistics.inProgressTasks || 0}</p>
          </div>
        </div>
        <div className="hero-card completed">
          <div className="hero-indicator" />
          <div>
            <p className="hero-label">Completed Tasks</p>
            <p className="hero-value">{statistics.completedTasks}</p>
          </div>
        </div>
      </div>

      <div className="user-charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2>My Task Distribution</h2>
              <p>Pending vs In Progress vs Completed</p>
            </div>
          </div>
          <div className="chart-visual donut">
            {statusChartData.length === 0 ? (
              <div className="chart-empty">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={2}
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={statusColors[index % statusColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Tasks']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2>My Task Priority Levels</h2>
              <p>Low / Medium / High priorities</p>
            </div>
          </div>
          <div className="chart-visual histogram">
            {priorityChartData.length === 0 ? (
              <div className="chart-empty">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={priorityChartData} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {priorityChartData.map((entry, index) => (
                      <Cell
                        key={`bar-${entry.name}`}
                        fill={priorityColors[index % priorityColors.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="recent-tasks">
        <div className="recent-tasks-header">
          <h2>Recent Tasks</h2>
          <Link to="/user/tasks" className="view-all-link">
            View All →
          </Link>
        </div>
        <div className="tasks-list">
          {recentTasks.length === 0 ? (
            <div className="no-tasks">No recent tasks</div>
          ) : (
            recentTasks.map((task) => (
              <Link
                key={task._id}
                to={`/user/taskdetails/${task._id}`}
                className="task-item"
              >
                <div className="task-item-content">
                  <h3>{task.title}</h3>
                  <div className="task-item-meta">
                    <span
                      className={`status-badge status-${task.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {task.status}
                    </span>
                    <span
                      className={`priority-badge priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                    <span className="due-date">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
