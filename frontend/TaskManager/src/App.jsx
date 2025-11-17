import React from 'react';
import './App.css';
import PrivateRoute from './routes/PrivateRoute';
import SignIn from './pages/Auth/SignIn';
import SignUp from './pages/Auth/SignUp';
import Dashboard from './pages/Admin/Dashboard';
import CreateTask from './pages/Admin/CreateTask';
import Tasks from './pages/Admin/Tasks';
import Users from './pages/Admin/Users';
import UserDashboard from './pages/User/UserDashboard';
import MyTasks from './pages/User/MyTasks';
import TaskDetails from './pages/User/TaskDetails';
import EditTask from './pages/Admin/EditTask';
import { HashRouter as BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard') : '/signin'} replace />} />
        <Route path="signin" element={<SignIn/>}/>
        <Route path="signup" element={<SignUp/>}/>

        {/* admin routes */}
        <Route element={<PrivateRoute allowedRoles={["admin"]} />}>
          <Route path="/admin/dashboard" element={<Dashboard/>}/>
          <Route path="/admin/tasks" element={<Tasks/>}/>
          <Route path="/admin/createtasks" element={<CreateTask/>}/>
          <Route path="/admin/tasks/:id/edit" element={<EditTask/>}/>
          <Route path="/admin/users" element={<Users/>}/>
        </Route>

        {/* user routes */}
        <Route element={<PrivateRoute allowedRoles={["admin", "member"]} />}>
          <Route path="/user/dashboard" element={<UserDashboard/>}/>
          <Route path="/user/tasks" element={<MyTasks/>}/>
          <Route path="/user/taskdetails/:id" element={<TaskDetails/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
