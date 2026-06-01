import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import MentorDashboard from './dashboards/MentorDashboard';
import StudentDashboard from './dashboards/StudentDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();

  const renderDashboard = () => {
    switch (user.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'mentor':
        return <MentorDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return <div className="text-primary-300">Unknown role</div>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="nav-glass-effect">
        <div className="page-container">
          <div className="flex flex-wrap items-center justify-between gap-4 min-h-[4.5rem] py-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <h1 className="text-lg sm:text-xl font-bold text-primary-400">EduBeacon</h1>
              <span className="inline-flex items-center min-h-[44px] px-3 py-1 bg-white/10 text-primary-400 text-sm font-medium rounded-full border border-primary-500/20">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-primary-300 text-sm sm:text-base truncate max-w-[12rem] sm:max-w-none">
                Welcome, {user.name}
              </span>
              <button type="button" onClick={logout} className="btn-ghost">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="page-container flex-1 py-6 sm:py-8">
        {renderDashboard()}
      </main>
    </div>
  );
};

export default Dashboard;
