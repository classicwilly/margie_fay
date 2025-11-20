
import React, { useState, useMemo } from 'react';
import { useAppState } from '@contexts/AppStateContext';

import ContentCard from '../../ContentCard.js';
import { getModeForDate } from '../../../hooks/useCurrentMode.js';

const eventTypeColors = {
    appointment: 'bg-accent-blue',
    school: 'bg-accent-green',
    handoff: 'bg-accent-teal',
    other: 'bg-gray-500',
    'task-block': 'bg-accent-purple',
};


const SharedCalendarModule = () => {
    const { appState, dispatch } = useAppState();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [newEventTitle, setNewEventTitle] = useState('');
    const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [newEventTime, setNewEventTime] = useState('12:00');
    const [newEventType, setNewEventType] = useState('appointment');

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const handleAddEvent = (e) => {
        e.preventDefault();
        if (!newEventTitle || !newEventDate) return;
        
        const dateWithTime = new Date(`${newEventDate}T${newEventTime}:00`);
        dispatch({
            type: 'ADD_CALENDAR_EVENT',
            payload: {
                title: newEventTitle,
                date: dateWithTime.toISOString(),
                type: newEventType,
            }
        });
        setNewEventTitle('');
    };

    const handleRemoveEvent = (eventId) => {
        dispatch({ type: 'REMOVE_CALENDAR_EVENT', payload: eventId });
    };

    const calendarDays = useMemo(() => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="p-2 border border-gray-800"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const mode = getModeForDate(date);
            const isDadDay = mode === 'Family Structure' && date.getDay() !== 1; // Assuming 'Dad Day' is Family Structure excluding Monday before 6pm
            const isToday = new Date().toDateString() === date.toDateString();
            const isSelected = selectedDate.toDateString() === date.toDateString();

            const dayEvents = appState.calendarEvents.filter(event => new Date(event.date).toDateString() === date.toDateString());

            days.push(
                <button 
                    key={day} 
                    onClick={() => setSelectedDate(date)}
                    className={`p-2 border border-gray-700 relative min-h-[80px] text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:z-10 
                        ${isSelected ? 'bg-accent-blue/20' : ''} 
                        ${isToday ? 'bg-accent-teal/10' : ''} 
                        hover:bg-gray-700`}
                    aria-label={`View events for ${date.toLocaleDateString()}`}
                >
                    <div className={`text-sm font-bold ${isToday ? 'text-accent-teal' : ''} ${isSelected ? 'text-accent-blue' : ''}`}>{day}</div>
                    <div className={`absolute top-1 right-1 text-xs px-1 rounded ${isDadDay ? 'bg-accent-teal/30 text-accent-teal' : 'bg-purple-500/30 text-purple-300'}`}>
                        {isDadDay ? 'Dad' : 'Mom'}
                    </div>
                     <div className="mt-1 space-y-1">
                        {dayEvents.slice(0, 2).map(event => (
                            <div key={event.id} className="text-xs p-1 rounded bg-gray-700 truncate flex items-center" title={event.title}>
                                <span className={`w-2 h-2 rounded-full mr-2 flex-shrink-0 ${eventTypeColors[event.type]}`}></span>
                                {event.title}
                            </div>
                        ))}
                        {dayEvents.length > 2 && <div className="text-xs text-gray-400">...{dayEvents.length - 2} more</div>}
                    </div>
                </button>
            );
        }
        return days;
    }, [currentDate, appState.calendarEvents, selectedDate]);

    const changeMonth = (delta) => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
    };
    
    const selectedDayEvents = appState.calendarEvents.filter(event => new Date(event.date).toDateString() === selectedDate.toDateString());
    const selectedDayMode = getModeForDate(selectedDate);
    const selectedIsDadDay = selectedDayMode === 'Family Structure' && selectedDate.getDay() !== 1; // Logic for Dad Day, consistent with above

    return (
        <ContentCard title="🗓️ Shared Co-Parenting Calendar" titleClassName="text-accent-blue text-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">&lt; Prev</button>
                        <h3 className="text-xl font-bold text-center">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                        <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition-colors">Next &gt;</button>
                    </div>
                     <div className="flex justify-center mb-4">
                        <button onClick={() => { setCurrentDate(new Date()); setSelectedDate(new Date()); }} className="px-4 py-2 bg-accent-green text-background-dark rounded font-semibold text-sm hover:bg-green-500 transition-colors">Jump to Today</button>
                    </div>
                    <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 mb-1">
                        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                    </div>
                    <div className="grid grid-cols-7 border-t border-l border-gray-700 bg-gray-900">
                        {calendarDays}
                    </div>
                </div>
                
                <div className="space-y-4">
                    <form onSubmit={handleAddEvent} className="p-4 bg-gray-800 rounded-lg border border-gray-700 space-y-3">
                        <h4 className="font-bold text-accent-teal">Add New Event</h4>
                        <label htmlFor="new-event-title" className="sr-only">Event Title</label>
                        <input id="new-event-title" type="text" value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Event Title" className="w-full p-2 bg-gray-900 border border-gray-600 rounded" required/>
                        <div className="flex gap-2">
                                                        <div className="w-full">
                                                            <label htmlFor="new-event-date" className="sr-only">Event Date</label>
                                                            <input id="new-event-date" type="date" value={newEventDate} onChange={e => setNewEventDate(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded" required/>
                                                        </div>
                                                        <div>
                                                            <label htmlFor="new-event-time" className="sr-only">Event Time</label>
                                                            <input id="new-event-time" type="time" value={newEventTime} onChange={e => setNewEventTime(e.target.value)} className="p-2 bg-gray-900 border border-gray-600 rounded" required/>
                                                        </div>
                        </div>
                        <label htmlFor="new-event-type" className="sr-only">Event Type</label>
                        <select id="new-event-type" value={newEventType} onChange={e => setNewEventType(e.target.value)} className="w-full p-2 bg-gray-900 border border-gray-600 rounded">
                            <option value="appointment">Appointment</option>
                            <option value="school">School Event</option>
                            <option value="handoff">Handoff</option>
                            <option value="other">Other</option>
                        </select>
                        <button type="submit" className="w-full p-2 bg-accent-blue text-background-dark font-bold rounded">Add Event</button>
                    </form>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-xl font-bold text-accent-teal mb-3 flex items-center">
                    <span>Details for: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    <span className={`ml-3 text-sm font-semibold px-2 py-1 rounded ${selectedIsDadDay ? 'bg-accent-teal/30 text-accent-teal' : 'bg-purple-500/30 text-purple-300'}`}>
                        {selectedIsDadDay ? 'Dad Day' : 'Mom Day'}
                    </span>
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {selectedDayEvents.length > 0 ? (
                        selectedDayEvents.map(event => (
                            <div key={event.id} className="text-sm p-2 bg-gray-800 rounded flex justify-between items-center">
                                <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${eventTypeColors[event.type]}`}></span>
                                    <div>
                                      <div className="font-semibold">{event.title}</div>
                                      <div className="text-xs text-gray-400">{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {event.type}</div>
                                    </div>
                                </div>
                                <button onClick={() => handleRemoveEvent(event.id)} className="text-red-500 hover:text-red-400 font-bold p-1" aria-label={`Delete event ${event.title}`}>×</button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 p-2">No scheduled events for this day.</p>
                    )}
                </div>
            </div>
        </ContentCard>
    );
};

export default SharedCalendarModule;