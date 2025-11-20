import React from 'react';

const OriginStory: React.FC = () => {
  return (
    <div className="bg-card-dark rounded-lg shadow-md p-6 md:p-8 border border-gray-700 max-w-4xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-accent-teal mb-4">The Origin Story</h1>
      </header>

      <div className="space-y-8 text-lg text-text-light text-opacity-90 leading-relaxed">
        <p>
          My whole life has been an unwritten script. I've spent four decades navigating the world without a map.
        </p>
        <p>
          At 40, I was diagnosed with <strong>Autism and ADHD</strong>.
        </p>
        <p>
          This wasn't a medical label. It was the key to the script. It was the moment my entire life—all the chaos, the confusion, the intense interests, and the feeling of being "misrepresented a lot"—snapped into focus.
        </p>
        <p>
          The "chaos" was real. It was a brain bombarded with every possible thought. It was the "extreme emotional dysregulation" of a neurotype that wasn't understood or supported. It was the "hothead" reputation at a job that demanded "masking", which led to profound burnout.
        </p>
        <p>
          Then, during meditation, I had an experience that changed everything. I watched my brain, in real-time, file itself like a card catalog.
        </p>
        <p>
          That's what <strong>The Wonky Sprout</strong> is: A card catalog for a chaotic world.
        </p>
        
        <div className="pl-4 border-l-4 border-accent-green my-6">
            <h2 className="text-2xl font-semibold text-accent-green mb-2">The "Wonky" (The Chaos)</h2>
            <p>The organic, creative, non-linear brain.</p>
            <h2 className="text-2xl font-semibold text-accent-green mt-4 mb-2">The "Sprout" (The Structure)</h2>
            <p>The mechanical, logical, systems-driven mind. The gears, the circuits, the fix.</p>
        </div>

        <p>
          For 15 years, I was an Engineering Technician. I wasn't just fixing motors; I was a <strong>systems diagnostician</strong>. I was the one who hated group projects and would "usually do it all" to ensure it was done right. My job was to find the root cause, the "why" behind the failure, and build the system to fix it permanently.
        </p>
        <p>
          My brain is a machine that builds structure. It has "highly restricted, fixated interests" in 3D printing, CAD, and electronics. I don't just "fix stuff"—I re-engineer the foundation.
        </p>
        <p>
          This brand is my new operating system. It's built on a <strong>"strongly anti-BS" philosophy</strong>. It's about authenticity, not "corporate nonsense." It's about output, not "suck-ups."
        </p>
      </div>

      <footer className="text-center mt-12 pt-8 border-t border-gray-700">
        <p className="text-2xl font-bold text-accent-blue">It's okay to be a little wonky.</p>
        <p className="text-xl font-semibold text-text-light mt-2">It's not a bug. It's a feature. It's the "why" I can see the patterns in the noise.</p>
        <p className="text-lg text-text-light text-opacity-80 mt-4">This is my system. This is my "card catalog." This is me, building my world.</p>
      </footer>
    </div>
  );
};

export default OriginStory;