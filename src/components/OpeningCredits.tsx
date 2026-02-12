import React, { useEffect, useRef, Children } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { playShimmer } from '../hooks/useSoundEffects';
export function OpeningCredits() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start']
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const title = 'Saint-Valentin';
  const subtitle = "Une histoire d'amour";
  // Sound effect scheduling
  useEffect(() => {
    const timeoutIds: number[] = [];
    const startDelay = 500; // 0.5s initial delay matching containerVariants
    const stagger = 150; // 0.15s stagger matching containerVariants
    // Schedule shimmers for the title letters
    // Play every 2nd letter to avoid overwhelming
    title.split('').forEach((_, index) => {
      if (index % 2 === 0) {
        const id = window.setTimeout(
          () => {
            // Vary pitch slightly based on position
            const pitch = 0.8 + index / title.length * 0.4;
            playShimmer(pitch);
          },
          startDelay + index * stagger
        );
        timeoutIds.push(id);
      }
    });
    return () => {
      timeoutIds.forEach((id) => clearTimeout(id));
    };
  }, []);
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5
      }
    }
  };
  const letterVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: 'blur(10px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };
  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-noir">

      <motion.div
        style={{
          opacity,
          scale
        }}
        className="z-10 text-center px-4">

        <motion.h1
          className="font-serif text-5xl md:text-8xl lg:text-9xl text-gold mb-6 tracking-widest uppercase"
          variants={containerVariants}
          initial="hidden"
          animate="visible">

          {title.split('').map((char, index) =>
          <motion.span
            key={index}
            variants={letterVariants}
            className="inline-block">

              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          )}
        </motion.h1>

        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            delay: 2.5,
            duration: 2,
            ease: 'easeOut'
          }}
          className="mt-8">

          <p className="font-body text-xl md:text-3xl text-gold/80 italic tracking-widest">
            {subtitle}
          </p>
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-crimson to-transparent mx-auto mt-6" />
        </motion.div>
      </motion.div>

      {/* Cinematic vignette overlay */}
      <div className="absolute inset-0 bg-vignette pointer-events-none z-0" />

      {/* Scroll indicator */}
      <motion.div
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 0.5
        }}
        transition={{
          delay: 4,
          duration: 1
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">

        <span className="text-xs text-gold/50 uppercase tracking-[0.2em]">
          Commencer
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-gold/50 to-transparent" />
      </motion.div>
    </section>);

}