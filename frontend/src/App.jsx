import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Signup from './pages/Signup';
import Login from './pages/Login';
import CreateTask from './pages/CreateTask';
import TaskList from './pages/TaskList';
import Analytics from './pages/Analytics';
import Pomodoro from './pages/Pomodoro';
import StickyNotes from './pages/StickyNotes';
import StudyTips from './pages/StudyTips';
import FocusMusic from './pages/FocusMusic';
import { useNavigate } from "react-router-dom";


// Design system constants
const COLORS = {
  primary: '#6366f1', // indigo-500
  primaryLight: '#818cf8', // indigo-400
  primaryDark: '#4f46e5', // indigo-600
  secondary: '#10b981', // emerald-500
  background: '#f8fafc', // slate-50
  text: '#1e293b', // slate-800
  textLight: '#64748b', // slate-500
  error: '#ef4444', // red-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token') !== null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Layout component for authenticated routes
const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between p-4 mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-800">TaskRadar</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <NavLink to="/tasks" icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
              Tasks
            </NavLink>
            <NavLink to="/create-task" icon="M12 6v6m0 0v6m0-6h6m-6 0H6">
              Create Task
            </NavLink>
            <NavLink to="/analytics" icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
              Analytics
            </NavLink>
            <NavLink to="/pomodoro" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z">
              Pomodoro
            </NavLink>
            <NavLink to="/sticky-notes" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
              Sticky Notes
            </NavLink>
            <NavLink to="/study-tips" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
              Study Tips
            </NavLink>
            <NavLink to="/focus-music" icon="M9 2a1 1 0 00-1 1v17a1 1 0 001 1h6a1 1 0 001-1V3a1 1 0 00-1-1H9zm6 0a1 1 0 011 1v17a1 1 0 01-1 1H9a1 1 0 01-1-1V3a1 1 0 011-1h6zM12 5a1 1 0 100-2 1 1 0 000 2z">
              Focus Music
            </NavLink>
          </nav>

          <div className="mt-auto p-4">
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
              }}
              className="w-full flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-800">TaskRadar</span>
          </div>
          <div className="w-6"></div> {/* Spacer for alignment */}
        </header>

        {/* Content */}
        <main className="">
          {children}
        </main>
      </div>
    </div>
  );
};

// Reusable NavLink component
const NavLink = ({ to, icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${isActive
          ? 'bg-indigo-50 text-indigo-600 font-medium'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
      </svg>
      <span>{children}</span>
    </Link>
  );
};
const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("token") !== null;
  const signupSuccess = location.state?.signupSuccess;

  useEffect(() => {
    if (isAuthenticated && !signupSuccess) {
      // If logged in and no success message, redirect to tasks
      navigate("/tasks", { replace: true });
    }
  }, [isAuthenticated, signupSuccess, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative overflow-hidden text-center border border-gray-100">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100/40 rounded-full"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-blue-100/40 rounded-full"></div>

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
            TaskRadar Dashboard
          </h1>

          {/* Signup success message */}
          {signupSuccess && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center justify-center bg-green-50 text-green-600 border border-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {signupSuccess}
            </div>
          )}

          {/* Tagline */}
          <p className="text-gray-600 mb-8">
            Track your tasks and boost productivity with AI-powered insights.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/tasks"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all text-center hover:from-indigo-600 hover:to-blue-600"
              >
                View Tasks
              </Link>
            ) : (
              <Link
                to="/login"
                className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all text-center hover:from-indigo-600 hover:to-blue-600"
              >
                Login
              </Link>
            )}
            <Link
              to="/signup"
              className="py-3 px-6 rounded-xl border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-all text-center"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Authenticated routes */}
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TaskList />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-task"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CreateTask />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pomodoro"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Pomodoro />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sticky-notes"
          element={
            <ProtectedRoute>
              <AppLayout>
                <StickyNotes />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/study-tips"
          element={
            <ProtectedRoute>
              <AppLayout>
                <StudyTips />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/focus-music"
          element={
            <ProtectedRoute>
              <AppLayout>
                <FocusMusic />
              </AppLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;