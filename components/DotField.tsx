"use client";

import { useEffect, useRef } from "react";

type DotFieldProps = {
  dotRadius?: number;
  dotSpacing?: number;
  cursorRadius?: number;
  cursorForce?: number;
  bulgeOnly?: boolean;
  bulgeStrength?: number;
  sparkle?: boolean;
  waveAmplitude?: number;
  dotColor?: string;
};

type Dot = {
  x: number;
  y: number;
  phase: number;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export default function DotField({
  dotRadius = 1.5,
  dotSpacing = 14,
  cursorRadius = 500,
  cursorForce = 0.1,
  bulgeOnly = true,
  bulgeStrength = 67,
  sparkle = false,
  waveAmplitude = 0,
  dotColor = "#fff",
}: DotFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;
    let dots: Dot[] = [];
    let width = 0;
    let height = 0;
    let targetPointerX = 0;
    let targetPointerY = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerActive = false;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const columns = Math.ceil(width / dotSpacing) + 2;
      const rows = Math.ceil(height / dotSpacing) + 2;
      const offsetX = (width - (columns - 1) * dotSpacing) / 2;
      const offsetY = (height - (rows - 1) * dotSpacing) / 2;

      dots = Array.from({ length: columns * rows }, (_, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);

        return {
          x: offsetX + column * dotSpacing,
          y: offsetY + row * dotSpacing,
          phase: Math.random() * Math.PI * 2,
        };
      });

      if (!pointerActive) {
        targetPointerX = width / 2;
        targetPointerY = height / 2;
        pointerX = targetPointerX;
        pointerY = targetPointerY;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerActive = true;
      targetPointerX = event.clientX;
      targetPointerY = event.clientY;
    };

    const onPointerLeave = () => {
      pointerActive = false;
      targetPointerX = width / 2;
      targetPointerY = height / 2;
    };

    const draw = (time: number) => {
      pointerX += (targetPointerX - pointerX) * 0.12;
      pointerY += (targetPointerY - pointerY) * 0.12;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#000";
      context.fillRect(0, 0, width, height);

      for (const dot of dots) {
        const dx = dot.x - pointerX;
        const dy = dot.y - pointerY;
        const distance = Math.hypot(dx, dy);
        const influence = clamp(1 - distance / cursorRadius, 0, 1);
        const easedInfluence = influence * influence * (3 - 2 * influence);
        const angle = Math.atan2(dy, dx);
        const wave = waveAmplitude ? Math.sin(time * 0.0016 + dot.phase) * waveAmplitude : 0;
        const push = easedInfluence * bulgeStrength * (bulgeOnly ? 1 : cursorForce);
        const x = dot.x + Math.cos(angle) * push + wave;
        const y = dot.y + Math.sin(angle) * push + wave;
        const sparkleAlpha = sparkle ? Math.sin(time * 0.003 + dot.phase) * 0.18 : 0;
        const alpha = clamp(0.24 + easedInfluence * 0.58 + sparkleAlpha, 0.12, 0.95);
        const radius = dotRadius + easedInfluence * dotRadius * 1.85;

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fillStyle = dotColor;
        context.globalAlpha = alpha;
        context.fill();
      }

      context.globalAlpha = 1;
      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [
    bulgeOnly,
    bulgeStrength,
    cursorForce,
    cursorRadius,
    dotRadius,
    dotSpacing,
    dotColor,
    sparkle,
    waveAmplitude,
  ]);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-black" aria-hidden />;
}
