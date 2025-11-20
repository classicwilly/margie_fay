
import React, { useState, useEffect, useRef } from 'react';
import useProgressVar from '@hooks/useProgressVar';
import ContentCard from '../ContentCard'; // Adjusted path

const DayProgressBarModule = () => {
    const [progress, setProgress] = useState(0);
    const [timeString, setTimeString] = useState('');

    useEffect(() => {
        const updateProgress = () => {
            const now = new Date();
            const startOfDay = new Date(now);
            startOfDay.setHours(6, 0, 0, 0); // Day starts at 6:00 AM

            const endOfDay = new Date(now);
            endOfDay.setHours(22, 30, 0, 0); // Day ends at 10:30 PM

            const totalMinutesInDay = (endOfDay.getTime() - startOfDay.getTime()) / (1000 * 60);
            const minutesPassed = (now.getTime() - startOfDay.getTime()) / (1000 * 60);
            
            let currentProgress = (minutesPassed / totalMinutesInDay) * 100;
            currentProgress = Math.max(0, Math.min(100, currentProgress)); // Clamp between 0 and 100
            
            setProgress(currentProgress);
            setTimeString(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        };

        updateProgress();
        const interval = setInterval(updateProgress, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    const trackRef = useRef<HTMLDivElement | null>(null);
    useProgressVar(trackRef, progress);

    return (
        <ContentCard title="Day Progress">
            <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-accent-teal">06:00</span>
                <div className="w-full bg-gray-700 rounded-full h-4">
                     <div ref={trackRef as any} className="h-2 rounded-full bg-gray-700" role="progressbar" aria-label={`Day progress: ${Math.round(progress)}%`}>
                         <div className="h-2 rounded-full bg-accent-blue progress-fill" />
                         <span className="sr-only">Day progress: {Math.round(progress)}%</span>
                     </div>
                </div>
                <span className="font-mono text-sm text-accent-teal">22:30</span>
            </div>
            <p className="text-center text-sm text-text-light text-opacity-70 mt-2">Current System Time: {timeString}</p>
        </ContentCard>
    );
};

export default DayProgressBarModule;