"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  drift: number;
  pulse: number;
};

export default function Starfield() {
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
    let stars: Star[] = [];
    let pointerX = 0;
    let pointerY = 0;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const count = Math.min(220, Math.floor((window.innerWidth * window.innerHeight) / 6500));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.2 + 0.25,
        alpha: Math.random() * 0.56 + 0.14,
        drift: Math.random() * 0.18 + 0.03,
        pulse: Math.random() * Math.PI * 2,
      }));
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerX = (event.clientX / window.innerWidth - 0.5) * 10;
      pointerY = (event.clientY / window.innerHeight - 0.5) * 10;
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.fillStyle = "#000";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);

      for (const star of stars) {
        star.y += star.drift;

        if (star.y > window.innerHeight + 4) {
          star.y = -4;
          star.x = Math.random() * window.innerWidth;
        }

        const twinkle = Math.sin(time * 0.0012 + star.pulse) * 0.18;
        const parallax = star.radius * 2.4;
        const x = star.x + pointerX * parallax;
        const y = star.y + pointerY * parallax;

        context.beginPath();
        context.arc(x, y, star.radius, 0, Math.PI * 2);
        context.fillStyle = `rgba(255, 255, 255, ${Math.max(0.08, star.alpha + twinkle)})`;
        context.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    };

    resize();
    animationFrame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-black" aria-hidden />;
}
