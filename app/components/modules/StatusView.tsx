'use client';

import { useState, useEffect } from 'react';
import { Heart, Activity, Smile, Meh, Frown, Battery, Moon, Check } from 'lucide-react';
import { StatusModule, type AvailabilityStatus, type MoodState } from '@/modules/status/StatusModule';

interface StatusViewProps {
  module: StatusModule;
}

type Availability = AvailabilityStatus;
type Mood = MoodState;

interface HealthMetrics {
  sleep?: number;
  exercise?: number;
  water?: number;
  energy?: number;
}

export default function StatusView({ module }: StatusViewProps) {
  const [availability, setAvailability] = useState<Availability>('green');
  const [mood, setMood] = useState<Mood>('neutral');
  const [health, setHealth] = useState<HealthMetrics>({});
  const [customMessage, setCustomMessage] = useState('');

  useEffect(() => {
    loadStatus();
  }, []);

  async function loadStatus() {
    try {
      const status = await module.getCurrentStatus();
      if (status) {
        setAvailability(status.availability as Availability);
        setMood(status.mood as Mood);
        setHealth(status.healthMetrics || {});
        setCustomMessage(status.customMessage || '');
      }
    } catch (error) {
      console.error('Failed to load status:', error);
    }
  }

  async function updateAvailability(newAvailability: Availability) {
    try {
      await module.updateStatus({ availability: newAvailability });
      setAvailability(newAvailability);
    } catch (error) {
      console.error('Failed to update availability:', error);
    }
  }

  async function updateMood(newMood: Mood) {
    try {
      await module.updateStatus({ mood: newMood });
      setMood(newMood);
    } catch (error) {
      console.error('Failed to update mood:', error);
    }
  }

  async function updateHealth(metrics: HealthMetrics) {
    try {
      await module.updateStatus({ healthMetrics: { ...health, ...metrics } });
      setHealth({ ...health, ...metrics });
    } catch (error) {
      console.error('Failed to update health:', error);
    }
  }

  const availabilityOptions: { value: Availability; label: string; color: string; icon: typeof Activity }[] = [
    { value: 'green', label: 'Available', color: 'green', icon: Activity },
    { value: 'yellow', label: 'Busy', color: 'yellow', icon: Activity },
    { value: 'red', label: 'Unavailable', color: 'red', icon: Activity },
  ];

  const moodOptions: { value: Mood; label: string; icon: typeof Smile; color: string }[] = [
    { value: 'great', label: 'Great', icon: Smile, color: 'green' },
    { value: 'good', label: 'Good', icon: Smile, color: 'blue' },
    { value: 'neutral', label: 'Neutral', icon: Meh, color: 'yellow' },
    { value: 'down', label: 'Down', icon: Frown, color: 'orange' },
    { value: 'distressed', label: 'Distressed', icon: Frown, color: 'red' },
  ];

  return (
    <div className="space-y-6">
      {/* Availability Section */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Availability
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {availabilityOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => updateAvailability(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  availability === option.value
                    ? `border-${option.color}-500 bg-${option.color}-500/20`
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-3 h-3 rounded-full bg-${option.color}-500`} />
                  <span className="text-sm font-medium text-white">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mood Tracker */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Mood Check-in
        </h3>
        <div className="grid grid-cols-5 gap-3">
          {moodOptions.map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => updateMood(option.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mood === option.value
                    ? `border-${option.color}-500 bg-${option.color}-500/20`
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <Icon className={`w-6 h-6 ${
                    mood === option.value ? `text-${option.color}-400` : 'text-slate-400'
                  }`} />
                  <span className="text-xs font-medium text-white">{option.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Health Metrics */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Health Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sleep */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Sleep (hours)
              </label>
              <span className="text-lg font-bold text-white">{health.sleep || 0}h</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="0.5"
              value={health.sleep || 0}
              onChange={(e) => updateHealth({ sleep: parseFloat(e.target.value) })}
              className="w-full"
              aria-label="Sleep hours"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Exercise */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Exercise (min)
              </label>
              <span className="text-lg font-bold text-white">{health.exercise || 0}m</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="5"
              value={health.exercise || 0}
              onChange={(e) => updateHealth({ exercise: parseInt(e.target.value) })}
              className="w-full"
              aria-label="Exercise minutes"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0m</span>
              <span>180m</span>
            </div>
          </div>

          {/* Water */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Water (glasses)
              </label>
              <span className="text-lg font-bold text-white">{health.water || 0}</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              step="1"
              value={health.water || 0}
              onChange={(e) => updateHealth({ water: parseInt(e.target.value) })}
              className="w-full"
              aria-label="Water glasses"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0</span>
              <span>12</span>
            </div>
          </div>

          {/* Energy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <Battery className="w-4 h-4" />
                Energy Level
              </label>
              <span className="text-lg font-bold text-white">{health.energy || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={health.energy || 0}
              onChange={(e) => updateHealth({ energy: parseInt(e.target.value) })}
              className="w-full"
              aria-label="Energy level percentage"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Message */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Status Message</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => module.updateStatus({ customMessage })}
            className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            Update
          </button>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-sm text-slate-400 mb-1">Status</div>
          <div className="text-xl font-bold text-white capitalize">{availability}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-sm text-slate-400 mb-1">Mood</div>
          <div className="text-xl font-bold text-white capitalize">{mood}</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-sm text-slate-400 mb-1">Sleep</div>
          <div className="text-xl font-bold text-white">{health.sleep || 0}h</div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="text-sm text-slate-400 mb-1">Energy</div>
          <div className="text-xl font-bold text-white">{health.energy || 0}%</div>
        </div>
      </div>
    </div>
  );
}
