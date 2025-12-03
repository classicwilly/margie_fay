'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VertexType, VERTEX_COLORS } from '../types/vertex';
import { 
  TETRAHEDRON_VERTICES, 
  TETRAHEDRON_EDGES,
  rotate3D,
  project,
  type Point3D
} from '@/lib/geometry/sacred-geometry';

interface TetrahedronVisualizationProps {
  activeVertex: VertexType;
  size?: number;
}

export default function TetrahedronVisualization({
  activeVertex,
  size = 300
}: TetrahedronVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5, z: 0 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Map tetrahedron vertices to vertex types
    // Using precise mathematical coordinates from sacred-geometry
    const vertexTypes: VertexType[] = [
      'technical',      // Vertex 0: (1, 1, 1)
      'emotional',      // Vertex 1: (-1, -1, 1)
      'practical',      // Vertex 2: (-1, 1, -1)
      'philosophical',  // Vertex 3: (1, -1, -1)
    ];

    const animate = () => {
      // Auto-rotate slowly
      setRotation(prev => ({
        ...prev,
        y: prev.y + 0.005,
      }));

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Apply 3D rotation using sacred geometry functions
      const rotatedVertices = TETRAHEDRON_VERTICES.map((v, i) => {
        const rotated = rotate3D(v, rotation.x, rotation.y, rotation.z);
        const projected = project(rotated, 4, size / 4);
        
        return {
          x: size / 2 + projected.x,
          y: size / 2 + projected.y,
          z: rotated.z,
          type: vertexTypes[i],
        };
      });

      // Sort vertices by z-depth for proper rendering (back to front)
      const sortedIndices = rotatedVertices
        .map((v, i) => ({ index: i, z: v.z }))
        .sort((a, b) => a.z - b.z)
        .map(item => item.index);

      // Draw edges with glow effect using sacred geometry edge definitions
      TETRAHEDRON_EDGES.forEach(([i, j]) => {
        const v1 = rotatedVertices[i];
        const v2 = rotatedVertices[j];

        // Glow layer
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.strokeStyle = '#3B82F640';
        ctx.lineWidth = 6;
        ctx.stroke();

        // Main edge
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.strokeStyle = '#64748B';
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // Draw vertices (back to front)
      sortedIndices.forEach(i => {
        const v = rotatedVertices[i];
        const isActive = v.type === activeVertex;
        const color = VERTEX_COLORS[v.type].main;

        // Glow effect for active vertex
        if (isActive) {
          ctx.beginPath();
          const gradient = ctx.createRadialGradient(v.x, v.y, 0, v.x, v.y, 30);
          gradient.addColorStop(0, color + 'CC');
          gradient.addColorStop(0.5, color + '44');
          gradient.addColorStop(1, color + '00');
          ctx.fillStyle = gradient;
          ctx.arc(v.x, v.y, 30, 0, Math.PI * 2);
          ctx.fill();
        }

        // Vertex circle
        ctx.beginPath();
        ctx.arc(v.x, v.y, isActive ? 16 : 12, 0, Math.PI * 2);
        ctx.fillStyle = isActive ? color : '#475569';
        ctx.fill();
        ctx.strokeStyle = isActive ? '#FFFFFF' : '#64748B';
        ctx.lineWidth = isActive ? 3 : 2;
        ctx.stroke();

        // Inner circle for active
        if (isActive) {
          ctx.beginPath();
          ctx.arc(v.x, v.y, 8, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.fill();
        }
      });

      // Draw labels below vertices
      rotatedVertices.forEach(v => {
        const isActive = v.type === activeVertex;
        ctx.font = isActive ? 'bold 12px sans-serif' : '11px sans-serif';
        ctx.fillStyle = isActive ? VERTEX_COLORS[v.type].main : '#94A3B8';
        ctx.textAlign = 'center';
        ctx.fillText(
          v.type.charAt(0).toUpperCase() + v.type.slice(1),
          v.x,
          v.y + 30
        );
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [activeVertex, rotation.x, rotation.y, size]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="cursor-grab active:cursor-grabbing touch-none"
      />
      <p className="text-xs text-slate-500 mt-2">
        Interactive 3D Tetrahedron
      </p>
    </div>
  );
}
