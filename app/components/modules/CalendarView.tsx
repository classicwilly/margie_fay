'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, Clock, Users, Trash2, Edit2, X, Check } from 'lucide-react';
import { CalendarModule } from '@/modules/calendar/CalendarModule';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  participants?: string[];
  location?: string;
  type?: 'personal' | 'family' | 'work' | 'other';
}

interface CalendarViewProps {
  module: CalendarModule;
}

export default function CalendarView({ module }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');

  useEffect(() => {
    loadEvents();
  }, [selectedDate, view]);

  async function loadEvents() {
    try {
      const start = getViewStartDate();
      const end = getViewEndDate();
      const loadedEvents = await module.getEvents(start, end);
      setEvents(loadedEvents as CalendarEvent[]);
    } catch (error) {
      console.error('Failed to load events:', error);
    }
  }

  function getViewStartDate(): Date {
    const date = new Date(selectedDate);
    if (view === 'day') {
      date.setHours(0, 0, 0, 0);
    } else if (view === 'week') {
      const day = date.getDay();
      date.setDate(date.getDate() - day);
      date.setHours(0, 0, 0, 0);
    } else {
      date.setDate(1);
      date.setHours(0, 0, 0, 0);
    }
    return date;
  }

  function getViewEndDate(): Date {
    const date = getViewStartDate();
    if (view === 'day') {
      date.setDate(date.getDate() + 1);
    } else if (view === 'week') {
      date.setDate(date.getDate() + 7);
    } else {
      date.setMonth(date.getMonth() + 1);
    }
    return date;
  }

  async function handleCreateEvent(event: Partial<CalendarEvent>) {
    try {
      await module.createEvent({
        title: event.title!,
        startTime: event.startTime!,
        endTime: event.endTime!,
        description: event.description,
        location: event.location,
      });
      await loadEvents();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  }

  async function handleDeleteEvent(eventId: string) {
    if (confirm('Delete this event?')) {
      try {
        await module.deleteEvent(eventId);
        await loadEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  }

  const getEventsByDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getWeekDays = () => {
    const days = [];
    const start = getViewStartDate();
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (view === 'day') newDate.setDate(newDate.getDate() - 1);
              else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
              else newDate.setMonth(newDate.getMonth() - 1);
              setSelectedDate(newDate);
            }}
            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            ←
          </button>
          
          <button
            onClick={() => setSelectedDate(new Date())}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            Today
          </button>
          
          <button
            onClick={() => {
              const newDate = new Date(selectedDate);
              if (view === 'day') newDate.setDate(newDate.getDate() + 1);
              else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
              else newDate.setMonth(newDate.getMonth() + 1);
              setSelectedDate(newDate);
            }}
            className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
          >
            →
          </button>

          <h2 className="text-2xl font-bold text-white">
            {selectedDate.toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric',
              ...(view === 'day' && { day: 'numeric' })
            })}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['day', 'week', 'month'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  view === v 
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Event
          </button>
        </div>
      </div>

      {/* Calendar View */}
      {view === 'week' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/10">
            {getWeekDays().map((day, i) => (
              <div key={i} className="p-4 text-center border-r border-white/10 last:border-r-0">
                <div className="text-xs text-slate-400 uppercase">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className={`text-2xl font-bold mt-1 ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-blue-400'
                    : 'text-white'
                }`}>
                  {day.getDate()}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 min-h-96">
            {getWeekDays().map((day, i) => (
              <div key={i} className="border-r border-white/10 last:border-r-0 p-2 space-y-1">
                {getEventsByDay(day).map(event => (
                  <div
                    key={event.id}
                    className="bg-blue-600/30 border border-blue-500/50 rounded p-2 cursor-pointer hover:bg-blue-600/40 transition-all group"
                    onClick={() => setEditingEvent(event)}
                  >
                    <div className="text-xs font-semibold text-white truncate">
                      {event.title}
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.startTime).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'day' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <div className="space-y-2">
            {getEventsByDay(selectedDate).length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No events scheduled for this day
              </div>
            ) : (
              getEventsByDay(selectedDate).map(event => (
                <div
                  key={event.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => setEditingEvent(event)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                      {event.description && (
                        <p className="text-sm text-slate-300 mb-2">{event.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(event.startTime).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })} - {new Date(event.endTime).toLocaleTimeString('en-US', { 
                            hour: 'numeric', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {event.participants && event.participants.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {event.participants.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(event.id);
                      }}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-all"
                      aria-label="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {(showCreateForm || editingEvent) && (
        <EventFormModal
          event={editingEvent}
          onSave={async (event) => {
            if (editingEvent) {
              // Update existing
              await module.updateEvent(editingEvent.id, event);
            } else {
              // Create new
              await handleCreateEvent(event);
            }
            setEditingEvent(null);
            setShowCreateForm(false);
            await loadEvents();
          }}
          onCancel={() => {
            setEditingEvent(null);
            setShowCreateForm(false);
          }}
          onDelete={editingEvent ? () => handleDeleteEvent(editingEvent.id) : undefined}
        />
      )}
    </div>
  );
}

interface EventFormModalProps {
  event: CalendarEvent | null;
  onSave: (event: Partial<CalendarEvent>) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

function EventFormModal({ event, onSave, onCancel, onDelete }: EventFormModalProps) {
  const [formData, setFormData] = useState<Partial<CalendarEvent>>(
    event || {
      title: '',
      description: '',
      startTime: new Date(),
      endTime: new Date(Date.now() + 3600000), // +1 hour
      participants: [],
      location: '',
      type: 'personal',
    }
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">
            {event ? 'Edit Event' : 'New Event'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-all"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
              placeholder="Event description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Start Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startTime ? new Date(formData.startTime).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, startTime: new Date(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Event start time"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                End Time *
              </label>
              <input
                type="datetime-local"
                value={formData.endTime ? new Date(formData.endTime).toISOString().slice(0, 16) : ''}
                onChange={(e) => setFormData({ ...formData, endTime: new Date(e.target.value) })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Event end time"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Event location"
            />
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div>
            {onDelete && (
              <button
                onClick={() => {
                  onDelete();
                  onCancel();
                }}
                className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-all"
              >
                Delete Event
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              disabled={!formData.title || !formData.startTime || !formData.endTime}
              className="px-6 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {event ? 'Save Changes' : 'Create Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
