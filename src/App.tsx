import React from 'react';
import { FilmGrain } from './components/FilmGrain';
import { HeartCursor } from './components/HeartCursor';
import { MusicToggle } from './components/MusicToggle';
import { OpeningCredits } from './components/OpeningCredits';
import { NotreHistoire } from './components/NotreHistoire';
import { LeVoyage } from './components/LeVoyage';
import { LettreAmour } from './components/LettreAmour';
import { NosMoments } from './components/NosMoments';
import { Promesses } from './components/Promesses';
import { Fin } from './components/Fin';
export function App() {
  return (
    <main className="bg-noir min-h-screen w-full text-gold selection:bg-crimson selection:text-white overflow-x-hidden">
      {/* Global Effects */}
      <FilmGrain />
      <HeartCursor />
      <MusicToggle />

      {/* Content Sections */}
      <div className="relative z-10">
        <OpeningCredits />
        <NotreHistoire />
        <LeVoyage />
        <LettreAmour />
        <NosMoments />
        <Promesses />
        <Fin />
      </div>
    </main>);

}