import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Signup from './pages/Signup';
import Login from './pages/Login';

// Simple Home component
const Home = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa] px-4">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 w-full max-w-md relative overflow-hidden text-center">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f0abfc]/20 rounded-full"></div>
        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#67e8f9]/30 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-blue-400 rounded-2xl flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
            TaskRadar Dashboard
          </h1>
          
          {location.state?.signupSuccess && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center bg-green-50 text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {location.state.signupSuccess}
            </div>
          )}
          
          <p className="text-gray-600 mb-8">
            Track your tasks and boost productivity with AI-powered insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/login" 
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all text-center"
            >
              Login
            </a>
            <a 
              href="/signup" 
              className="py-3 px-6 rounded-xl border border-purple-300 text-purple-600 font-medium hover:bg-purple-50 transition-all text-center"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrapper component to provide location to Home
const HomeWrapper = () => {
  const location = useLocation();
  
  return <Home location={location} />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<HomeWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;