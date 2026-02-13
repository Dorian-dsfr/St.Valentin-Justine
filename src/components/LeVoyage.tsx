import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlaneIcon } from 'lucide-react';
import { playWhoosh, playShimmer } from '../hooks/useSoundEffects';
gsap.registerPlugin(ScrollTrigger);
export function LeVoyage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  // Track sound checkpoints to avoid spamming
  const soundCheckpoints = useRef({
    25: false,
    50: false,
    75: false
  });
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;
      const length = path.getTotalLength();
      // Set initial state
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length
      });
      // Animate path drawing
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
          onEnter: () => playWhoosh(),
          onUpdate: (self) => {
            // Move plane along path
            const progress = self.progress;
            const point = path.getPointAtLength(progress * length);
            // Calculate rotation
            // Look slightly ahead to get angle
            const nextPoint = path.getPointAtLength(
              Math.min((progress + 0.01) * length, length)
            );
            const angle =
            Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * 180 /
            Math.PI;
            if (planeRef.current) {
              gsap.set(planeRef.current, {
                x: point.x,
                y: point.y,
                rotation: angle + 45 // Adjust for icon orientation
              });
            }
            // Sound checkpoints
            const p = Math.floor(progress * 100);
            if (p > 25 && !soundCheckpoints.current[25]) {
              playShimmer(0.6);
              soundCheckpoints.current[25] = true;
            }
            if (p > 50 && !soundCheckpoints.current[50]) {
              playShimmer(0.8);
              soundCheckpoints.current[50] = true;
            }
            if (p > 75 && !soundCheckpoints.current[75]) {
              playShimmer(1.0);
              soundCheckpoints.current[75] = true;
            }
          }
        }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full bg-noir overflow-hidden flex items-center justify-center">

      <div className="absolute inset-0 opacity-20">
        {/* Abstract Map Background - Simplified SVG for visual effect */}
        <svg width="100%" height="100%" className="w-full h-full object-cover">
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse">

            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#333"
              strokeWidth="0.5" />

          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Decorative continents/shapes */}
          <path
            d="M100,200 Q400,100 600,300 T900,200"
            fill="none"
            stroke="#222"
            strokeWidth="2" />

          <path
            d="M-100,400 Q300,500 500,400 T1100,500"
            fill="none"
            stroke="#222"
            strokeWidth="2" />

        </svg>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto h-[60vh]">
        <h2 className="absolute top-0 left-8 font-serif text-4xl md:text-6xl text-gold z-20">
          Le Voyage
        </h2>

        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 1000 600"
          preserveAspectRatio="xMidYMid meet">

          {/* Flight Path */}
          <path
            ref={pathRef}
            d="M100,300 C250,100 400,500 600,300 S900,100 900,300"
            fill="none"
            stroke="#C9A94E"
            strokeWidth="2"
            className="drop-shadow-[0_0_5px_rgba(201,169,78,0.5)]" />


          {/* Start Point */}
          <circle
            cx="100"
            cy="300"
            r="4"
            fill="#8B0000"
            stroke="#C9A94E"
            strokeWidth="2" />

          <text
            x="100"
            y="330"
            fill="#C9A94E"
            textAnchor="middle"
            className="font-serif text-sm">

            Paris
          </text>

          {/* End Point */}
          <circle
            cx="900"
            cy="300"
            r="4"
            fill="#8B0000"
            stroke="#C9A94E"
            strokeWidth="2" />

          <text
            x="900"
            y="330"
            fill="#C9A94E"
            textAnchor="middle"
            className="font-serif text-sm">

            L'île Maurice
          </text>
        </svg>

        {/* Plane Icon */}
        <div
          ref={planeRef}
          className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 text-gold pointer-events-none">

          <PlaneIcon className="w-full h-full drop-shadow-lg" />
        </div>
      </div>
    </section>);

}