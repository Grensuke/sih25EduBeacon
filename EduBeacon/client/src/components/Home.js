import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, LineChart, Users } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="nav-glass-effect safe-x">
        <div className="page-container flex flex-wrap items-center justify-between gap-4 min-h-[4.5rem] py-3">
          <Link
            to="/"
            className="text-xl sm:text-2xl font-bold text-primary-500 hover:text-primary-400 transition-colors"
          >
            EduBeacon
          </Link>
          <nav className="flex flex-wrap items-center gap-3" aria-label="Main navigation">
            <Link to="/login" className="btn-secondary">
              Login
            </Link>
            <Link to="/admin-register" className="btn-primary">
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content" className="flex-1">
        <section className="page-container py-16 sm:py-20 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-400 mb-6 leading-tight">
              AI-Powered
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-300">
                Student Success
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-primary-300 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
              Prevent student dropout with intelligent counseling, personalized support,
              and data-driven insights that help every student thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center">
              <Link to="/admin-register" className="btn-primary text-lg px-8">
                Start Your Organization
              </Link>
              <Link to="/login" className="btn-secondary text-lg px-8">
                Access Dashboard
              </Link>
            </div>
          </div>
        </section>

        <section className="page-container pb-16 sm:pb-20 lg:pb-24" aria-labelledby="features-heading">
          <h2 id="features-heading" className="sr-only">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <article className="card text-primary-400 h-full">
              <div className="mb-4" aria-hidden="true">
                <Bot className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary-400">AI Counseling</h3>
              <p className="text-slate-200 leading-relaxed">
                Intelligent chatbot provides 24/7 support and guidance to students when they need it most.
              </p>
            </article>
            <article className="card text-primary-400 h-full">
              <div className="mb-4" aria-hidden="true">
                <LineChart className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary-400">Analytics Dashboard</h3>
              <p className="text-slate-200 leading-relaxed">
                Real-time insights and predictive analytics help identify at-risk students before it&apos;s too late.
              </p>
            </article>
            <article className="card text-primary-400 h-full md:col-span-2 lg:col-span-1">
              <div className="mb-4" aria-hidden="true">
                <Users className="w-10 h-10 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary-400">Mentor Support</h3>
              <p className="text-slate-200 leading-relaxed">
                Connect students with mentors and provide tools for effective academic and personal guidance.
              </p>
            </article>
          </div>
        </section>
      </main>

      <footer className="nav-glass-effect safe-x py-8 mt-auto">
        <div className="page-container text-center">
          <p className="text-primary-400 text-sm sm:text-base">
            &copy; 2024 EduBeacon. Empowering student success through AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
