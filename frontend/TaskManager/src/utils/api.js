const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Log API URL for debugging (remove in production)
console.log('API Base URL:', API_BASE_URL);

// Helper function to get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Check if response is ok before trying to parse JSON
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, get text
      const text = await response.text();
      throw new Error(text || `HTTP error! status: ${response.status}`);
    }

    if (!response.ok) {
      throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Unable to connect to the server. Please make sure the backend server is running on http://localhost:5000');
    }
    // Re-throw other errors
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getProfile: () => apiRequest('/auth/profile', {
    method: 'POST',
  }),
  updateProfile: (userData) => apiRequest('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  uploadImage: (formData) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/auth/upload-image`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then(res => res.json());
  },
};

// Tasks API
export const tasksAPI = {
  getTasks: (status) => {
    const query = status ? `?status=${status}` : '';
    return apiRequest(`/tasks${query}`);
  },
  getTaskById: (id) => apiRequest(`/tasks/${id}`),
  createTask: (taskData) => apiRequest('/tasks', {
    method: 'POST',
    body: JSON.stringify(taskData),
  }),
  updateTask: (id, taskData) => apiRequest(`/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(taskData),
  }),
  deleteTask: (id) => apiRequest(`/tasks/${id}`, {
    method: 'DELETE',
  }),
  updateTaskStatus: (id, status) => apiRequest(`/tasks/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  }),
  updateTaskChecklist: (id, todoChecklist) => apiRequest(`/tasks/${id}/todo`, {
    method: 'PUT',
    body: JSON.stringify({ todoChecklist }),
  }),
  getDashboardData: () => apiRequest('/tasks/dashboard-data'),
  getUserDashboardData: () => apiRequest('/tasks/user-dashboard-data'),
};

// Users API
export const usersAPI = {
  getUsers: () => apiRequest('/users'),
  getUserById: (id) => apiRequest(`/users/${id}`),
  deleteUser: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Reports API
export const reportsAPI = {
  exportTasksReport: () => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/tasks/export/tasks`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(res => {
      if (!res.ok) throw new Error('Export failed');
      return res.blob();
    });
  },
  exportUsersReport: () => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/tasks/export/users`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    }).then(res => {
      if (!res.ok) throw new Error('Export failed');
      return res.blob();
    });
  },
};

