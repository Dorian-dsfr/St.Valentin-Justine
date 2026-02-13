import React, { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { playShimmer } from '../hooks/useSoundEffects'
gsap.registerPlugin(ScrollTrigger)
const moments = [
  {
    title: 'Le premier restaurant',
    id: 1,
  },
  {
    title: 'Fin d'aprem devant le lac',
    id: 2,
  },
  {
    title: "Journée à l'Escalade",
    id: 3,
  },
  {
    title: 'La vie à deux',
    id: 4,
  },
  {
    title: 'Les rires',
    id: 5,
  },
  {
    title: 'Les cries 👀',
    id: 6,
  },
]
export function NosMoments() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        {
          y: 100,
          opacity: 0,
          rotateX: -15,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: {
            each: 0.2,
            onStart: function () {
              // @ts-ignore - 'this' refers to the tween of the individual element
              const index = this.targets()[0].dataset.index
              playShimmer(0.8 + Number(index) * 0.1)
            },
          },
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])
  return (
    <section
      ref={sectionRef}
      className="min-h-screen w-full bg-noir py-32 px-4"
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl md:text-6xl text-gold text-center mb-24">
          Nos Moments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {moments.map((moment, index) => (
            <div
              key={moment.id}
              ref={(el) => (cardsRef.current[index] = el)}
              data-index={index}
              className="group relative aspect-[3/4] bg-neutral-900 border border-gold/10 overflow-hidden cursor-none"
            >
              {/* Placeholder Image Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 via-neutral-900 to-black transition-transform duration-700 group-hover:scale-110" />

              {/* Gold Accent Overlay */}
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10">
                <div className="w-full h-full border border-gold/20 flex flex-col items-center justify-center p-4 transition-all duration-500 group-hover:border-gold/60">
                  <h3 className="font-serif text-2xl text-gray-300 group-hover:text-gold transition-colors duration-300">
                    {moment.title}
                  </h3>
                  <div className="w-0 h-[1px] bg-crimson mt-4 transition-all duration-500 group-hover:w-12" />
                </div>
              </div>

              {/* Shine Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
