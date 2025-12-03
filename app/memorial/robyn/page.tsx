'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';

export default function RobynMemorialPage() {
  const [turtlePosition, setTurtlePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Gentle floating animation for sea turtles
    const interval = setInterval(() => {
      setTurtlePosition({
        x: Math.sin(Date.now() / 3000) * 20,
        y: Math.cos(Date.now() / 4000) * 15
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-950 via-blue-950 to-slate-950">
      {/* Ocean waves background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-cyan-400/5 to-transparent animate-pulse"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/memorial-fund"
          className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Memorial Fund</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* Sea turtle illustration */}
              <div 
                className="text-9xl opacity-90 transition-transform duration-300"
                style={{
                  transform: `translate(${turtlePosition.x}px, ${turtlePosition.y}px)`
                }}
              >
                🐢
              </div>
              <div className="absolute -top-4 -right-4 text-2xl animate-pulse">✨</div>
              <div className="absolute -bottom-4 -left-4 text-2xl animate-pulse" style={{animationDelay: '0.5s'}}>✨</div>
            </div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-4">
            Robyn Francis
          </h1>
          <p className="text-2xl text-cyan-300 mb-2">
            Forever in Our Hearts
          </p>
          <p className="text-lg text-slate-400">
            July 7, 2024
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-slate-900/60 border border-cyan-500/20 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <div className="space-y-6 text-slate-300 leading-relaxed">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 text-pink-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">A Beautiful Soul</h2>
                <p className="mb-4">
                  Robyn loved the ocean and everything in it—especially sea turtles. She found peace watching them glide through the water, ancient and graceful, carrying the wisdom of the world on their shells.
                </p>
                <p className="mb-4">
                  She was a mother, a grandmother, a friend. She loved her family fiercely. Even in her final days, her strength and grace touched everyone around her.
                </p>
                <p>
                  Cancer took her body on July 7, 2024, but her spirit—like a sea turtle returning to the ocean—continues its journey. She swims in memories, in laughter, in the love that still surrounds Christyn and the kids.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Christyn */}
        <div className="bg-gradient-to-br from-pink-900/40 to-purple-900/40 border border-pink-500/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-pink-300 mb-4">For Christyn</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Your mom loved you with everything she had. That love doesn't end. It transforms.
            </p>
            <p>
              Grief is the price we pay for love. And what a beautiful price it is—to have loved someone so much that losing them breaks us open.
            </p>
            <p>
              She's not gone. She's in every wave that touches the shore. In every sea turtle that surfaces for air. In every moment you choose strength when you feel weak. In the way you love your kids the way she loved you.
            </p>
            <p className="text-pink-400 font-semibold">
              You carry her forward. That's what she would want. That's what love does.
            </p>
          </div>
        </div>

        {/* For the Kids */}
        <div className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-500/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-blue-300 mb-4">For the Kids</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Grandma loved you more than you'll ever know. When you were born, when you laughed, when you called her name—those were her favorite moments.
            </p>
            <p>
              When you see a sea turtle, think of her. Strong, peaceful, wise. That's who she was.
            </p>
            <p>
              It's okay to miss her. It's okay to cry. It's okay to be sad. That's what love feels like when someone we love goes away.
            </p>
            <p className="text-cyan-400 font-semibold">
              She's watching over you. Like a sea turtle watching the ocean. Always there. Always protective. Always loving.
            </p>
          </div>
        </div>

        {/* The Tetrahedron Connection */}
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4">The Mesh Catches You</h2>
          <div className="space-y-4 text-slate-300">
            <p>
              Robyn was a vertex. A connection point. A source of stability for her family.
            </p>
            <p>
              When a vertex fails, the mesh is supposed to catch you. That's the protocol. That's the promise.
            </p>
            <p>
              This memorial page is part of that mesh. A place to remember. A place to grieve. A place to know that even when the structure breaks, the connections remain.
            </p>
            <p className="text-purple-400 italic">
              "When your vertex fails, the mesh catches you."
            </p>
            <p>
              Christyn, kids, family—you are still held. The tetrahedron is broken, but the love that formed it is eternal.
            </p>
          </div>
        </div>

        {/* Floating Sea Turtles Footer */}
        <div className="text-center mt-12 py-8">
          <div className="flex justify-center gap-8 text-6xl opacity-60 mb-4">
            <span className="animate-pulse">🐢</span>
            <span className="animate-pulse" style={{animationDelay: '0.3s'}}>🐢</span>
            <span className="animate-pulse" style={{animationDelay: '0.6s'}}>🐢</span>
          </div>
          <p className="text-slate-400 text-sm">
            Swimming forever in our hearts
          </p>
          <p className="text-cyan-400 mt-2">
            Robyn Francis • July 7, 2024
          </p>
        </div>
      </div>
    </div>
  );
}
