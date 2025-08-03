import React, { useState } from 'react';
import api from '../api';

const StudyTips = () => {
  const [subject, setSubject] = useState('');
  const [tips, setTips] = useState('');
  const [loading, setLoading] = useState(false);
  const [subjectHistory, setSubjectHistory] = useState([]);
  const [error, setError] = useState('');

  const popularSubjects = [
    'Organic Chemistry', 'Data Structures', 'Algorithms', 'JavaScript', 'React', 
    'Calculus', 'Physics', 'Statistics', 'Machine Learning', 'Python', 
    'Database Design', 'Computer Networks', 'Linear Algebra', 'Biochemistry'
  ];

  const getStudyTips = async () => {
    if (!subject.trim()) {
      setError('Please enter a subject or topic');
      return;
    }

    setLoading(true);
    setError('');
    setTips('');

    try {
      const { data } = await api.post('/study-tips', { subject: subject.trim() });
      setTips(data.tips);
      
      // Add to search history if not already present
      if (!subjectHistory.includes(subject.trim())) {
        setSubjectHistory(prev => [subject.trim(), ...prev.slice(0, 4)]);
      }
    } catch (err) {
      console.error('Error getting study tips:', err);
      setError('Failed to get study tips. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSelect = (subj) => {
    setSubject(subj);
    setTimeout(() => getStudyTips(), 100);
  };

  const parseTips = (tipsText) => {
    if (!tipsText) return [];
    return tipsText.split('\n').filter(line => line.trim()).map(line => line.replace(/^\d+\.?\s*/, ''));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
      <div className="container mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <div className="max-w-4xl w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Study Tips Generator</h1>
            <p className="text-gray-600">Get personalized study advice using AI for any subject or topic</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">What are you studying?</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your subject or topic
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && getStudyTips()}
                  placeholder="e.g., Organic Chemistry, DSA, Machine Learning..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={getStudyTips}
                  disabled={loading || !subject.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Generating tips...
                    </div>
                  ) : (
                    'Get Study Tips'
                  )}
                </button>

                {tips && (
                  <button
                    onClick={() => {
                      setTips('');
                      setSubject('');
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Clear
                  </button>
                )}
              </div>

              {subjectHistory.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Recent subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {subjectHistory.map((subj) => (
                      <button
                        key={subj}
                        onClick={() => handleSubjectSelect(subj)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-6">
            {popularSubjects.map((subj) => (
              <button
                key={subj}
                onClick={() => handleSubjectSelect(subj)}
                className="bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 p-3 rounded-lg text-center transition-all" 
              >
                <span className="text-gray-700 font-medium">{subj}</span>
              </button>
            ))}
          </div>

          {tips && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Study Tips for <span className="text-indigo-600">{subject}</span>
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  AI Powered
                </div>
              </div>

              <div className="space-y-3">
                {parseTips(tips).map((tip, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-amber-700">
                      Remember that these are general tips. Adapt them based on your learning style and course requirements!
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <button 
                  onClick={() => {
                    const el = document.createElement('textarea');
                    el.value = tips;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                    alert('Study tips copied to clipboard!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Copy Tips to Clipboard
                </button>
              </div>
            </div>
          )}

          {!tips && !loading && (
            <div className="text-center py-12">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-500 mb-2">Ready to get smarter?</h3>
              <p className="text-gray-400">Enter a subject above and get AI-powered study tips!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyTips;