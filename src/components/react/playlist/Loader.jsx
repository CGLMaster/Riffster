import React, { useState, useEffect } from 'react';
import wolfImage from '@/assets/gif/loading_wolf_riffter.gif';

export default function Loader() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + "." : "");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img src={wolfImage.src} alt="Wolf" className="w-100 h-100 mb-4" />
      <h2 className="text-xl font-bold">Cargando{dots}</h2>
    </div>
  );
}