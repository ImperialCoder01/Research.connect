import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  onClick,
  hoverEffect = false,
  glass = false,
  padding = 'p-6'
}) => {
  const baseStyles = 'rounded-2xl border transition-all duration-300';
  const themeStyles = glass
    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-white/20 dark:border-slate-800/50 shadow-lg'
    : 'bg-bg-card border-border shadow-sm';
  const hoverStyles = hoverEffect
    ? 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5 cursor-pointer'
    : '';

  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick
    ? {
        whileHover: { scale: 1.01 },
        whileTap: { scale: 0.99 },
        onClick
      }
    : {};

  return (
    <Component
      className={`${baseStyles} ${themeStyles} ${hoverStyles} ${padding} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Card;
