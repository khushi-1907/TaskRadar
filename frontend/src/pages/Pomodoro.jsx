import React, { useState, useEffect, useRef, useCallback } from 'react';

const PomodoroTimer = () => {
  // Timer settings
  const [workDuration, setWorkDuration] = useState(25 * 60); // 25 minutes in seconds
  const [shortBreakDuration, setShortBreakDuration] = useState(5 * 60); // 5 minutes in seconds
  const [longBreakDuration, setLongBreakDuration] = useState(15 * 60); // 15 minutes in seconds
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(workDuration);
  const [isActive, setIsActive] = useState(false);
  const [sessionType, setSessionType] = useState('work'); // 'work', 'shortBreak', 'longBreak'
  const [completedSessions, setCompletedSessions] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const [quote, setQuote] = useState('');
  
  // Timer ref for cleanup
  const timerRef = useRef(null);
  
  // Motivational quotes
  const quotes = useRef([
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
  ]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Calculate progress percentage for the timer circle
  const calculateProgress = useCallback(() => {
    const totalDuration = {
      work: workDuration,
      shortBreak: shortBreakDuration,
      longBreak: longBreakDuration
    }[sessionType];
    
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  }, [sessionType, timeLeft, workDuration, shortBreakDuration, longBreakDuration]);

  // Get a random quote
  const getRandomQuote = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * quotes.current.length);
    return quotes.current[randomIndex];
  }, []);

  // Switch to the next session
  const switchSession = useCallback(() => {
    if (sessionType === 'work') {
      setCompletedSessions(prev => prev + 1);
      
      if (currentCycle === 4) {
        setSessionType('longBreak');
        setTimeLeft(longBreakDuration);
        setCurrentCycle(1);
      } else {
        setSessionType('shortBreak');
        setTimeLeft(shortBreakDuration);
        setCurrentCycle(prev => prev + 1);
      }
      
      setQuote(getRandomQuote());
    } else {
      setSessionType('work');
      setTimeLeft(workDuration);
      setQuote('');
    }
  }, [sessionType, currentCycle, longBreakDuration, shortBreakDuration, workDuration, getRandomQuote]);

  // Start or resume the timer
  const startTimer = useCallback(() => {
    setIsActive(true);
  }, []);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsActive(false);
  }, []);

  // Reset the timer
  const resetTimer = useCallback(() => {
    pauseTimer();
    setSessionType('work');
    setTimeLeft(workDuration);
    setCompletedSessions(0);
    setCurrentCycle(1);
    setQuote('');
  }, [pauseTimer, workDuration]);

  // Timer effect
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
      audio.play();
      switchSession();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft, switchSession]);

  // Get session color theme
  const getSessionTheme = useCallback(() => {
    switch (sessionType) {
      case 'work':
        return {
          bg: 'from-blue-500 to-indigo-600',
          text: 'text-blue-600',
          bgLight: 'bg-blue-100',
          textLight: 'text-blue-800',
          button: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'shortBreak':
        return {
          bg: 'from-green-500 to-teal-600',
          text: 'text-green-600',
          bgLight: 'bg-green-100',
          textLight: 'text-green-800',
          button: 'bg-green-500 hover:bg-green-600'
        };
      case 'longBreak':
        return {
          bg: 'from-purple-500 to-pink-600',
          text: 'text-purple-600',
          bgLight: 'bg-purple-100',
          textLight: 'text-purple-800',
          button: 'bg-purple-500 hover:bg-purple-600'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          text: 'text-gray-600',
          bgLight: 'bg-gray-100',
          textLight: 'text-gray-800',
          button: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  }, [sessionType]);

  // Get text for current session
  const getSessionText = useCallback(() => {
    switch (sessionType) {
      case 'work': return 'Focus Time';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Session';
    }
  }, [sessionType]);

  const theme = getSessionTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#f0abfc]/20 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#67e8f9]/30 rounded-full" aria-hidden="true" />
            
            <div className="relative z-10">
              {/* Header */}
              <header className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                  Pomodoro Timer
                </h1>
                <p className="text-gray-500">Boost your productivity with focused sessions</p>
              </header>

              {/* Timer Circle */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative w-64 h-64 mb-6">
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
                      className={`${theme.text} transition-all duration-1000 ease-in-out`}
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
                    <span className="text-4xl font-bold text-gray-800">{formatTime(timeLeft)}</span>
                    <span className={`text-lg font-medium mt-2 ${theme.text}`}>
                      {getSessionText()}
                    </span>
                  </div>
                </div>

                {/* Session Info */}
                <div className="mb-6 text-center">
                  <div className="text-gray-600 mb-2">
                    Session {currentCycle}/4 • Completed: {completedSessions}
                  </div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${theme.bgLight} ${theme.textLight}`}>
                    {sessionType === 'work' ? 'Focus Mode' : 'Break Time'}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex space-x-4">
                  {!isActive ? (
                    <button
                      onClick={startTimer}
                      className={`px-6 py-2 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all ${theme.button} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      Start
                    </button>
                  ) : (
                    <button
                      onClick={pauseTimer}
                      className="px-6 py-2 rounded-xl bg-yellow-500 text-white font-medium shadow-md hover:bg-yellow-600 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      Pause
                    </button>
                  )}
                  <button
                    onClick={resetTimer}
                    className="px-6 py-2 rounded-xl bg-gray-300 text-gray-700 font-medium shadow-md hover:bg-gray-400 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Motivational Quote */}
              {quote && (
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-400">
                  <div className="flex">
                    <div className="flex-shrink-0 pt-0.5">
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
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;