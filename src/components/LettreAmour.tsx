import React, { useEffect, useRef, Children } from 'react';
import { motion, useInView } from 'framer-motion';
import { playPaperUnfold } from '../hooks/useSoundEffects';
export function LettreAmour() {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-100px'
  });
  // Play sound when letter comes into view
  useEffect(() => {
    if (isInView) {
      playPaperUnfold();
    }
  }, [isInView]);
  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.5,
        staggerChildren: 0.5
      }
    }
  };
  const textVariants = {
    hidden: {
      opacity: 0,
      filter: 'blur(5px)'
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 1.5,
        ease: 'easeOut'
      }
    }
  };
  return (
    <section className="min-h-screen w-full bg-noir flex items-center justify-center py-24 px-4 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?q=80&w=2563&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />

      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        className="relative z-10 max-w-2xl w-full bg-amber-tint backdrop-blur-md border border-gold/20 p-8 md:p-16 rounded-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">

        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        <div className="text-center mb-12">
          <motion.h2
            variants={textVariants}
            className="font-serif text-4xl text-gold mb-4">

            Lettre
          </motion.h2>
          <motion.div
            variants={textVariants}
            className="w-12 h-[1px] bg-crimson mx-auto" />

        </div>

        <div className="font-body text-xl md:text-2xl text-gray-200 leading-relaxed space-y-8 text-justify">
          <motion.p variants={textVariants}>Ma chérie,</motion.p>

          <motion.p variants={textVariants}>
            Je te rassure je vais pas être cucu, car tu n'aimes pas ça.
            Je vais être clair pour tu puisses t'imprégner de cette lettre.
            Tu le sais surement déjà, même enfoui sous de nombreuses peurs,
            mais ma place est avec toi.
          </motion.p>

          <motion.p variants={textVariants}>
            Ma lettre n'est pas faite pour te rassurer, je l'écris pour que tu réalises quelque chose.
            Je suis un homme qui vit à travers ses objectifs, quoi qu'il arrive,
            je les atteins, c'est une de mes plus grandes forces. Ce que je veux dire par la,
            c'est que, depuis quelques mois j'ai un nouvel objectif.
            Mais celui la a quelque chose de différent.
          </motion.p>

          <motion.p variants={textVariants}>
            Cette objectif je ne veux pas l'atteindre, tu sais pourquoi ?
            Car je ne veux pas de fin, je veux pouvoir sans cesse, arriver
            de plus en plus proche, mais sans jamais l'atteindre.
            Cette objectif c'est TOI, et jamais j'abandonnerai.
          </motion.p>

          <motion.p
            variants={textVariants}
            className="text-right mt-12 text-gold italic">

            — Dorian
          </motion.p>
        </div>

        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gold/40" />
        <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-gold/40" />
        <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-gold/40" />
        <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gold/40" />
      </motion.div>
    </section>);

}
