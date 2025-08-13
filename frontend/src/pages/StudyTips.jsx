import { useState } from 'react';
import { PencilSquareIcon, LightBulbIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const StudyTips = () => {
  const [topic, setTopic] = useState('');
  const [tips, setTips] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStudyTips = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter a study topic');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/study-tips`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add auth token
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch study tips');
      }

      const data = await response.json();
      setTips(data.tips);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching study tips:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#f0abfc]/20 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#67e8f9]/30 rounded-full" aria-hidden="true" />
            
            <div className="relative z-10">
              <header className="flex flex-col items-center text-center mb-8">
                <AcademicCapIcon className="h-12 w-12 text-purple-500 mb-4" />
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
                  AI Study Tips
                </h1>
                <p className="text-gray-500">Get personalized study strategies for any topic</p>
              </header>

              <form onSubmit={fetchStudyTips} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a subject or topic (e.g. 'algorithms')"
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <LightBulbIcon className="h-5 w-5" />
                        <span>Get Tips</span>
                      </>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="mt-2 px-4 py-2 rounded-lg text-sm flex items-center bg-red-50 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                  </div>
                )}
              </form>

              {tips.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <PencilSquareIcon className="h-5 w-5 text-blue-500" />
                    <span>Study Tips for {topic}</span>
                  </h2>
                  <div className="grid gap-4">
                    {tips.map((tip, index) => (
                      <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                            {index + 1}
                          </span>
                          <p className="text-gray-700">{tip}</p>
                        </div>
                      </div>
                    ))}
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

export default StudyTips;