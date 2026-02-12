import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  playWarmTone,
  playCelebration,
  playPop,
  playHeartbeat } from
'../hooks/useSoundEffects';
export function Fin() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerExplosionRef = useRef<() => void>(() => {});
  const [saidYes, setSaidYes] = useState(false);
  const [noBtnState, setNoBtnState] = useState<{
    isRunning: boolean;
    top: string;
    left: string;
  }>({
    isRunning: false,
    top: 'auto',
    left: 'auto'
  });
  const isInView = useInView(containerRef, {
    once: true,
    amount: 0.5
  });
  // Play heartbeat when section comes into view
  useEffect(() => {
    if (isInView) {
      playHeartbeat();
    }
  }, [isInView]);
  // Canvas & Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
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
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      life: number;
      decay: number;
      constructor(x: number, y: number, forceMultiplier = 1) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 15 + 5;
        const angle = Math.random() * Math.PI * 2;
        const speed = (Math.random() * 3 + 2) * forceMultiplier;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = Math.sin(angle) * speed;
        this.color = Math.random() > 0.5 ? '#8B0000' : '#C9A94E';
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.99;
      }
      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        // Draw Heart Shape
        ctx.beginPath();
        const topCurveHeight = this.size * 0.3;
        ctx.moveTo(this.x, this.y + topCurveHeight);
        // top left curve
        ctx.bezierCurveTo(
          this.x,
          this.y,
          this.x - this.size / 2,
          this.y,
          this.x - this.size / 2,
          this.y + topCurveHeight
        );
        // bottom left curve
        ctx.bezierCurveTo(
          this.x - this.size / 2,
          this.y + (this.size + topCurveHeight) / 2,
          this.x,
          this.y + (this.size + topCurveHeight) / 2,
          this.x,
          this.y + this.size
        );
        // bottom right curve
        ctx.bezierCurveTo(
          this.x,
          this.y + (this.size + topCurveHeight) / 2,
          this.x + this.size / 2,
          this.y + (this.size + topCurveHeight) / 2,
          this.x + this.size / 2,
          this.y + topCurveHeight
        );
        // top right curve
        ctx.bezierCurveTo(
          this.x + this.size / 2,
          this.y,
          this.x,
          this.y,
          this.x,
          this.y + topCurveHeight
        );
        ctx.fill();
        ctx.restore();
      }
    }
    let particles: Particle[] = [];
    let animationFrameId: number;
    // Expose explosion trigger
    triggerExplosionRef.current = () => {
      for (let i = 0; i < 300; i++) {
        particles.push(new Particle(width / 2, height / 2, 1.5));
      }
    };
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p, index) => {
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          particles.splice(index, 1);
        }
      });
      // Continuous gentle emission if said yes
      if (saidYes && Math.random() < 0.3) {
        particles.push(new Particle(Math.random() * width, -20));
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [saidYes]);
  const handleNoHover = () => {
    playPop();
    // Calculate random position within 10-90% of container to keep it visible
    const randomTop = Math.floor(Math.random() * 80) + 10;
    const randomLeft = Math.floor(Math.random() * 80) + 10;
    setNoBtnState({
      isRunning: true,
      top: `${randomTop}%`,
      left: `${randomLeft}%`
    });
  };
  const handleYesClick = () => {
    playCelebration();
    setSaidYes(true);
    triggerExplosionRef.current();
  };
  const handleRestart = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full bg-noir flex flex-col items-center justify-center overflow-hidden px-4">

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none" />


      <AnimatePresence mode="wait">
        {!saidYes ?
        <motion.div
          key="question"
          initial={{
            opacity: 0,
            scale: 0.9
          }}
          whileInView={{
            opacity: 1,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 1.1,
            filter: 'blur(10px)'
          }}
          transition={{
            duration: 1
          }}
          className="z-10 flex flex-col items-center text-center w-full max-w-4xl">

            <motion.h2
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2,
              duration: 1
            }}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-gold mb-12 leading-tight">

              Veux-tu être ma Valentine cette année…
              <br />
              <span className="text-crimson italic text-3xl md:text-5xl mt-4 block">
                et toutes les suivantes ?
              </span>
            </motion.h2>

            <div className="relative w-full h-32 flex justify-center items-center gap-8 md:gap-16">
              {/* OUI Button */}
              <motion.button
              onClick={handleYesClick}
              onMouseEnter={() => playWarmTone()}
              whileHover={{
                scale: 1.1,
                boxShadow: '0 0 25px rgba(201,169,78,0.4)'
              }}
              whileTap={{
                scale: 0.95
              }}
              className="relative px-8 py-3 md:px-12 md:py-4 bg-transparent border-2 border-gold text-gold font-serif text-xl md:text-2xl uppercase tracking-widest hover:bg-gold hover:text-noir transition-colors duration-300 rounded-sm group">

                <span className="relative z-10">Oui</span>
                <div className="absolute inset-0 bg-gold/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Heartbeat effect */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crimson opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-crimson"></span>
                </span>
              </motion.button>

              {/* NON Button - The Escape Artist */}
              <motion.button
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoHover}
              animate={{
                position: noBtnState.isRunning ? 'absolute' : 'relative',
                top: noBtnState.isRunning ? noBtnState.top : 'auto',
                left: noBtnState.isRunning ? noBtnState.left : 'auto'
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 20
              }}
              className="px-8 py-3 md:px-12 md:py-4 bg-transparent border border-gold/30 text-gold/50 font-serif text-xl md:text-2xl uppercase tracking-widest cursor-not-allowed"
              style={{
                zIndex: 20 // Ensure it stays on top to catch hovers
              }}>

                Non
              </motion.button>
            </div>
          </motion.div> :

        <motion.div
          key="success"
          initial={{
            opacity: 0,
            scale: 0.8
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
          className="z-10 text-center">

            <h2 className="font-serif text-5xl md:text-7xl text-gold mb-8 drop-shadow-[0_0_15px_rgba(201,169,78,0.5)]">
              Eh bha voila je le savais..
            </h2>
            <p className="font-serif text-2xl md:text-3xl text-crimson italic mb-12">
              Maintenant t'es obligé de resté hahahaha.
            </p>

            <motion.button
            onClick={handleRestart}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              delay: 2,
              duration: 1
            }}
            className="text-gold/50 hover:text-gold text-sm uppercase tracking-[0.3em] border-b border-transparent hover:border-gold transition-all duration-300 pb-1">

              Recommencer
            </motion.button>
          </motion.div>
        }
      </AnimatePresence>
    </section>);

}