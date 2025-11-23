

import React from 'react';


const eventTypeColors = {
    appointment: 'bg-accent-blue',
    school: 'bg-accent-green',
    handoff: 'bg-accent-teal',
    other: 'bg-gray-500',
    'task-block': 'bg-accent-purple',
};

const START_HOUR = 6; // 6 AM
const END_HOUR = 22.5; // 10:30 PM
const TOTAL_HOURS = END_HOUR - START_HOUR;

const DailyTimeline = ({ events }) => {

    const getEventStyle = (event) => {
        const startTime = new Date(event.date);
        // Assume a 1-hour duration for all events for visualization, as end time is not stored.
        const durationHours = 1;

        const startHourDecimal = startTime.getHours() + startTime.getMinutes() / 60;
        
        // Don't render events that are outside the visible timeline range
        if (startHourDecimal < START_HOUR || startHourDecimal >= END_HOUR) {
            return { display: 'none' };
        }

        const leftPercentage = ((startHourDecimal - START_HOUR) / TOTAL_HOURS) * 100;
        const widthPercentage = (durationHours / TOTAL_HOURS) * 100;

        return {
            left: `${leftPercentage}%`,
            width: `${widthPercentage}%`,
        };
    };

    const timeMarkers = [
        { hour: 6, label: '6a' },
        { hour: 9, label: '9a' },
        { hour: 12, label: '12p' },
        { hour: 15, label: '3p' },
        { hour: 18, label: '6p' },
        { hour: 21, label: '9p' },
    ];

    return (
        <div className="mb-6">
            <h4 className="font-semibold text-accent-blue mb-2">Today's Time Blocks</h4>
            <div className="relative h-12 bg-gray-800 rounded-md p-1">
                {/* Timeline background */}
                <div className="relative w-full h-full">
                    {events.map(event => (
                        <div
                            key={event.id}
                            title={`${event.title} at ${new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            className={`absolute top-0 h-full rounded opacity-80 ${eventTypeColors[event.type] || 'bg-gray-500'}`}
                            ref={(el) => {
                                if (!el) return;
                                const s = getEventStyle(event);
                                if (s.display === 'none') {
                                    el.style.display = 'none';
                                } else {
                                    el.style.left = s.left;
                                    el.style.width = s.width;
                                }
                            }}
                        >
                             <span className="text-xs text-white font-semibold truncate px-1 absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 hidden sm:inline">
                                {event.title}
                            </span>
                        </div>
                    ))}
                </div>
                 {/* Time Markers */}
                {timeMarkers.map(marker => (
                    <div
                        key={marker.hour}
                        className="absolute top-full mt-1 text-xs text-gray-500 transform -translate-x-1/2"
                        ref={(el) => el && (el.style.left = `${((marker.hour - START_HOUR) / TOTAL_HOURS) * 100}%`)}
                    >
                        {marker.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyTimeline;