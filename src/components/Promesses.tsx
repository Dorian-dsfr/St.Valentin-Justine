import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playEtherealReveal } from '../hooks/useSoundEffects';
gsap.registerPlugin(ScrollTrigger);
const promises = [
"Je promets de t'aimer chaque jour davantage",
'Je promets de toujours te faire rire',
'Je promets que chaque aventure sera la nôtre'];

export function Promesses() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      textRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.fromTo(
          el,
          {
            opacity: 0,
            y: 50,
            filter: 'blur(10px)'
          },
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
              onEnter: () => playEtherealReveal(0.8 + i * 0.2)
            }
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);
  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-noir flex flex-col items-center justify-center py-32 px-4 space-y-32">

      <div className="text-center mb-16">
        <h2 className="font-serif text-sm tracking-[0.3em] text-gold/50 uppercase">
          Promesses
        </h2>
      </div>

      {promises.map((promise, index) =>
      <div
        key={index}
        className="relative max-w-4xl mx-auto text-center group">

          <h3
          ref={(el) => textRefs.current[index] = el}
          className="font-serif text-3xl md:text-5xl lg:text-6xl text-gray-200 leading-tight">

            {promise}
          </h3>

          {index < promises.length - 1 &&
        <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-gold/30 to-transparent mx-auto mt-16" />
        }
        </div>
      )}
    </section>);

}