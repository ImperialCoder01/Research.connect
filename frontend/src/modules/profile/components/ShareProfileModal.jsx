import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Share, ExternalLink, QrCode, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ShareProfileModal = ({ isOpen, onClose, profileUrl, fullName }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const fullUrl = `${window.location.origin}${profileUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Profile link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link.');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} - Researcher Profile`,
          text: `Check out the researcher profile of ${fullName} on Research Connect.`,
          url: fullUrl
        });
        toast.success('Shared successfully!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          toast.error('Sharing failed.');
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(fullUrl)}&color=2563eb&margin=10`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl w-full max-w-sm flex flex-col shadow-2xl overflow-hidden border border-border"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-text-primary tracking-tight">Share Researcher Profile</h3>
              <p className="text-[10px] text-text-secondary font-medium">Share {fullName}'s academic profile page.</p>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-bg-page border border-border rounded-lg text-text-secondary hover:text-text-primary transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Share Content */}
          <div className="p-5 space-y-4">
            {/* Input Link Display */}
            <div className="flex items-center gap-2 p-2 border border-border bg-bg-page/10 rounded-xl">
              <input
                type="text"
                readOnly
                value={fullUrl}
                className="text-[11px] font-semibold text-text-secondary bg-transparent outline-none flex-grow overflow-hidden select-all"
              />
              <button
                onClick={handleCopyLink}
                className="p-1.5 hover:bg-bg-page rounded-lg text-primary transition-colors border border-border"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-border text-[11px] font-bold text-text-secondary hover:bg-bg-page transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Link
              </button>
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-hover shadow-sm transition-colors"
              >
                <Share className="w-3.5 h-3.5" />
                Share Profile
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => window.open(fullUrl, '_blank')}
                className="flex items-center justify-center gap-1.5 p-3 rounded-xl border border-border text-[11px] font-bold text-text-secondary hover:bg-bg-page transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Public
              </button>
              <button
                onClick={() => setShowQr(!showQr)}
                className={`flex items-center justify-center gap-1.5 p-3 rounded-xl border text-[11px] font-bold transition-all ${
                  showQr
                    ? 'border-primary/20 bg-primary/5 text-primary'
                    : 'border-border text-text-secondary hover:bg-bg-page'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                {showQr ? 'Hide QR Code' : 'Show QR Code'}
              </button>
            </div>

            {/* QR Code Container */}
            <AnimatePresence>
              {showQr && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col items-center justify-center pt-2 border-t border-border/60 overflow-hidden"
                >
                  <div className="p-3 bg-white border border-border rounded-2xl shadow-sm mt-3">
                    <img
                      src={qrCodeUrl}
                      alt="Researcher Profile QR Code"
                      className="w-40 h-40 object-contain"
                    />
                  </div>
                  <p className="text-[9px] text-text-secondary font-semibold mt-2">Scan QR Code to visit profile page</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShareProfileModal;
