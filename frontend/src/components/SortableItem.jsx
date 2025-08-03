import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export const SortableItem = ({ id, task, onComplete, onDelete, actionInProgress, formatDate, getPriorityColorClass }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-white border rounded-xl shadow-sm p-3 sm:p-4 md:p-5 transition-all ${
        task.completed ? 'opacity-75' : ''
      } ${isDragging ? 'shadow-lg border-blue-300' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 w-full">
          {/* Drag Handle */}
          <button
            {...listeners}
            className="cursor-grab text-gray-400 hover:text-gray-600 transition self-start"
            aria-label="Drag task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6h.01M14 6h.01M10 12h.01M14 12h.01M10 18h.01M14 18h.01" />
            </svg>
          </button>

          {/* Task Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getPriorityColorClass(task.priority)}`}>
                {task.priority}
              </span>
              {task.completed && (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Completed
                </span>
              )}
            </div>

            <h3 className={`text-base sm:text-lg font-semibold truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>

            {task.description && (
              <p className="text-gray-600 mt-1 text-sm line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Due: {formatDate(task.deadline)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 self-end sm:self-auto">
          {!task.completed && (
            <button
              onClick={() => onComplete(task._id)}
              disabled={actionInProgress === task._id}
              className="py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
            >
              {actionInProgress === task._id ? (
                <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">Complete</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => onDelete(task._id)}
            disabled={actionInProgress === task._id}
            className="py-1.5 px-2 sm:py-2 sm:px-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
          >
            {actionInProgress === task._id ? (
              <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-0.5 sm:mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="hidden sm:inline">Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
