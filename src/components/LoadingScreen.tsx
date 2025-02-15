"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface LoadingScreenProps {
  setIsLoading: (value: boolean) => void;
}

export default function LoadingScreen({ setIsLoading }: LoadingScreenProps) {
  const [showEnter, setShowEnter] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEnter(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  // Create and unlock AudioContext
  useEffect(() => {
    const unlockAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }
      } catch (error) {
        console.log("Audio context initialization failed:", error);
      }
    };

    unlockAudioContext();

    // Add mouse movement handler
    const handleMouseMove = async () => {
      if (!audioRef.current || isPlaying) return;
      
      try {
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          setIsPlaying(true);
          // Remove the event listener after successful play
          document.removeEventListener('mousemove', handleMouseMove);
        }
      } catch (error) {
        console.log("Play on mouse move failed:", error);
        setIsPlaying(false);
      }
    };

    // Add mouse movement listener
    document.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isPlaying]); // Add isPlaying to dependencies

  // Modified togglePlay function
  const togglePlay = async () => {
    if (!audioRef.current) return;
    
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Toggle play error:", error);
      setIsPlaying(false);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-[100]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1, ease: "linear" }}
    >
      {/* Solid black background */}
      <div className="absolute inset-0 bg-black z-[49]" />

      {/* Fullscreen video with dramatic fade effect */}
      <motion.div 
        className="absolute inset-0 z-[50]"
        animate={{
          opacity: [0, 0.4, 0], // Reduced max opacity to keep darker
        }}
        transition={{
          duration: 0.8, // Faster transition
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.2, 1], // Quick fade in, longer fade out
        }}
      >
        <video
          src="/hologram.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover mix-blend-screen"
        />
      </motion.div>

      {/* Quick glitch overlay */}
      <motion.div
        className="absolute inset-0 bg-black z-[51]"
        animate={{
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 0.1,
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: "linear"
        }}
      />

      {/* Floating Solana Logo with Photon Link */}
      <motion.div
        className="fixed z-[52] w-[80px] h-[80px]"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [1, 0.7, 1],
          left: [
            '50%',
            `${Math.random() * 70 + 15}%`, // Random horizontal position
            '50%'
          ],
          top: [
            '50%',
            `${Math.random() * 70 + 15}%`, // Random vertical position
            '50%'
          ],
          rotate: [0, 360],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
        style={{
          position: 'fixed',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(153, 69, 255, 0.3)',
        }}
      >
        <a 
          href="https://photon-sol.tinyastro.io/en/lp/HKuJrP5tYQLbEUdjKwjgnHs2957QKjR2iWhJKTtMa1xs?handle=134697779d2600e3dd417b"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full h-full relative hover:scale-110 transition-transform duration-300"
        >
          <Image
            src="/solanalogo.png"
            alt="Solana Logo"
            fill
            className="object-contain"
            style={{
              filter: "drop-shadow(0 0 10px rgba(153, 69, 255, 0.5))"
            }}
          />
        </a>
      </motion.div>

      {/* RGB split effects - enhanced with negative blend */}
      <motion.div
        className="absolute inset-0 bg-[#FF0000]/30 mix-blend-difference z-[52]"
        animate={{
          x: ['-4%', '4%', '-4%'],
          y: ['2%', '-2%', '2%'],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 0.2,
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: "linear"
        }}
      />

      <motion.div
        className="absolute inset-0 bg-[#00FF00]/30 mix-blend-exclusion z-[53]"
        animate={{
          x: ['4%', '-4%', '4%'],
          y: ['-2%', '2%', '-2%'],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 0.15,
          repeat: Infinity,
          repeatDelay: 0.7,
          ease: "linear"
        }}
      />

      <motion.div
        className="absolute inset-0 bg-[#0000FF]/30 mix-blend-difference z-[54]"
        animate={{
          x: ['-3%', '3%', '-3%'],
          y: ['3%', '-3%', '3%'],
          opacity: [0, 0.8, 0]
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatDelay: 0.6,
          ease: "linear"
        }}
      />

      {/* Enhanced scan lines with motion */}
      <motion.div 
        className="absolute inset-0 z-[55] opacity-30"
        animate={{
          backgroundPosition: ['0 0', '0 -100%']
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 2px
          )`,
          backgroundSize: '100% 4px'
        }}
      />

      {/* Fixed Avatar Position */}
      <motion.div 
        className="fixed right-[400px] bottom-0 z-[60] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="relative w-[600px] h-[600px]">
          {/* Solana glow effect */}
          <motion.div 
            className="absolute inset-0 solana-glow-effect z-[1]"
            animate={{
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Avatar image */}
          <Image
            src="/loadingavatar.png"
            alt="Loading Avatar"
            fill
            className="object-contain relative z-[3] solana-enhanced-glow"
            priority
            sizes="600px"
            quality={75}
          />
        </div>
      </motion.div>

      {/* Enter Button */}
      <AnimatePresence>
        {showEnter && (
          <motion.button
            className="fixed z-[101] px-8 py-3 bg-transparent border border-[#FF0000] rounded-md text-[#FF0000] font-mono text-xl tracking-[0.2em] pointer-events-auto hover:bg-[#FF0000]/10 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [1, 0.7, 1],
              textShadow: [
                '0 0 10px rgba(255, 0, 0, 0.7)',
                '0 0 20px rgba(255, 0, 0, 0.5)',
                '0 0 10px rgba(255, 0, 0, 0.7)'
              ]
            }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse"
            }}
            style={{
              position: 'fixed',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 20px rgba(255, 0, 0, 0.3)',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
              left: `${Math.random() * 70 + 15}%`, // Random horizontal position
              top: `${Math.random() * 70 + 15}%`  // Random vertical position
            }}
            onClick={() => setIsLoading(false)}
          >
            ENTER AT YOUR OWN RISK
          </motion.button>
        )}
      </AnimatePresence>

      {/* Updated Audio Player - moved to top right */}
      <div className="fixed top-8 right-8 z-[101] flex items-center gap-4">
        <motion.button
          onClick={togglePlay}
          className="p-3 bg-transparent border border-white rounded-full text-white hover:bg-white/10 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isPlaying ? (
            <SpeakerWaveIcon className="w-5 h-5" />
          ) : (
            <SpeakerXMarkIcon className="w-5 h-5" />
          )}
        </motion.button>
        <audio 
          ref={audioRef}
          src="/loadingaudio.mp3"
          loop
        />
      </div>
    </motion.div>
  );
}