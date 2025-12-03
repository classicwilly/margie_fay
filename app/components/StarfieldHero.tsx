 'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface Node {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hueOffset: number;
}

export default function StarfieldHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = Math.min(canvas.width, canvas.height) / 400;
    let time = 0;
    const CYCLE_TIME = 32;
    const SPRING_TENSION = 0.012;
    const DAMPING = 0.94;
    const PARTICLE_DRAG = 0.002;
    const NODE_PULSE_FREQ = 1 / CYCLE_TIME;
    const NODE_PULSE_AMPLITUDE = 0.12;
    const ROTATION_SPEED = (Math.PI * 2) / CYCLE_TIME;
    const TRIANGLE_HEIGHT = 120 * scale;

    const nodes: Node[] = [
      { x: centerX, y: centerY, targetX: centerX, targetY: centerY, vx: 0, vy: 0 },
      { x: centerX, y: centerY, targetX: centerX, targetY: centerY, vx: 0, vy: 0 },
      { x: centerX, y: centerY, targetX: centerX, targetY: centerY, vx: 0, vy: 0 },
      { x: centerX, y: centerY, targetX: centerX, targetY: centerY, vx: 0, vy: 0 },
    ];

    const PARTICLE_COUNT = 2000;
    const PARTICLE_VELOCITY_MAX = 0.5;
    const particles: Particle[] = [];
    const nodeSpacing = Math.min(canvas.width, canvas.height) * 0.35;
    const k4Nodes = [
      { x: centerX, y: centerY - nodeSpacing },
      { x: centerX - nodeSpacing * 0.866, y: centerY + nodeSpacing * 0.5 },
      { x: centerX + nodeSpacing * 0.866, y: centerY + nodeSpacing * 0.5 },
      { x: centerX, y: centerY },
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const targetNode = k4Nodes[i % 4];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * Math.max(canvas.width, canvas.height) * 1.5;
      particles.push({
        x: targetNode.x + Math.cos(angle) * distance,
        y: targetNode.y + Math.sin(angle) * distance,
        vx: (Math.random() - 0.5) * PARTICLE_VELOCITY_MAX,
        vy: (Math.random() - 0.5) * PARTICLE_VELOCITY_MAX,
        life: Math.random() * 0.7 + 0.3,
        maxLife: 1,
        size: Math.random() * 2 + 0.3,
        hueOffset: Math.random() * 360,
      });
    }

    let animationFrame = 0;
    const clamp255 = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
    const drawGlow = (x: number, y: number, radius: number, rVal: number, gVal: number, bVal: number, alpha: number) => {
      const rC = clamp255(rVal);
      const gC = clamp255(gVal);
      const bC = clamp255(bVal);
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      // center small alpha; mid slightly smaller; outer fades to 0
      gradient.addColorStop(0, `rgba(${rC}, ${gC}, ${bC}, ${Math.min(alpha, 0.45)})`);
      gradient.addColorStop(0.35, `rgba(${rC}, ${gC}, ${bC}, ${Math.min(alpha * 0.6, 0.32)})`);
      gradient.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    };

    const animate = () => {
      time += 0.016;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const t = (time % CYCLE_TIME) / CYCLE_TIME;
      const oscillation = Math.sin(t * Math.PI * 2);
      const centerOscillation = Math.sin(t * Math.PI * 8);
      const centerAlpha = Math.max(0, centerOscillation);
      const colorMix = (centerOscillation + 1) / 2;
      const r = Math.round(168 * (1 - colorMix) + 59 * colorMix);
      const g = Math.round(85 * (1 - colorMix) + 130 * colorMix);
      const b = Math.round(247 * (1 - colorMix) + 246 * colorMix);
      const baseColor = `rgb(${r}, ${g}, ${b})`;

      // nodes target rotation
      const rotationAngle = time * ROTATION_SPEED;
      const angle1 = rotationAngle;
      const angle2 = rotationAngle + (2 * Math.PI / 3);
      const angle3 = rotationAngle + (4 * Math.PI / 3);

      nodes[0].targetX = canvas.width / 2;
      nodes[0].targetY = canvas.height / 2;
      nodes[1].targetX = canvas.width / 2 + Math.sin(angle1) * TRIANGLE_HEIGHT;
      nodes[1].targetY = canvas.height / 2 - Math.cos(angle1) * TRIANGLE_HEIGHT;
      nodes[2].targetX = canvas.width / 2 + Math.sin(angle2) * TRIANGLE_HEIGHT;
      nodes[2].targetY = canvas.height / 2 - Math.cos(angle2) * TRIANGLE_HEIGHT;
      nodes[3].targetX = canvas.width / 2 + Math.sin(angle3) * TRIANGLE_HEIGHT;
      nodes[3].targetY = canvas.height / 2 - Math.cos(angle3) * TRIANGLE_HEIGHT;

      nodes.forEach(node => {
        const dx = node.targetX - node.x;
        const dy = node.targetY - node.y;
        node.vx += dx * SPRING_TENSION;
        node.vy += dy * SPRING_TENSION;
        node.vx *= DAMPING;
        node.vy *= DAMPING;
        node.x += node.vx;
        node.y += node.vy;
      });

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= PARTICLE_DRAG;
        if (p.life <= 0) {
          const nodeIndex = Math.floor(Math.random() * 4);
          const targetNode = nodes[nodeIndex];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * Math.max(canvas.width, canvas.height) * 1.5;
            p.life = 1;
          p.x = targetNode.x + Math.cos(angle) * distance;
          p.y = targetNode.y + Math.sin(angle) * distance;
        }
      });

      // softer, less-intense core glow
      drawGlow(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) * 0.22, r, g, b, 0.06);

      particles.forEach(p => {
        const hue = (p.hueOffset + time * 10) % 360;
          const alpha = p.life * 0.4; // softer particles
        ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      nodes.forEach((node, i) => {
        const nodeAlpha = i === 0 ? centerAlpha : 1;
        let baseSize = i === 0 ? 24 * scale * centerAlpha : 16 * scale * (1 + (1 - centerAlpha) * 0.3);
        const nodeSize = baseSize * (1 + Math.sin(time * NODE_PULSE_FREQ * Math.PI * 2) * NODE_PULSE_AMPLITUDE);
        // reduced outer radius and lower alpha to make glow softer
        drawGlow(node.x, node.y, nodeSize * 5, r, g, b, Math.max(0.06, 0.25 * nodeAlpha));
        const innerR = clamp255(r * 1.1);
        const innerG = clamp255(g * 1.1);
        const innerB = clamp255(b * 1.1);
        const midR = clamp255(r);
        const midG = clamp255(g);
        const midB = clamp255(b);
        const outerR = clamp255(r * 0.85);
        const outerG = clamp255(g * 0.85);
        const outerB = clamp255(b * 0.85);
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize);
        gradient.addColorStop(0, `rgba(${innerR}, ${innerG}, ${innerB}, ${Math.min(nodeAlpha * 0.75, 0.9)})`);
        gradient.addColorStop(0.5, `rgba(${midR}, ${midG}, ${midB}, ${Math.min(nodeAlpha * 0.6, 0.7)})`);
        gradient.addColorStop(1, `rgba(${outerR}, ${outerG}, ${outerB}, ${Math.min(nodeAlpha * 0.45, 0.55)})`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, Math.max(1, nodeSize), 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push('/hub');
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Open the Hub"
      onKeyDown={handleKeyDown}
      onClick={() => router.push('/hub')}
      className="absolute inset-0"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
