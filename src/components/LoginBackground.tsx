"use client";

import { useEffect, useRef } from "react";

const DOT_COUNT = 6;
const DOT_RADIUS = 4;
const SPEED = 0.25; // px/frame — 천천히
const MAX_DIST = 320; // 이 거리 안이면 선으로 연결
const DOT_ALPHA = 0.14;
const LINE_ALPHA = 0.1;

type Dot = { x: number; y: number; vx: number; vy: number };

export default function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dots: Dot[] = [];
    let raf = 0;

    const darkMq = window.matchMedia("(prefers-color-scheme: dark)");
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // 점/선 색상의 RGB 채널 (라이트: 검정 계열, 다크: 흰색 계열)
    let rgb = darkMq.matches ? "255,255,255" : "0,0,0";
    const updateColor = () => {
      rgb = darkMq.matches ? "255,255,255" : "0,0,0";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initDots = () => {
      dots = Array.from({ length: DOT_COUNT }, () => {
        const angle = Math.random() * Math.PI * 2;
        return {
          x: DOT_RADIUS + Math.random() * (width - 2 * DOT_RADIUS),
          y: DOT_RADIUS + Math.random() * (height - 2 * DOT_RADIUS),
          vx: Math.cos(angle) * SPEED,
          vy: Math.sin(angle) * SPEED,
        };
      });
    };

    const update = () => {
      for (const d of dots) {
        d.x += d.vx;
        d.y += d.vy;
        // 벽에 부딪히면 튕김
        if (d.x <= DOT_RADIUS) {
          d.x = DOT_RADIUS;
          d.vx = Math.abs(d.vx);
        } else if (d.x >= width - DOT_RADIUS) {
          d.x = width - DOT_RADIUS;
          d.vx = -Math.abs(d.vx);
        }
        if (d.y <= DOT_RADIUS) {
          d.y = DOT_RADIUS;
          d.vy = Math.abs(d.vy);
        } else if (d.y >= height - DOT_RADIUS) {
          d.y = height - DOT_RADIUS;
          d.vy = -Math.abs(d.vy);
        }
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 모선 (가까울수록 진하게)
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < MAX_DIST) {
            const a = (1 - dist / MAX_DIST) * LINE_ALPHA;
            ctx.strokeStyle = `rgba(${rgb},${a})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      // 점
      ctx.fillStyle = `rgba(${rgb},${DOT_ALPHA})`;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      update();
      render();
      raf = requestAnimationFrame(loop);
    };

    resize();
    initDots();

    if (reduceMq.matches) {
      render(); // 모션 최소화: 정적 1프레임
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      initDots();
      if (reduceMq.matches) render();
    };

    window.addEventListener("resize", onResize);
    darkMq.addEventListener("change", updateColor);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      darkMq.removeEventListener("change", updateColor);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    />
  );
}
