"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const SceneContent = dynamic(() => import('./components/Scene'), { ssr: false });
// const SceneContent = dynamic(() => import('./components/scrollProj/scollScene'), { ssr: false });

export default function Home() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <SceneContent />
    </div>
  );
}