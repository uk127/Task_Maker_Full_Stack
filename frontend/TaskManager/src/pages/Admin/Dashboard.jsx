import React, { useState, useEffect } from 'react';
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
import { tasksAPI, reportsAPI } from '../../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await tasksAPI.getDashboardData();
      setDashboardData(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExportTasks = async () => {
    try {
      const blob = await reportsAPI.exportTasksReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tasks_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export tasks report');
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await reportsAPI.exportUsersReport();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users_report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Failed to export users report');
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
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="export-buttons">
          <button onClick={handleExportTasks} className="export-btn">
            Export Tasks Report
          </button>
          <button onClick={handleExportUsers} className="export-btn">
            Export Users Report
          </button>
        </div>
      </div>

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

      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-card-header">
            <div>
              <h2>Task Distribution</h2>
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
              <h2>Task Priority Levels</h2>
              <p>Volume across Low / Medium / High</p>
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
        <h2>Recent Tasks</h2>
        <div className="tasks-table">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>
                    No recent tasks
                  </td>
                </tr>
              ) : (
                recentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>{task.title}</td>
                    <td>
                      <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
