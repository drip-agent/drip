"use client";

import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  showConnections?: boolean;
}

const PALETTE = ["#bdfffd", "#9ffff5", "#7cffc4"];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  opacity: number;
}

function getAdaptiveConfig(width: number) {
  if (width >= 1024) return { count: 80, dprCap: 2 };
  if (width >= 768) return { count: 40, dprCap: 1.5 };
  return { count: 20, dprCap: 1 };
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -(Math.random() * 0.3 + 0.2),
    radius: Math.random() * 1.5 + 0.5,
    color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    opacity: Math.random() * 0.3 + 0.1,
  };
}

export function ParticleField({
  className,
  particleCount,
  showConnections = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const configRef = useRef({ count: 80, dprCap: 2 });

  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const config = getAdaptiveConfig(width);
    const dpr = Math.min(window.devicePixelRatio, config.dprCap);

    configRef.current = config;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    const count = particleCount ?? config.count;
    particlesRef.current = Array.from({ length: count }, () =>
      createParticle(width, height)
    );

    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log(`Particles: ${count} @ ${dpr}x`);
    }
  }, [particleCount]);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const particles = particlesRef.current;

    ctx.clearRect(0, 0, width, height);

    // Update + draw particles
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }

    // Draw connections
    if (showConnections) {
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const lineOpacity = (1 - dist / 150) * 0.1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = PALETTE[0];
            ctx.globalAlpha = lineOpacity;
            ctx.stroke();
          }
        }
      }
    }

    ctx.globalAlpha = 1;
    animationRef.current = requestAnimationFrame(render);
  }, [showConnections]);

  useEffect(() => {
    if (prefersReduced) return;

    initCanvas();

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, [prefersReduced, initCanvas, render]);

  // Reduced-motion fallback: static CSS gradient
  if (prefersReduced) {
    return (
      <div
        className={cn(
          "fixed inset-0 -z-10 gradient-radial-glow",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("fixed inset-0 -z-10 pointer-events-none", className)}
      aria-hidden="true"
    />
  );
}
