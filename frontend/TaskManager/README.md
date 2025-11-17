# Task Manager Frontend

A modern React-based task management application with role-based access control.

## Features

- **Authentication**: Sign up and sign in with JWT-based authentication
- **Admin Dashboard**: 
  - View statistics and charts
  - Manage all tasks
  - Create new tasks
  - View and manage users
  - Export reports (Excel)
- **User Dashboard**:
  - View assigned tasks
  - Update task status
  - Manage task checklists
  - Track progress

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/       # Reusable components (Navbar, Layout)
├── context/         # React Context (AuthContext)
├── pages/           # Page components
│   ├── Admin/       # Admin pages
│   ├── Auth/        # Authentication pages
│   └── User/        # User pages
├── routes/          # Route protection
├── utils/           # API utilities
└── App.jsx          # Main app component
```

## API Integration

The frontend communicates with the backend API through utility functions in `src/utils/api.js`. All API calls include JWT authentication tokens stored in localStorage.

## Environment Variables

- `VITE_API_URL`: Backend API base URL (default: http://localhost:5000/api)
