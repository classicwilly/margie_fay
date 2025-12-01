'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VertexType, VERTEX_COLORS } from '../types/vertex';

interface TetrahedronVisualizationProps {
  activeVertex: VertexType;
  size?: number;
}

export default function TetrahedronVisualization({
  activeVertex,
  size = 300
}: TetrahedronVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ x: 0.3, y: 0.5 });
  const animationRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tetrahedron vertices in 3D space (centered)
    const vertices3D = [
      { x: 0, y: -1, z: 0, type: 'technical' as VertexType },     // Top
      { x: -0.866, y: 0.5, z: -0.5, type: 'emotional' as VertexType },  // Front-left
      { x: 0.866, y: 0.5, z: -0.5, type: 'practical' as VertexType },   // Front-right
      { x: 0, y: 0.5, z: 0.866, type: 'philosophical' as VertexType },  // Back
    ];

    // Edges connecting vertices
    const edges = [
      [0, 1], [0, 2], [0, 3], // From top
      [1, 2], [1, 3], [2, 3], // Base
    ];

    const animate = () => {
      // Auto-rotate slowly
      setRotation(prev => ({
        x: prev.x,
        y: prev.y + 0.005,
      }));

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Apply rotation and projection
      const rotatedVertices = vertices3D.map(v => {
        // Rotate around Y axis
        const cosY = Math.cos(rotation.y);
        const sinY = Math.sin(rotation.y);
        const x1 = v.x * cosY - v.z * sinY;
        const z1 = v.x * sinY + v.z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(rotation.x);
        const sinX = Math.sin(rotation.x);
        const y1 = v.y * cosX - z1 * sinX;
        const z2 = v.y * sinX + z1 * cosX;

        // Project to 2D (simple perspective)
        const scale = 120;
        const distance = 4;
        const factor = scale / (distance + z2);

        return {
          x: size / 2 + x1 * factor,
          y: size / 2 + y1 * factor,
          z: z2,
          type: v.type,
        };
      });

      // Sort vertices by z-depth for proper rendering
      const sortedIndices = rotatedVertices
        .map((v, i) => ({ index: i, z: v.z }))
        .sort((a, b) => a.z - b.z)
        .map(item => item.index);

      // Draw edges with glow effect
      edges.forEach(([i, j]) => {
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
        className="cursor-grab active:cursor-grabbing"
        style={{ touchAction: 'none' }}
      />
      <p className="text-xs text-slate-500 mt-2">
        Interactive 3D Tetrahedron
      </p>
    </div>
  );
}
