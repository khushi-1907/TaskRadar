import React, { useState, useEffect } from 'react';
import { PieChart, Pie, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import api from '../api';

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0
  });

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];
  
  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.get('/api/tasks');
      const tasksData = response.data.data;
      setTasks(tasksData);
      
      // Calculate stats
      const completed = tasksData.filter(task => task.completed).length;
      setStats({
        total: tasksData.length,
        completed,
        pending: tasksData.length - completed
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare data for pie chart (completed vs pending)
  const preparePieChartData = () => {
    return [
      { name: 'Completed', value: stats.completed },
      { name: 'Pending', value: stats.pending }
    ];
  };

  // Prepare data for bar chart (tasks per priority)
  const prepareBarChartData = () => {
    const priorityCounts = {
      'Low': 0,
      'Medium': 0,
      'High': 0
    };
    
    tasks.forEach(task => {
      priorityCounts[task.priority]++;
    });
    
    return Object.keys(priorityCounts).map(priority => ({
      name: priority,
      tasks: priorityCounts[priority]
    }));
  };

  // Prepare data for line chart (tasks created per day for last 7 days)
  const prepareLineChartData = () => {
    const today = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i));
      return date;
    });
    
    const dailyCounts = last7Days.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      const count = tasks.filter(task => {
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === dateStr;
      }).length;
      
      return {
        date: dateStr,
        tasks: count,
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };
    });
    
    return dailyCounts;
  };

  // Format percentage for pie chart tooltip
  const renderPieChartTooltip = ({ payload }) => {
    if (payload && payload.length > 0) {
      const percentage = ((payload[0].value / stats.total) * 100).toFixed(1);
      return (
        <div className="bg-white p-2 shadow-md rounded-md border border-gray-200">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value} (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  // Render loading state
  if (isLoading) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </>
    );
  }

  // Render error state
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa] flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 max-w-md">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">Error Loading Analytics</h2>
            <p className="text-gray-600 text-center">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa] px-4 py-8 flex flex-col">
        <div className="container mx-auto max-w-6xl w-full flex-1 flex flex-col">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden mb-8">
            {/* Decorative elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f0abfc]/20 rounded-full"></div>
            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#67e8f9]/30 rounded-full"></div>
            
            <div className="relative z-10">
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
                Productivity Analytics
              </h1>
              <p className="text-gray-500 mb-8">Visualize your task data and gain insights</p>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-purple-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Tasks</p>
                      <h2 className="text-3xl font-bold text-gray-800">{stats.total}</h2>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-green-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Completed Tasks</p>
                      <h2 className="text-3xl font-bold text-gray-800">{stats.completed}</h2>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-blue-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Pending Tasks</p>
                      <h2 className="text-3xl font-bold text-gray-800">{stats.pending}</h2>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Task Completion Status</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={preparePieChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {preparePieChartData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={renderPieChartTooltip} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Bar Chart */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={prepareBarChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="tasks" fill="#8884d8" name="Number of Tasks" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Line Chart - Full Width */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Tasks Created (Last 7 Days)</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={prepareLineChartData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="displayDate" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="tasks"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="Tasks Created"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;