"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const SceneContent = dynamic(() => import('./components/Scene'), { ssr: false });
export default function Home() {
  return (
    <div className='w-screen h-screen'>
      <SceneContent />
    </div>
  );
}