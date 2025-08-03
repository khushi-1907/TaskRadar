import React, { useState, useEffect } from 'react';
import api from '../api';

const AiSuggestions = () => {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Fetch tasks and suggestions when component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/tasks');
        setTasks(response.data.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch tasks. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);
  
  // Fetch suggestions when tasks are loaded
  useEffect(() => {
    if (tasks.length > 0) {
      getAiSuggestions(tasks);
    }
  }, [tasks]);

  // Toggle task selection
  const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev => {
      if (prev.includes(taskId)) {
        return prev.filter(id => id !== taskId);
      } else {
        return [...prev, taskId];
      }
    });
  };

  // Get AI suggestions
  const getAiSuggestions = async (tasksToAnalyze = null) => {
    // If specific tasks are selected, use those, otherwise use all tasks
    const tasksForAnalysis = tasksToAnalyze || (selectedTasks.length > 0 ? 
      tasks.filter(task => selectedTasks.includes(task._id)) : 
      tasks);
    
    if (tasksForAnalysis.length === 0) {
      setError('No tasks available for analysis');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuggestion('');

      const response = await api.post('/api/ai/suggestions', {
        tasks: tasksForAnalysis
      });

      setSuggestion(response.data.data.suggestions);
    } catch (err) {
      setError('Failed to get AI suggestions. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">AI Task Suggestions</h1>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Select Tasks for Analysis</h2>
          
          {loading && tasks.length === 0 ? (
            <p className="text-gray-500">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks available. Create some tasks first.</p>
          ) : (
            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task._id} 
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${selectedTasks.includes(task._id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  onClick={() => toggleTaskSelection(task._id)}
                >
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      className="h-5 w-5 text-blue-600 rounded mt-1"
                      checked={selectedTasks.includes(task._id)}
                      onChange={() => {}} // Handled by the div onClick
                    />
                    <div className="ml-3">
                      <h3 className="text-md font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{task.description || 'No description'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => getAiSuggestions()}
            disabled={loading || tasks.length === 0}
            className={`mt-6 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading || tasks.length === 0 ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Getting Suggestions...
              </span>
            ) : (
              selectedTasks.length > 0 ? 'Get Suggestions for Selected Tasks' : 'Get Suggestions for All Tasks'
            )}
          </button>
        </div>

        {suggestion && (
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">AI Suggestions</h2>
              <button
                onClick={() => getAiSuggestions()}
                disabled={loading}
                className={`flex items-center px-3 py-1.5 text-sm font-medium rounded-md ${loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Regenerating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate Suggestions
                  </span>
                )}
              </button>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-gray-700 whitespace-pre-line">{suggestion}</p>
            </div>
          </div>
        )}
        
        {loading && !suggestion && (
          <div className="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-blue-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 text-center">Analyzing your tasks and generating AI suggestions...</p>
            <p className="text-gray-500 text-sm text-center mt-2">This may take a few moments</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiSuggestions;