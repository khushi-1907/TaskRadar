import React, { useState, useEffect, useRef } from 'react';
import { DndContext, closestCenter, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import api from '../api';

const PRESET_COLORS = [
  { name: 'Yellow', value: '#fef3c7' },
  { name: 'Pink', value: '#fce7f3' },
  { name: 'Blue', value: '#dbeafe' },
  { name: 'Green', value: '#d1fae5' },
  { name: 'Purple', value: '#ede9fe' },
  { name: 'Orange', value: '#fed7aa' }
];

const StickyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0].value);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const containerRef = useRef(null);

  // Configure sensors for mouse and touch input
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Require 10px movement before dragging starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // Wait 250ms before dragging starts on touch devices
        tolerance: 5, // Allow 5px movement while waiting
      },
    })
  );

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const { data } = await api.get('/api/sticky-notes');
      setNotes(data);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = async () => {
    if (!newNoteContent.trim()) return;

    try {
      const { data } = await api.post('/api/sticky-notes', {
        content: newNoteContent,
        x: Math.random() * 200,
        y: Math.random() * 200,
        color: selectedColor,
        width: 240,
        height: 240
      });

      setNotes([...notes, data]);
      setNewNoteContent('');
      setShowNewNoteForm(false);
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const updateNote = async (id, updateData) => {
    try {
      const { data } = await api.put(`/api/sticky-notes/${id}`, updateData);
      setNotes(notes.map(note => note._id === id ? data : note));
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const deleteNote = async (id) => {
    try {
      await api.delete(`/api/sticky-notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!active || !over || active.id === over.id) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const noteId = active.id;
    const newX = event.over?.rect.left - containerRect.left;
    const newY = event.over?.rect.top - containerRect.top;

    // Update the note position
    await updateNote(noteId, { 
      x: Math.max(0, Math.min(newX, containerRect.width - 240)),
      y: Math.max(0, Math.min(newY, containerRect.height - 240))
    });
  };

  const handleResize = async (noteId, newWidth, newHeight) => {
    await updateNote(noteId, { 
      width: Math.max(100, Math.min(newWidth, 400)), 
      height: Math.max(100, Math.min(newHeight, 400)) 
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex flex-col">
      <div className="container mx-auto w-full px-4 py-8 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Sticky Notes</h1>
          <button
            onClick={() => setShowNewNoteForm(!showNewNoteForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Note
          </button>
        </div>

        {showNewNoteForm && (
          <div className="bg-white rounded-lg shadow-lg p-4 mb-6 max-w-md">
            <h3 className="text-lg font-semibold mb-3">Create New Note</h3>
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
              maxLength={500}
            />
            <div className="flex gap-2 my-3">
              {PRESET_COLORS.map(color => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === color.value ? 'border-gray-800' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={createNewNote}
                disabled={!newNoteContent.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => {
                  setShowNewNoteForm(false);
                  setNewNoteContent('');
                }}
                className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div 
          ref={containerRef}
          className="relative bg-gray-50 rounded-lg p-4" 
          style={{ minHeight: '600px' }}
        >
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">No notes yet. Create your first sticky note!</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToParentElement]}
            >
              {notes.map(note => (
                <div
                  key={note._id}
                  id={note._id}
                  className="absolute shadow-lg rounded-lg p-3 cursor-move transition-shadow hover:shadow-xl"
                  style={{
                    left: note.x,
                    top: note.y,
                    width: note.width,
                    height: note.height,
                    backgroundColor: note.color,
                    border: '1px solid rgba(0,0,0,0.1)'
                  }}
                  draggable
                >
                  <div className="h-full flex flex-col">
                    <textarea
                      value={note.content}
                      onChange={(e) => updateNote(note._id, { content: e.target.value })}
                      className="flex-1 bg-transparent resize-none border-none outline-none text-gray-800 placeholder-gray-500"
                      placeholder="Write something..."
                      maxLength={500}
                    />
                    
                    <div className="flex justify-between items-center mt-2">
                      <small className="text-gray-600 text-xs">
                        {note.timestamp ? new Date(note.timestamp).toLocaleDateString() : 'Now'}
                      </small>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newColorIndex = (PRESET_COLORS.findIndex(c => c.value === note.color) + 1) % PRESET_COLORS.length;
                            updateNote(note._id, { color: PRESET_COLORS[newColorIndex].value });
                          }}
                          className="p-1 hover:bg-black hover:bg-opacity-10 rounded"
                          title="Change color"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note._id);
                          }}
                          className="p-1 hover:bg-red-200 hover:text-red-600 rounded transition-colors"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </DndContext>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 Tip: Drag notes to reposition them • Click and type to edit anytime</p>
        </div>
      </div>
    </div>
  );
};

export default StickyNotes;