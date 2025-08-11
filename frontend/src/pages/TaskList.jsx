import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { SortableItem } from '../components/SortableItem';
import api from '../api';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionInProgress, setActionInProgress] = useState(null);
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // Require 10px movement before dragging starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.get('/api/tasks');
      setTasks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex(item => item._id === active.id);
        const newIndex = items.findIndex(item => item._id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
      // TODO: Add API call to persist the new order
    }
    
    setActiveId(null);
  }, []);

  const handleCompleteTask = useCallback(async (taskId) => {
    setActionInProgress(taskId);
    try {
      await api.put(`/api/tasks/${taskId}/complete`);
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, completed: true } : task
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete task');
      console.error('Error completing task:', err);
    } finally {
      setActionInProgress(null);
    }
  }, [tasks]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setActionInProgress(taskId);
    try {
      await api.delete(`/api/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      console.error('Error deleting task:', err);
    } finally {
      setActionInProgress(null);
    }
  }, [tasks]);

  const formatDate = useCallback((dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }, []);

  const getPriorityColorClass = useCallback((priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }, []);

  const activeTask = activeId ? tasks.find(task => task._id === activeId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#f0abfc]/20 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#67e8f9]/30 rounded-full" aria-hidden="true" />
            
            <div className="relative z-10">
              {/* Header section */}
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                    Task Management
                  </h1>
                  <p className="text-gray-500 mt-1">
                    Organize and prioritize your work
                  </p>
                </div>
                <Link
                  to="/create-task"
                  className="w-full sm:w-auto py-2 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label="Create new task"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>New Task</span>
                </Link>
              </header>

              {/* Error message */}
              {error && (
                <div className="mb-6 px-4 py-3 rounded-lg text-sm flex items-center bg-red-50 text-red-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              {/* Content */}
              <main>
                {isLoading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin h-8 w-8 text-purple-500" aria-label="Loading">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                ) : tasks.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h2 className="text-xl font-medium text-gray-600 mb-2">No tasks found</h2>
                    <p className="text-gray-500 mb-6">Get started by creating your first task</p>
                    <Link
                      to="/create-task"
                      className="inline-flex items-center py-2 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create Task</span>
                    </Link>
                  </div>
                ) : (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    accessibility={{
                      announcements: {
                        onDragStart(id) {
                          return `Picked up draggable item ${id}`;
                        },
                        onDragOver(id) {
                          return `Draggable item ${id} was moved`;
                        },
                        onDragEnd(id) {
                          return `Draggable item ${id} was dropped`;
                        },
                      },
                    }}
                  >
                    <SortableContext
                      items={tasks.map(task => task._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <ul className="space-y-3">
                        {tasks.map((task) => (
                          <SortableItem
                            key={task._id}
                            id={task._id}
                            task={task}
                            onComplete={handleCompleteTask}
                            onDelete={handleDeleteTask}
                            actionInProgress={actionInProgress}
                            formatDate={formatDate}
                            getPriorityColorClass={getPriorityColorClass}
                          />
                        ))}
                      </ul>
                    </SortableContext>
                    <DragOverlay>
                      {activeTask ? (
                        <div className="bg-white border-2 border-blue-300 rounded-xl shadow-lg p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColorClass(activeTask.priority)}`}>
                                  {activeTask.priority}
                                </span>
                                {activeTask.completed && (
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                    Completed
                                  </span>
                                )}
                              </div>
                              <h3 className={`text-lg font-semibold truncate ${activeTask.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {activeTask.title}
                              </h3>
                              {activeTask.description && (
                                <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                                  {activeTask.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </DragOverlay>
                  </DndContext>
                )}
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;