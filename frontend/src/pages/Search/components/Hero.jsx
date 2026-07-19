import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Search } from 'lucide-react';
import { fadeUp, fadeIn } from './animations';

const PHRASES = [
  "MILLIONS OF PUBLICATIONS",
  "TOP GLOBAL RESEARCHERS",
  "INNOVATIVE PROJECTS",
  "YOUR NEXT COLLABORATION",
  "GROUNDBREAKING RESEARCH"
];

const Hero = ({ children }) => {
  const reduce = useReducedMotion();
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (reduce) {
      setText(PHRASES[0]);
      return;
    }

    const currentPhrase = PHRASES[phraseIndex];
    let timeout;

    if (isDeleting) {
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        }
      }, 40); // Deleting speed
    } else {
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + 1));
        if (text.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 2500); // Pause before deleting
        }
      }, 70); // Typing speed
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex, reduce]);

  return (
    <div className="pt-6 pb-2 max-w-[1400px] mx-auto">
      <div className="flex flex-col gap-2 sm:gap-4">
        <motion.div
          variants={fadeIn(reduce, 0.1)}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 text-slate-900"
        >
          <div className="flex items-center gap-2 sm:gap-4">
            <motion.div 
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="bg-blue-600 p-2 sm:p-4 rounded-lg sm:rounded-2xl text-white shadow-lg shadow-blue-600/20">
                <Search className="w-5 h-5 sm:w-8 sm:h-8" />
              </div>
            </motion.div>
            
            <h1 className="text-[22px] leading-none sm:text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 tracking-tight flex-1">
              DISCOVER
            </h1>
          </div>
        </motion.div>

        <motion.div
          variants={fadeIn(reduce, 0.2)}
          initial="hidden"
          animate="show"
          className="h-[1.75rem] sm:h-[4rem] md:h-[5rem] lg:h-[6rem] flex items-center"
        >
          <h2 className="text-[18px] sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-tight text-blue-600 uppercase relative" aria-live="polite">
            {text}
            <span
              className="absolute -right-2 sm:-right-3 top-0.5 sm:top-2 bottom-0.5 sm:bottom-2 w-[2px] sm:w-[5px] bg-blue-600 rounded-full"
              style={{ animation: 'gs-blink 1s step-start infinite' }}
              aria-hidden="true"
            />
          </h2>
        </motion.div>
      </div>

      <div className="mt-4 sm:mt-8">{children}</div>
    </div>
  );
};

export default Hero;
