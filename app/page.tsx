 'use client';

import StarfieldHero from './components/StarfieldHero';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      {/* Minimal homepage: starfield canvas + 4 breathing orbs (handled by StarfieldHero). */}
      <StarfieldHero />
      {/* StarfieldHero includes built-in keyboard/enter accessibility handlers; no additional overlay required. */}
    </div>
  );
}
