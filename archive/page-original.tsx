// Archived: Original starfield page. Copied from app/page-original.tsx for safekeeping.
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Node { x:number; y:number; targetX:number; targetY:number; vx:number; vy:number }
interface Particle { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; size:number; hueOffset:number }

export default function PageOriginalArchive() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  useEffect(() => { /* archived starfield content removed to avoid duplication */ }, []);
  return null;
}
