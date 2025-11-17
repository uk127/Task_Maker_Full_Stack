import React, { useState } from 'react';
import Navbar from './Navbar';
import './Layout.css';

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={`layout ${isSidebarOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <Navbar isOpen={isSidebarOpen} onToggle={handleToggleSidebar} />
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;

