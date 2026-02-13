import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playWhoosh, playShimmer } from '../hooks/useSoundEffects';
gsap.registerPlugin(ScrollTrigger);
const milestones = [
{
  year: '15 oct 2023',
  title: 'Le premier message',
  desc: "Le jour de ton anniversaire"
},
{
  year: '28 aout 2025',
  title: 'Notre première rencontre',
  desc: "J'ai direct su que tu étais différente"
},
{
  year: '17 sept 2025',
  title: 'Nos au-revoir',
  desc: "Le moment qu'on redoutait le plus"
},
{
  year: 'juillet 2026',
  title: "Les retrouvailles ( bientôt )",
  desc: "J'annonce : le plus beau moment de 2026"
}];

export function NotreHistoire() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Animate the vertical line drawing down
      gsap.fromTo(
        lineRef.current,
        {
          height: 0
        },
        {
          height: '100%',
          duration: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top center',
            end: 'bottom center',
            scrub: 1
          }
        }
      );
      // Animate items appearing
      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: i % 2 === 0 ? -50 : 50
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
              end: 'bottom 20%',
              toggleActions: 'play none none reverse',
              onEnter: () => {
                playWhoosh();
                // Slight delay for the shimmer on the text
                setTimeout(() => playShimmer(1 + i * 0.1), 200);
              }
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
      className="relative min-h-screen w-full bg-noir py-32 px-4 overflow-hidden">

      <div className="max-w-4xl mx-auto relative">
        <h2 className="font-serif text-4xl md:text-6xl text-gold text-center mb-24 tracking-wider">
          Notre Histoire
        </h2>

        {/* Central Timeline Line */}
        <div className="absolute left-1/2 top-32 bottom-0 w-[1px] bg-gold/20 -translate-x-1/2">
          <div
            ref={lineRef}
            className="w-full bg-gradient-to-b from-gold via-crimson to-gold" />

        </div>

        <div className="space-y-32 relative">
          {milestones.map((milestone, index) =>
          <div
            key={index}
            ref={(el) => itemsRef.current[index] = el}
            className={`flex items-center justify-between w-full ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>

              {/* Content Side */}
              <div
              className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>

                <span className="font-serif text-5xl text-gold/20 block mb-2">
                  {milestone.year}
                </span>
                <h3 className="font-serif text-2xl text-gold mb-2">
                  {milestone.title}
                </h3>
                <p className="font-body text-xl text-gray-400 italic">
                  {milestone.desc}
                </p>
              </div>

              {/* Center Dot */}
              <div className="w-2/12 flex justify-center relative">
                <div className="w-4 h-4 rounded-full bg-noir border-2 border-gold z-10 shadow-[0_0_15px_rgba(201,169,78,0.5)]">
                  <div className="w-full h-full rounded-full bg-crimson opacity-0 hover:opacity-100 transition-opacity duration-500" />
                </div>
              </div>

              {/* Empty Side for balance */}
              <div className="w-5/12" />
            </div>
          )}
        </div>
      </div>
    </section>);

}