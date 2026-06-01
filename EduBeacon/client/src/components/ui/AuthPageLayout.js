import React from 'react';
import { Link } from 'react-router-dom';
import BackToHome from './BackToHome';

const AuthPageLayout = ({ children, title, subtitle, footerExtra }) => (
  <div className="min-h-screen flex flex-col">
    <header className="nav-glass-effect safe-x">
      <div className="page-container flex items-center justify-between gap-4 min-h-[4.5rem] py-3">
        <BackToHome />
        <Link
          to="/"
          className="text-lg sm:text-xl font-bold text-primary-400 hover:text-primary-300 transition-colors shrink-0"
        >
          EduBeacon
        </Link>
      </div>
    </header>

    <main id="main-content" className="flex-1 flex items-center justify-center safe-x py-8 sm:py-12">
      <div className="w-full max-w-md">
        <div className="liquid-form rounded-xl shadow-lg p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary-400 mb-2">{title}</h1>
            {subtitle && <p className="text-primary-300 text-sm sm:text-base">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </main>

    <footer className="nav-glass-effect safe-x py-6 mt-auto">
      <div className="page-container text-center space-y-2">
        {footerExtra}
        <p className="text-primary-400 text-sm">&copy; 2024 EduBeacon. Empowering student success through AI.</p>
      </div>
    </footer>
  </div>
);

export default AuthPageLayout;
