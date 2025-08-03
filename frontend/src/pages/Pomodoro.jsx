import React, { useState, useEffect, useRef } from 'react';

const Pomodoro = () => {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 minutes in seconds
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60); // 5 minutes in seconds
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60); // 15 minutes in seconds
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1); // Track which work session we're on (1-4)
  const [quote, setQuote] = useState('');
  
  // Timer ref for cleanup
  const timerRef = useRef(null);
  
  // Motivational quotes
  const quotes = [
    "The secret of getting ahead is getting started. - Mark Twain",
    "It always seems impossible until it's done. - Nelson Mandela",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The way to get started is to quit talking and begin doing. - Walt Disney",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "Start where you are. Use what you have. Do what you can. - Arthur Ashe",
    "The future depends on what you do today. - Mahatma Gandhi",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "The best way to predict the future is to create it. - Abraham Lincoln",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill"
  ];
  
  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calculate progress percentage for the timer circle
  const calculateProgress = () => {
    let totalDuration;
    if (sessionType === 'work') totalDuration = workDuration;
    else if (sessionType === 'shortBreak') totalDuration = shortBreakDuration;
    else totalDuration = longBreakDuration;
    
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  };
  
  // Get a random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  };
  
  // Start or resume the timer
  const startTimer = () => {
    setIsActive(true);
  };
  
  // Pause the timer
  const pauseTimer = () => {
    setIsActive(false);
  };
  
  // Reset the timer
  const resetTimer = () => {
    pauseTimer();
    setSessionType('work');
    setTimeLeft(workDuration);
    setCompletedSessions(0);
    setCurrentCycle(1);
    setQuote('');
  };
  
  // Switch to the next session
  const switchSession = () => {
    if (sessionType === 'work') {
      // After work session
      setCompletedSessions(prev => prev + 1);
      
      // Determine if we need a short break or long break
      if (currentCycle === 4) {
        // After 4 work sessions, take a long break
        setSessionType('longBreak');
        setTimeLeft(longBreakDuration);
        setCurrentCycle(1); // Reset cycle counter
      } else {
        // Take a short break
        setSessionType('shortBreak');
        setTimeLeft(shortBreakDuration);
        setCurrentCycle(prev => prev + 1);
      }
      
      // Set a new motivational quote for the break
      setQuote(getRandomQuote());
    } else {
      // After any break, go back to work
      setSessionType('work');
      setTimeLeft(workDuration);
      setQuote('');
    }
  };
  
  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Play sound when timer ends
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      audio.play();
      
      // Switch to next session
      switchSession();
    }
    
    // Cleanup function
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);
  
  // Get background color based on session type
  const getBackgroundColor = () => {
    if (sessionType === 'work') return 'from-blue-400 to-indigo-600';
    if (sessionType === 'shortBreak') return 'from-green-400 to-teal-500';
    return 'from-purple-400 to-pink-500'; // longBreak
  };
  
  // Get text for current session
  const getSessionText = () => {
    if (sessionType === 'work') return 'Focus Time';
    if (sessionType === 'shortBreak') return 'Short Break';
    return 'Long Break';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pomodoro Timer</h1>
        
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
          <div className="flex flex-col items-center">
            {/* Timer Circle */}
            <div className="relative w-64 h-64 mb-8">
              <div className="absolute inset-0 rounded-full bg-gray-100"></div>
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={`text-${sessionType === 'work' ? 'blue' : sessionType === 'shortBreak' ? 'green' : 'purple'}-500 transition-all duration-1000 ease-in-out`}
                  strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - calculateProgress() / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="45"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold">{formatTime(timeLeft)}</span>
                <span className={`text-lg font-medium mt-2 ${sessionType === 'work' ? 'text-blue-600' : sessionType === 'shortBreak' ? 'text-green-600' : 'text-purple-600'}`}>
                  {getSessionText()}
                </span>
              </div>
            </div>
            
            {/* Session Info */}
            <div className="mb-8 text-center">
              <div className="text-gray-600 mb-2">
                Session {currentCycle}/4 • Completed: {completedSessions}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${sessionType === 'work' ? 'bg-blue-100 text-blue-800' : sessionType === 'shortBreak' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                {sessionType === 'work' ? 'Working' : 'Taking a Break'}
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex space-x-4">
              {!isActive ? (
                <button
                  onClick={startTimer}
                  className={`px-6 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all ${sessionType === 'work' ? 'bg-blue-500 hover:bg-blue-600' : sessionType === 'shortBreak' ? 'bg-green-500 hover:bg-green-600' : 'bg-purple-500 hover:bg-purple-600'}`}
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="px-6 py-2 rounded-lg bg-yellow-500 text-white font-medium shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all"
                >
                  Pause
                </button>
              )}
              <button
                onClick={resetTimer}
                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-700 font-medium shadow-md hover:bg-gray-400 hover:shadow-lg transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
        
        {/* Motivational Quote */}
        {quote && (
          <div className="bg-white shadow rounded-lg p-6 border-l-4 border-yellow-400">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-gray-700 italic">"{quote}"</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pomodoro;