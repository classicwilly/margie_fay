'use client';

import { useState, useEffect } from 'react';
import { Baby, Heart, Smile, Calendar, Activity, Plus } from 'lucide-react';
import { KidsModule } from '@/modules/kids/KidsModule';

interface Child {
  id: string;
  name: string;
  age: number;
  interests?: string[];
  recentActivities?: string[];
}

interface KidsViewProps {
  module: KidsModule;
}

export default function KidsView({ module }: KidsViewProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [checkInText, setCheckInText] = useState('');

  useEffect(() => {
    loadChildren();
  }, []);

  async function loadChildren() {
    try {
      const kids = await module.getChildren();
      setChildren(kids as Child[]);
      if (kids.length > 0 && !selectedChild) {
        setSelectedChild(kids[0] as Child);
      }
    } catch (error) {
      console.error('Failed to load children:', error);
    }
  }

  async function submitCheckIn() {
    if (!selectedChild || !checkInText.trim()) return;
    
    try {
      await module.logActivity(selectedChild.id, checkInText);
      setCheckInText('');
      await loadChildren();
    } catch (error) {
      console.error('Failed to submit check-in:', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Child Selector */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {children.map(child => (
          <button
            key={child.id}
            onClick={() => setSelectedChild(child)}
            className={`px-6 py-3 rounded-xl border-2 transition-all whitespace-nowrap ${
              selectedChild?.id === child.id
                ? 'border-blue-500 bg-blue-600/20 text-white'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2">
              <Baby className="w-4 h-4" />
              <span className="font-semibold">{child.name}</span>
              <span className="text-xs opacity-70">({child.age}y)</span>
            </div>
          </button>
        ))}
        <button className="px-6 py-3 rounded-xl border-2 border-dashed border-white/20 text-slate-400 hover:border-white/40 hover:text-white transition-all whitespace-nowrap">
          <Plus className="w-4 h-4 inline mr-2" />
          Add Child
        </button>
      </div>

      {selectedChild ? (
        <>
          {/* Child Profile Card */}
          <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                {selectedChild.name[0]}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedChild.name}</h2>
                <p className="text-slate-300 mb-3">Age {selectedChild.age}</p>
                {selectedChild.interests && selectedChild.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedChild.interests.map((interest, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-xs text-white"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Check-in */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Smile className="w-5 h-5" />
              Quick Check-in
            </h3>
            <div className="space-y-3">
              <textarea
                value={checkInText}
                onChange={(e) => setCheckInText(e.target.value)}
                placeholder={`How was ${selectedChild.name}'s day? What did they do? How are they feeling?`}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <button
                onClick={submitCheckIn}
                disabled={!checkInText.trim()}
                className="w-full px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                Log Check-in
              </button>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activities
            </h3>
            {selectedChild.recentActivities && selectedChild.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {selectedChild.recentActivities.map((activity, i) => (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-lg p-4"
                  >
                    <p className="text-slate-300">{activity}</p>
                    <span className="text-xs text-slate-500 mt-2 block">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                No recent activities logged. Add a check-in to track {selectedChild.name}'s activities!
              </div>
            )}
          </div>

          {/* Activity Ideas */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Activity Ideas for Age {selectedChild.age}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getActivityIdeas(selectedChild.age).map((idea, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
                >
                  <h4 className="text-white font-semibold mb-1">{idea.title}</h4>
                  <p className="text-sm text-slate-400">{idea.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-12 text-center">
          <Baby className="w-16 h-16 text-slate-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Children Added</h3>
          <p className="text-slate-400 mb-6">
            Add your children to start tracking their activities and development
          </p>
          <button className="px-6 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all">
            Add Your First Child
          </button>
        </div>
      )}
    </div>
  );
}

function getActivityIdeas(age: number) {
  if (age <= 2) {
    return [
      { title: 'Sensory Play', description: 'Textured toys, water play, safe objects to explore' },
      { title: 'Music & Movement', description: 'Simple songs, dancing, rhythm activities' },
      { title: 'Picture Books', description: 'Board books with bright colors and textures' },
      { title: 'Outdoor Time', description: 'Fresh air, nature walks, playground visits' },
    ];
  } else if (age <= 5) {
    return [
      { title: 'Creative Arts', description: 'Coloring, painting, crafts with simple materials' },
      { title: 'Pretend Play', description: 'Dress-up, kitchen play, toy vehicles' },
      { title: 'Building Blocks', description: 'Stacking, building, spatial awareness' },
      { title: 'Story Time', description: 'Picture books, interactive stories, rhymes' },
    ];
  } else if (age <= 10) {
    return [
      { title: 'Sports & Games', description: 'Soccer, swimming, bike riding, team games' },
      { title: 'STEM Activities', description: 'Simple experiments, building projects, coding' },
      { title: 'Reading Together', description: 'Chapter books, library visits, book discussions' },
      { title: 'Creative Projects', description: 'Art, music lessons, DIY crafts' },
    ];
  } else {
    return [
      { title: 'Hobbies', description: 'Support their interests and passions' },
      { title: 'Social Activities', description: 'Time with friends, group activities' },
      { title: 'Life Skills', description: 'Cooking, money management, responsibility' },
      { title: 'Academic Support', description: 'Homework help, study skills, goal setting' },
    ];
  }
}
