'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Calendar as CalendarIcon, FileText, Send, Plus } from 'lucide-react';
import { ParentingModule, type Message as ParentingMessage, type CustodySchedule } from '@/modules/parenting/ParentingModule';

interface Message extends ParentingMessage {
  senderId: string;
  content: string;
}

interface CustodyEvent extends CustodySchedule {
  childId?: string;
}

interface ParentingViewProps {
  module: ParentingModule;
}

export default function ParentingView({ module }: ParentingViewProps) {
  const [activeTab, setActiveTab] = useState<'messages' | 'custody' | 'rules'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [custodyEvents, setCustodyEvents] = useState<CustodyEvent[]>([]);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  async function loadData() {
    try {
      if (activeTab === 'messages') {
        const msgs = await module.getMessages();
        setMessages(msgs);
      } else if (activeTab === 'custody') {
        const events = await module.getCustodySchedule();
        setCustodyEvents(events);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }

  async function sendMessage() {
    if (!newMessage.trim()) return;
    
    try {
      module.sendMessage({
        from: 'me',
        to: 'co-parent',
        subject: 'Message',
        body: newMessage,
        urgent: false,
        category: 'general'
      });
      setNewMessage('');
      await loadData();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 bg-white/5 p-2 rounded-xl border border-white/10">
        {[
          { id: 'messages', label: 'Messages', icon: MessageSquare },
          { id: 'custody', label: 'Custody Schedule', icon: CalendarIcon },
          { id: 'rules', label: 'Agreements', icon: FileText },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-4 py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Co-Parent Messages</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === 'me' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      message.senderId === 'me'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className="text-xs opacity-70 mt-1 block">
                      {new Date(message.timestamp).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custody Schedule Tab */}
      {activeTab === 'custody' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Custody Schedule</h3>
            <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Event
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            {custodyEvents.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                No custody events scheduled. Add your schedule to track time with your children.
              </div>
            ) : (
              <div className="space-y-3">
                {custodyEvents.map(event => (
                  <div
                    key={event.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-white font-semibold mb-1">
                          {new Date(event.startDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}{' '}
                          -{' '}
                          {new Date(event.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-sm text-slate-400">
                          With: {event.parentId === 'me' ? 'You' : 'Co-Parent'}
                        </div>
                        {event.notes && (
                          <div className="text-sm text-slate-300 mt-2">{event.notes}</div>
                        )}
                      </div>
                      <div className="px-3 py-1 bg-blue-600/20 border border-blue-500/50 rounded text-xs text-blue-400">
                        {event.childId}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Agreements/Rules Tab */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Parenting Agreements</h3>
            <button className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Agreement
            </button>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="space-y-4">
              {[
                { title: 'Communication Protocol', content: 'All major decisions require discussion with both parents before action.' },
                { title: 'Schedule Changes', content: 'Request schedule changes at least 48 hours in advance when possible.' },
                { title: 'Medical Decisions', content: 'Both parents must be informed of all medical appointments and decisions.' },
              ].map((rule, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <h4 className="text-white font-semibold mb-2">{rule.title}</h4>
                  <p className="text-sm text-slate-300">{rule.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
