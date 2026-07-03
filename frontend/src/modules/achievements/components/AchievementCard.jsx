import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Building2, Tag, Pin, Share2, ExternalLink } from 'lucide-react';
import { LEVEL_STYLES } from '../constants/achievements.constants';
import Button from '../../../components/common/buttons/Button';

/**
 * AchievementCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Individual achievement card. All fields:
 *   Cover image · Title · Organization · Date · Category · Level badge ·
 *   Skills · Points · View · Share · Pin/Unpin
 *
 * Props:
 *   achievement  — one item from MOCK_ACHIEVEMENTS
 *   onShare      — callback(achievement) → opens share modal
 *   isPinned     — boolean from pinnedIds set
 *   onTogglePin  — callback(id) → toggles pin state
 */
const AchievementCard = ({ achievement, onShare, isPinned, onTogglePin }) => {
  const [imgError, setImgError] = useState(false);
  const levelStyle = LEVEL_STYLES[achievement.level];

  const formattedDate = new Date(achievement.dateEarned).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: `0 16px 36px rgba(0,0,0,0.11)` }}
      className={`bg-bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col group ${levelStyle.glow}`}
    >
      {/* ── Cover Image ──────────────────────────────────────────────────────── */}
      <div className="relative h-40 overflow-hidden shrink-0">
        {!imgError ? (
          <img
            src={achievement.image}
            alt={achievement.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${levelStyle.gradient}`}>
            <span className="text-6xl select-none">{levelStyle.icon}</span>
          </div>
        )}

        {/* Level badge — top-left */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${levelStyle.badge}`}>
          {levelStyle.icon} {achievement.level}
        </span>

        {/* Pin indicator — top-right */}
        {isPinned && (
          <span className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center bg-white/90 backdrop-blur-xs rounded-full shadow-sm">
            <Pin className="w-3.5 h-3.5 text-primary" style={{ fill: 'currentColor' }} />
          </span>
        )}
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="p-5 flex flex-col flex-1 gap-3">

        {/* Category + Points */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-light-purple text-accent-indigo text-xs font-semibold">
            <Tag className="w-3 h-3" />
            {achievement.category}
          </span>
          <span className="text-xs font-bold text-text-secondary tabular-nums">
            {achievement.points} pts
          </span>
        </div>

        {/* Title */}
        <h3 className="font-bold text-text-primary text-base leading-snug line-clamp-2">
          {achievement.title}
        </h3>

        {/* Organization + Date */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
          <span className="flex items-center gap-1 truncate">
            <Building2 className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{achievement.organization}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            {formattedDate}
          </span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {achievement.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-bg-page border border-border rounded-full text-xs text-text-secondary font-medium"
            >
              {skill}
            </span>
          ))}
          {achievement.skills.length > 3 && (
            <span className="px-2 py-0.5 bg-bg-page border border-border rounded-full text-xs text-text-secondary font-medium">
              +{achievement.skills.length - 3}
            </span>
          )}
        </div>

        {/* ── Actions ──────────────────────────────────────────────────────── */}
        <div className="flex items-center gap-2 pt-3 border-t border-border">
          <Button
            variant="primary"
            size="sm"
            onClick={() => window.open(achievement.credentialUrl, '_blank', 'noopener,noreferrer')}
            icon={<ExternalLink className="w-3.5 h-3.5" />}
            className="flex-1 justify-center"
          >
            View
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onShare(achievement)}
            icon={<Share2 className="w-3.5 h-3.5" />}
            className="flex-1 justify-center"
          >
            Share
          </Button>

          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => onTogglePin(achievement.id)}
            className={`p-2 rounded-lg border transition-colors ${
              isPinned
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-border text-text-secondary hover:text-primary hover:border-primary hover:bg-light-blue'
            }`}
            title={isPinned ? 'Unpin achievement' : 'Pin achievement'}
            aria-label={isPinned ? 'Unpin achievement' : 'Pin achievement'}
          >
            <Pin
              className="w-4 h-4"
              style={isPinned ? { fill: 'currentColor' } : {}}
            />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
