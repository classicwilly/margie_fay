import EntryPointSelector from './components/EntryPointSelector';
import VertexNavigator from './components/VertexNavigator';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Logo/Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
              <span className="text-2xl">▲</span>
              <span className="text-sm font-medium text-slate-300">The Tetrahedron Protocol</span>
            </div>
            
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              Infrastructure for
              <span className="block bg-linear-to-r from-blue-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
                Distributed Resilience
              </span>
            </h1>
            
            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-16 leading-relaxed">
              Meet people where they are. All roads lead to resilience.
              <span className="block mt-2 text-slate-500">
                Choose your entry point. Discover the pattern. Scale when ready.
              </span>
            </p>
          </div>
          
          {/* Tetrahedron Hint */}
          <div className="mt-20 flex justify-center">
            <div className="relative w-64 h-64">
              {/* Simple SVG Tetrahedron */}
              <svg viewBox="0 0 200 200" className="w-full h-full opacity-60">
                {/* Edges */}
                <line x1="100" y1="30" x2="30" y2="150" stroke="url(#edge-gradient)" strokeWidth="2" />
                <line x1="100" y1="30" x2="170" y2="150" stroke="url(#edge-gradient)" strokeWidth="2" />
                <line x1="100" y1="30" x2="100" y2="130" stroke="url(#edge-gradient)" strokeWidth="2" />
                <line x1="30" y1="150" x2="170" y2="150" stroke="url(#edge-gradient)" strokeWidth="2" />
                <line x1="30" y1="150" x2="100" y2="130" stroke="url(#edge-gradient)" strokeWidth="2" />
                <line x1="170" y1="150" x2="100" y2="130" stroke="url(#edge-gradient)" strokeWidth="2" />
                
                {/* Vertices */}
                <circle cx="100" cy="30" r="8" fill="#3B82F6" className="animate-pulse" /> {/* Technical - Blue */}
                <circle cx="30" cy="150" r="8" fill="#A855F7" className="animate-pulse delay-300" /> {/* Emotional - Purple */}
                <circle cx="170" cy="150" r="8" fill="#22C55E" className="animate-pulse delay-500" /> {/* Practical - Green */}
                <circle cx="100" cy="130" r="8" fill="#F59E0B" className="animate-pulse delay-700" /> {/* Philosophical - Amber */}
                
                <defs>
                  <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#A855F7" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
              </svg>
              
              {/* Labels */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-xs text-blue-400 font-medium">Technical</div>
              <div className="absolute bottom-4 left-0 text-xs text-purple-400 font-medium">Emotional</div>
              <div className="absolute bottom-4 right-0 text-xs text-green-400 font-medium">Practical</div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-4 text-xs text-amber-400 font-medium">Philosophical</div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Framework Documentation Section */}
      <section id="framework" className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Four Vertices. Complete Framework.
          </h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">
            The tetrahedron is the minimum structural system for distributed resilience. Explore the framework from any vertex.
          </p>
          <VertexNavigator />
        </div>
      </section>
      
      {/* Entry Points Section */}
      <section id="entry" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EntryPointSelector />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <span className="text-xl">▲</span>
              <span>The Tetrahedron Protocol</span>
            </div>
            <p className="text-slate-500 text-sm">
              Open infrastructure for post-hub coordination. Fractal from four to millions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
