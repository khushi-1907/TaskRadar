import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { useDraggable } from '@dnd-kit/core';
import api from '../api';
import { 
  PencilSquareIcon, 
  TrashIcon, 
  CheckIcon, 
  XMarkIcon,
  PlusCircleIcon,
  ArrowsPointingOutIcon
} from '@heroicons/react/24/outline';

const PRESET_COLORS = [
  { name: 'Yellow', value: 'bg-yellow-100 border-yellow-200' },
  { name: 'Blue', value: 'bg-blue-100 border-blue-200' },
  { name: 'Green', value: 'bg-green-100 border-green-200' },
  { name: 'Pink', value: 'bg-pink-100 border-pink-200' },
  { name: 'Purple', value: 'bg-purple-100 border-purple-200' },
];

const NoteCard = ({ 
  note, 
  onUpdate, 
  onDelete, 
  onResize,
  containerRef 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [showControls, setShowControls] = useState(false);
  const noteRef = useRef(null);
  const resizeHandleRef = useRef(null);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note._id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: 'none',
  };

  const handleUpdate = async () => {
    await onUpdate(note._id, { content });
    setIsEditing(false);
  };

  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = note.width;
    const startHeight = note.height;

    const handleMouseMove = (e) => {
      const newWidth = Math.max(150, Math.min(startWidth + (e.clientX - startX), 400));
      const newHeight = Math.max(150, Math.min(startHeight + (e.clientY - startY), 400));
      onResize(note._id, newWidth, newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove, { passive: false });
      document.removeEventListener('touchend', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);
  }, [note._id, note.width, note.height, onResize]);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        width: `${note.width}px`,
        height: `${note.height}px`,
        left: `${note.x}px`,
        top: `${note.y}px`,
      }}
      className={`absolute rounded-xl shadow-lg p-4 flex flex-col ${note.color} transition-transform duration-100 select-none border`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      {...listeners}
      {...attributes}
    >
      {isEditing ? (
        <textarea
          className="flex-1 bg-transparent outline-none resize-none text-gray-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          autoFocus
        />
      ) : (
        <div className="flex-1 overflow-auto whitespace-pre-wrap text-gray-700">
          {note.content}
        </div>
      )}

      {showControls && (
        <div className="flex justify-between items-center mt-2">
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  className="p-1.5 text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                  title="Save"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setContent(note.content);
                  }}
                  className="p-1.5 text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                  title="Cancel"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-600 bg-white rounded-full hover:bg-gray-100 transition-colors"
                title="Edit"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={() => onDelete(note._id)}
              className="p-1.5 text-gray-600 bg-white rounded-full hover:bg-gray-100 transition-colors"
              title="Delete"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
          <div
            ref={resizeHandleRef}
            className="w-5 h-5 bg-white rounded-full cursor-se-resize touch-none flex items-center justify-center border border-gray-300 shadow-sm"
            onMouseDown={handleResizeStart}
            onTouchStart={handleResizeStart}
            title="Resize"
          >
            <ArrowsPointingOutIcon className="h-3 w-3 text-gray-500" />
          </div>
        </div>
      )}
    </div>
  );
};

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/api/sticky-notes');
      setNotes(data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load notes');
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const createNewNote = useCallback(async () => {
    if (!newNoteContent.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    try {
      const containerRect = containerRef.current?.getBoundingClientRect();
      const maxX = containerRect ? containerRect.width - 240 : window.innerWidth - 240;
      const maxY = containerRect ? containerRect.height - 240 : window.innerHeight - 240;

      const { data } = await api.post('/api/sticky-notes', {
        content: newNoteContent,
        x: Math.max(0, Math.min(Math.random() * maxX, maxX)),
        y: Math.max(0, Math.min(Math.random() * maxY, maxY)),
        color: selectedColor,
        width: 240,
        height: 240
      });

      setNotes([...notes, data]);
      setNewNoteContent('');
      setShowNewNoteForm(false);
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create note');
      console.error('Error creating note:', error);
    }
  }, [newNoteContent, selectedColor, notes]);

  const updateNote = useCallback(async (id, updateData) => {
    try {
      const { data } = await api.put(`/api/sticky-notes/${id}`, updateData);
      setNotes(notes.map(note => note._id === id ? data : note));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update note');
      console.error('Error updating note:', error);
    }
  }, [notes]);

  const deleteNote = useCallback(async (id) => {
    try {
      await api.delete(`/api/sticky-notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete note');
      console.error('Error deleting note:', error);
    }
  }, [notes]);

  const handleDragEnd = useCallback(async (event) => {
    const { active, delta } = event;
    
    if (!active) return;

    const noteId = active.id;
    const note = notes.find(n => n._id === noteId);
    if (!note) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const maxX = containerRect ? containerRect.width - note.width : window.innerWidth - note.width;
    const maxY = containerRect ? containerRect.height - note.height : window.innerHeight - note.height;

    const newX = Math.max(0, Math.min(note.x + delta.x, maxX));
    const newY = Math.max(0, Math.min(note.y + delta.y, maxY));

    await updateNote(noteId, { x: newX, y: newY });
  }, [notes, updateNote]);

  const handleResize = useCallback(async (noteId, newWidth, newHeight) => {
    await updateNote(noteId, { 
      width: Math.max(150, Math.min(newWidth, 400)), 
      height: Math.max(150, Math.min(newHeight, 400)) 
    });
  }, [updateNote]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#f0abfc]/20 rounded-full" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-[#67e8f9]/30 rounded-full" aria-hidden="true" />
            
            <div className="relative z-10">
              {/* Header */}
              <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">
                    Sticky Notes
                  </h1>
                  <p className="text-gray-500">Organize your thoughts and ideas</p>
                </div>
                <button
                  onClick={() => setShowNewNoteForm(!showNewNoteForm)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                  <span>{showNewNoteForm ? 'Cancel' : 'Add Note'}</span>
                </button>
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

              {/* New Note Form */}
              {showNewNoteForm && (
                <div className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">Create New Note</h2>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows={4}
                    placeholder="Write your note here..."
                    value={newNoteContent}
                    onChange={(e) => setNewNoteContent(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color.value}
                        className={`w-8 h-8 rounded-full ${color.value.split(' ')[0]} border-2 ${selectedColor === color.value ? 'border-black' : 'border-transparent'}`}
                        onClick={() => setSelectedColor(color.value)}
                        aria-label={`Select ${color.name} color`}
                      />
                    ))}
                  </div>
                  <button
                    onClick={createNewNote}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium shadow-md hover:shadow-lg transition-all"
                  >
                    <PlusCircleIcon className="h-5 w-5" />
                    <span>Create Note</span>
                  </button>
                </div>
              )}

              {/* Notes Board */}
              <div className="relative">
                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="animate-spin h-8 w-8 text-purple-500" aria-label="Loading">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div
                    ref={containerRef}
                    className="relative min-h-[500px] w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden"
                    style={{ height: 'calc(100vh - 300px)' }}
                  >
                    <DndContext
                      sensors={sensors}
                      onDragEnd={handleDragEnd}
                      modifiers={[restrictToParentElement]}
                    >
                      {notes.map((note) => (
                        <NoteCard 
                          key={note._id} 
                          note={note} 
                          onUpdate={updateNote}
                          onDelete={deleteNote}
                          onResize={handleResize}
                          containerRef={containerRef}
                        />
                      ))}
                    </DndContext>

                    {notes.length === 0 && !loading && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p>No notes yet. Create your first note!</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyNotes;