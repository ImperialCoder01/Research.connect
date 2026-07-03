import React, { useState } from 'react';
import { Check, Copy, Linkedin, Link2 } from 'lucide-react';
import Modal from '../../../components/common/modals/Modal';
import Button from '../../../components/common/buttons/Button';
import { LEVEL_STYLES } from '../constants/achievements.constants';

/**
 * AchievementShareModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Share an achievement via copy-link or LinkedIn.
 * Reuses existing Modal and Button — zero new UI primitives.
 *
 * Rules-of-Hooks: useState is always called before any conditional logic.
 * The Modal is always rendered (with isOpen) so AnimatePresence can play the
 * close animation even after achievement becomes null on modal close.
 */
const AchievementShareModal = ({ isOpen, onClose, achievement }) => {
  // useState called unconditionally — satisfies React Rules of Hooks
  const [copied, setCopied] = useState(false);

  // Derive values safely — fall back gracefully when achievement is null
  const shareUrl   = achievement?.credentialUrl ?? '';
  const levelStyle = achievement ? LEVEL_STYLES[achievement.level] : null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Clipboard API fallback for older browsers
      const el = document.createElement('textarea');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLinkedIn = () => {
    if (!achievement) return;
    const summary = `I earned the "${achievement.title}" achievement from ${achievement.organization}!`;
    const url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(achievement.title)}&summary=${encodeURIComponent(summary)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Achievement" size="sm">
      {/* Content guard — only render when achievement data is present */}
      {achievement && levelStyle && (
        <>
          {/* Achievement preview strip */}
          <div className="flex items-center gap-3 p-4 bg-bg-page border border-border rounded-xl mb-5">
            <img
              src={achievement.image}
              alt={achievement.title}
              className="w-14 h-10 object-cover rounded-lg shrink-0"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/56x40/DBEAFE/2563EB?text=Ach'; }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-semibold text-text-primary truncate">{achievement.title}</p>
                <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${levelStyle.badge}`}>
                  {levelStyle.icon} {achievement.level}
                </span>
              </div>
              <p className="text-xs text-text-secondary">{achievement.organization}</p>
            </div>
          </div>

          {/* Credential URL */}
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
            Credential URL
          </p>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-1 flex items-center gap-2 bg-bg-page border border-border rounded-lg px-3 py-2 overflow-hidden">
              <Link2 className="w-3.5 h-3.5 text-text-secondary shrink-0" />
              <span className="text-xs text-text-secondary truncate">{shareUrl}</span>
            </div>
            <Button
              variant={copied ? 'secondary' : 'primary'}
              size="sm"
              onClick={handleCopy}
              icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              className="shrink-0"
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>

          {/* Share platforms */}
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
            Share On
          </p>
          <button
            onClick={handleLinkedIn}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#0A66C2] hover:bg-[#0958a8] text-white rounded-xl transition-colors font-semibold text-sm"
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
          </button>
        </>
      )}
    </Modal>
  );
};

export default AchievementShareModal;
