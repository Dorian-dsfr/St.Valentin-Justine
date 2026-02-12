import React, { useEffect, useRef } from 'react';
export function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();
    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      // Generate noise
      const imageData = ctx.createImageData(w, h);
      const buffer32 = new Uint32Array(imageData.data.buffer);
      const len = buffer32.length;
      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.05) {
          // 5% chance of noise pixel
          // White noise with varying opacity
          const alpha = Math.random() * 50;
          // Little endian: AABBGGRR
          buffer32[i] = alpha << 24 | 255 << 16 | 255 << 8 | 255;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      // Add some scratches occasionally
      if (Math.random() < 0.02) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
        ctx.lineWidth = Math.random() * 2;
        const x = Math.random() * w;
        ctx.moveTo(x, 0);
        ctx.lineTo(x + (Math.random() - 0.5) * 10, h);
        ctx.stroke();
      }
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-50 opacity-20 mix-blend-overlay"
      style={{
        filter: 'contrast(150%) brightness(100%)'
      }} />);


}