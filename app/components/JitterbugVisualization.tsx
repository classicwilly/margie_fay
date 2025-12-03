'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import {
  generateDelta,
  generateWye,
  interpolateDeltaToWye,
  rotate3D,
  project,
  type Point3D
} from '@/lib/geometry/sacred-geometry';

type JitterbugState = 
  | 'stable-delta'      // Distributed mesh, all nodes equal
  | 'stressed-delta'    // Stress point emerging
  | 'positive-wye'      // Hub formed, efficient but fragile
  | 'hub-failure'       // Hub failing/dying
  | 'negative-wye'      // Vacuum after hub loss
  | 'reformation'       // New connections forming (VPI)
  | 'new-delta';        // New stable mesh

interface JitterbugConfig {
  autoPlay?: boolean;
  speed?: number;
  showLabels?: boolean;
  size?: number;
}

export default function JitterbugVisualization({
  autoPlay = true,
  speed = 1.5,
  showLabels = true,
  size = 400
}: JitterbugConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<JitterbugState>('stable-delta');
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [progress, setProgress] = useState(0);
  const [rotation] = useState({ x: 0.3, y: 0.5, z: 0 });
  const animationRef = useRef<number | null>(null);

  const stateSequence: JitterbugState[] = [
    'stable-delta',
    'stressed-delta',
    'positive-wye',
    'hub-failure',
    'negative-wye',
    'reformation',
    'new-delta'
  ];

  const getStateDescription = (s: JitterbugState): { title: string; description: string; color: string } => {
    switch (s) {
      case 'stable-delta':
        return {
          title: 'Stable Delta (Distributed Mesh)',
          description: 'All nodes equal, all connected. High energy but resilient. No single point of failure.',
          color: '#22c55e'
        };
      case 'stressed-delta':
        return {
          title: 'Stressed Delta (Load Emerging)',
          description: 'One node taking more coordination. Beginning to centralize. System adapting.',
          color: '#eab308'
        };
      case 'positive-wye':
        return {
          title: 'Positive Wye (Hub Formed)',
          description: 'Center emerges. Efficient coordination. Low energy but fragile. Temporary is healthy.',
          color: '#3b82f6'
        };
      case 'hub-failure':
        return {
          title: 'Hub Failure (Crisis)',
          description: 'Central node failing, leaving, or dying. System losing coordinator. Cascade beginning.',
          color: '#ef4444'
        };
      case 'negative-wye':
        return {
          title: 'Negative Wye (Vacuum)',
          description: 'Hub gone. Nodes isolated, still oriented to missing center. Maximum chaos.',
          color: '#dc2626'
        };
      case 'reformation':
        return {
          title: 'Reformation (VPI Active)',
          description: 'New peer-to-peer connections forming. Energy input required. Mesh healing itself.',
          color: '#f59e0b'
        };
      case 'new-delta':
        return {
          title: 'New Stable Delta (Healed)',
          description: 'Mesh restored. New structure or memorial remains. System resilient again. Can breathe.',
          color: '#10b981'
        };
    }
  };

  const drawJitterbug = (ctx: CanvasRenderingContext2D, currentState: JitterbugState, prog: number) => {
    const centerX = size / 2;
    const centerY = size / 2;
    const nodeRadius = 20;
    
    ctx.clearRect(0, 0, size, size);
    
    // Define node positions for each state
    let nodes: { x: number; y: number; label: string; active: boolean; fading?: boolean }[] = [];
    let edges: { from: number; to: number; style: 'solid' | 'dashed' | 'forming' | 'breaking' }[] = [];

    switch (currentState) {
      case 'stable-delta':
        // Square/diamond with all nodes equal
        nodes = [
          { x: centerX, y: centerY - 100, label: 'A', active: true },
          { x: centerX - 100, y: centerY + 50, label: 'B', active: true },
          { x: centerX + 100, y: centerY + 50, label: 'C', active: true },
          { x: centerX, y: centerY + 80, label: 'D', active: true }
        ];
        edges = [
          { from: 0, to: 1, style: 'solid' },
          { from: 0, to: 2, style: 'solid' },
          { from: 0, to: 3, style: 'solid' },
          { from: 1, to: 2, style: 'solid' },
          { from: 1, to: 3, style: 'solid' },
          { from: 2, to: 3, style: 'solid' }
        ];
        break;

      case 'stressed-delta':
        // Same positions but node A growing slightly (transitioning to hub)
        nodes = [
          { x: centerX, y: centerY - 100, label: 'A', active: true },
          { x: centerX - 100, y: centerY + 50, label: 'B', active: true },
          { x: centerX + 100, y: centerY + 50, label: 'C', active: true },
          { x: centerX, y: centerY + 80, label: 'D', active: true }
        ];
        edges = [
          { from: 0, to: 1, style: 'solid' },
          { from: 0, to: 2, style: 'solid' },
          { from: 0, to: 3, style: 'solid' },
          { from: 1, to: 2, style: 'dashed' }, // Peripheral edges weakening
          { from: 1, to: 3, style: 'dashed' },
          { from: 2, to: 3, style: 'dashed' }
        ];
        break;

      case 'positive-wye':
        // A at center, B/C/D in triangle around it
        nodes = [
          { x: centerX, y: centerY, label: 'A', active: true }, // HUB
          { x: centerX - 90, y: centerY - 90, label: 'B', active: true },
          { x: centerX + 90, y: centerY - 90, label: 'C', active: true },
          { x: centerX, y: centerY + 110, label: 'D', active: true }
        ];
        edges = [
          { from: 0, to: 1, style: 'solid' },
          { from: 0, to: 2, style: 'solid' },
          { from: 0, to: 3, style: 'solid' }
          // No peripheral edges (all through hub)
        ];
        break;

      case 'hub-failure':
        // A fading, connections breaking
        nodes = [
          { x: centerX, y: centerY, label: 'A', active: false, fading: true }, // Hub dying
          { x: centerX - 90, y: centerY - 90, label: 'B', active: true },
          { x: centerX + 90, y: centerY - 90, label: 'C', active: true },
          { x: centerX, y: centerY + 110, label: 'D', active: true }
        ];
        edges = [
          { from: 0, to: 1, style: 'breaking' },
          { from: 0, to: 2, style: 'breaking' },
          { from: 0, to: 3, style: 'breaking' }
        ];
        break;

      case 'negative-wye':
        // A gone, B/C/D isolated with broken connections pointing to where A was
        nodes = [
          { x: centerX - 90, y: centerY - 90, label: 'B', active: true },
          { x: centerX + 90, y: centerY - 90, label: 'C', active: true },
          { x: centerX, y: centerY + 110, label: 'D', active: true }
        ];
        // Draw ghost of A
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, nodeRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.restore();
        // No edges (all broken)
        break;

      case 'reformation':
        // B/C/D forming new direct connections (VPI active)
        nodes = [
          { x: centerX - 90, y: centerY - 90, label: 'B', active: true },
          { x: centerX + 90, y: centerY - 90, label: 'C', active: true },
          { x: centerX, y: centerY + 110, label: 'D', active: true }
        ];
        edges = [
          { from: 0, to: 1, style: 'forming' },
          { from: 0, to: 2, style: 'forming' },
          { from: 1, to: 2, style: 'forming' }
        ];
        // Ghost memorial of A
        ctx.save();
        ctx.globalAlpha = 0.15;
        ctx.beginPath();
        ctx.arc(centerX, centerY - 50, nodeRadius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = '#64748b';
        ctx.fill();
        ctx.restore();
        break;

      case 'new-delta':
        // New stable triangle (K₃) or square with new 4th
        nodes = [
          { x: centerX - 90, y: centerY - 90, label: 'B', active: true },
          { x: centerX + 90, y: centerY - 90, label: 'C', active: true },
          { x: centerX, y: centerY + 110, label: 'D', active: true },
          { x: centerX, y: centerY - 50, label: "A'", active: true } // New 4th or memorial
        ];
        edges = [
          { from: 0, to: 1, style: 'solid' },
          { from: 0, to: 2, style: 'solid' },
          { from: 1, to: 2, style: 'solid' },
          { from: 0, to: 3, style: 'solid' },
          { from: 1, to: 3, style: 'solid' },
          { from: 2, to: 3, style: 'solid' }
        ];
        break;
    }

    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      
      switch (edge.style) {
        case 'solid':
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = 3;
          ctx.setLineDash([]);
          break;
        case 'dashed':
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          break;
        case 'forming':
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3;
          ctx.setLineDash([10, 5]);
          ctx.globalAlpha = 0.3 + (prog * 0.7); // Fade in as progress increases
          break;
        case 'breaking':
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2;
          ctx.setLineDash([3, 7]);
          ctx.globalAlpha = 1 - prog; // Fade out as progress increases
          break;
      }
      
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
    });

    // Draw nodes
    nodes.forEach(node => {
      // Special handling for hub in positive-wye and stressed states
      const isHub = (currentState === 'positive-wye' || currentState === 'stressed-delta') && node.label === 'A';
      const hubGlowRadius = nodeRadius + (currentState === 'stressed-delta' ? 5 + prog * 10 : 15);
      
      if (isHub && currentState === 'positive-wye') {
        // Hub glow
        const gradient = ctx.createRadialGradient(node.x, node.y, nodeRadius, node.x, node.y, hubGlowRadius);
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.8)');
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, hubGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (isHub && currentState === 'stressed-delta') {
        // Stressed hub (subtle glow starting)
        const gradient = ctx.createRadialGradient(node.x, node.y, nodeRadius, node.x, node.y, hubGlowRadius);
        gradient.addColorStop(0, 'rgba(234, 179, 8, 0.3)');
        gradient.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, hubGlowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, Math.PI * 2);
      
      if (node.fading) {
        // Fading node
        ctx.fillStyle = '#1e293b';
        ctx.globalAlpha = 1 - prog;
        ctx.fill();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.globalAlpha = 1;
      } else if (!node.active) {
        // Inactive node
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.stroke();
      } else if (isHub) {
        // Hub node
        ctx.fillStyle = currentState === 'positive-wye' ? '#3b82f6' : '#eab308';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        // Normal active node
        ctx.fillStyle = '#475569';
        ctx.fill();
        ctx.strokeStyle = currentState === 'reformation' ? '#f59e0b' : '#94a3b8';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Node label
      if (!node.fading || prog < 0.5) {
        ctx.fillStyle = node.active ? '#fff' : '#64748b';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = node.fading ? 1 - prog : 1;
        ctx.fillText(node.label, node.x, node.y);
        ctx.globalAlpha = 1;
      }
    });
  };

  useEffect(() => {
    if (!isPlaying) return;

    const duration = 2000 / speed; // 2 seconds per state at speed=1
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const stateProgress = Math.min(elapsed / duration, 1);
      
      setProgress(stateProgress);

      if (stateProgress >= 1) {
        // Move to next state
        const currentIndex = stateSequence.indexOf(state);
        const nextIndex = (currentIndex + 1) % stateSequence.length;
        setState(stateSequence[nextIndex]);
        startTime = Date.now();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, state, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawJitterbug(ctx, state, progress);
  }, [state, progress, size]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setState('stable-delta');
    setProgress(0);
    setIsPlaying(false);
  };

  const stateInfo = getStateDescription(state);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="bg-slate-900 rounded-lg border border-slate-700"
        />
      </div>

      {/* State Info */}
      {showLabels && (
        <div 
          className="w-full max-w-md p-4 rounded-lg border-2 transition-colors"
          style={{ 
            borderColor: stateInfo.color,
            backgroundColor: `${stateInfo.color}20`
          }}
        >
          <h3 className="font-bold text-white mb-1">{stateInfo.title}</h3>
          <p className="text-sm text-slate-300">{stateInfo.description}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handlePlayPause}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Play
            </>
          )}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Progress indicator */}
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>State Progress</span>
          <span>{Math.round(progress * 100)}%</span>
        </div>
        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full transition-all duration-100"
            style={{ 
              width: `${progress * 100}%`,
              backgroundColor: stateInfo.color
            }}
          />
        </div>
      </div>

      {/* State sequence */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2">
        {stateSequence.map((s, i) => {
          const isCurrent = s === state;
          const isPast = stateSequence.indexOf(s) < stateSequence.indexOf(state);
          return (
            <div
              key={s}
              className={`flex-shrink-0 px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                isCurrent 
                  ? 'bg-blue-600 text-white' 
                  : isPast
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-slate-800 text-slate-500'
              }`}
              onClick={() => {
                setState(s);
                setProgress(0);
                setIsPlaying(false);
              }}
            >
              {s.split('-').map(w => w.charAt(0).toUpperCase()).join('')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
