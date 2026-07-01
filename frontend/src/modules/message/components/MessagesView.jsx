import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  sendMessage, setChatOpen, setActiveConversationId, 
  toggleMeeting, setMeetingRoomId 
} from '../../../redux/slices/messageSlice';
import { 
  Send, X, Paperclip, FileText, Video, Phone, 
  MoreVertical, CheckCheck, Smile, Sparkles, AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const MessagesView = () => {
  const dispatch = useDispatch();
  const { conversations, activeConversationId, chatOpen, meetingActive, meetingRoomId } = useSelector((state) => state.message);
  
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  
  const activeConversation = conversations.find(c => c.id === activeConversationId) || conversations[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (chatOpen) {
      scrollToBottom();
    }
  }, [chatOpen, activeConversation?.messages?.length]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(sendMessage({
      convId: activeConversation.id,
      text
    }));
    setText('');
    scrollToBottom();
  };

  const attachPublication = () => {
    dispatch(sendMessage({
      convId: activeConversation.id,
      text: 'Shared a Publication: "Attention Is All You Need for Deep Multi-Modal Search Optimization"',
      attachment: {
        title: 'Attention Is All You Need for Deep Multi-Modal Search Optimization',
        type: 'pdf'
      }
    }));
    toast.success('Publication attached!');
    scrollToBottom();
  };

  const handleStartCall = () => {
    dispatch(toggleMeeting(true));
    dispatch(setMeetingRoomId(`meeting_${Math.floor(Math.random() * 9000) + 1000}`));
  };

  if (!chatOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col transition-colors duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 text-left">
        <div className="flex items-center gap-3">
          <img 
            src={activeConversation?.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"} 
            alt="Chat avatar" 
            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-850"
          />
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{activeConversation?.name}</h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <button 
            onClick={handleStartCall}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Start Video Meeting"
          >
            <Video className="w-4.5 h-4.5" />
          </button>
          <button 
            onClick={() => dispatch(setChatOpen(false))}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Conversations Selection List (if multiple) */}
      <div className="flex gap-2 p-2 border-b border-slate-100 dark:border-slate-800 overflow-x-auto bg-slate-50/20">
        {conversations.map(c => (
          <button
            key={c.id}
            onClick={() => dispatch(setActiveConversationId(c.id))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              c.id === activeConversationId
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeConversation?.messages.map((msg, idx) => {
          const isMe = msg.senderId === 'me';
          return (
            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} text-left`}>
              <div 
                className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {msg.text}
                
                {/* Embedded Publication Attachment */}
                {msg.attachment && (
                  <div className="mt-2.5 p-3 rounded-xl bg-black/10 dark:bg-white/10 border border-white/10 flex items-start gap-2.5">
                    <FileText className="w-6 h-6 text-white/80" />
                    <div>
                      <h4 className="font-bold text-[11px] leading-tight text-white">{msg.attachment.title}</h4>
                      <p className="text-[9px] text-white/60 mt-0.5">Attached Publication (PDF)</p>
                      <button 
                        onClick={() => toast.success('Opening attached publication')}
                        className="text-[9px] font-black text-white underline hover:opacity-85 mt-2.5 block"
                      >
                        Open Paper
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-slate-400 mt-1 flex items-center gap-1 px-1">
                {msg.time} {isMe && <CheckCheck className="w-3 h-3 text-blue-500" />}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Video Call Modal (Simulated) */}
      <AnimatePresence>
        {meetingActive && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl p-6 text-center text-slate-900"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-6">
                <h3 className="text-sm font-black uppercase tracking-wider text-indigo-650 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Virtual Video Meeting
                </h3>
                <span className="text-xs bg-slate-105 px-3 py-1 rounded-full text-slate-600 font-bold">Room ID: {meetingRoomId}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 h-64 mb-6">
                <div className="bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=180" alt="Self" className="w-full h-full object-cover" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/75 text-white px-2 py-0.5 rounded-full font-bold">You (Dr. Miller)</span>
                </div>
                <div className="bg-slate-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <img src={activeConversation?.avatar} alt="Peer" className="w-full h-full object-cover animate-pulse" />
                  <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/75 text-white px-2 py-0.5 rounded-full font-bold">{activeConversation?.name}</span>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => { dispatch(toggleMeeting(false)); toast.success('Meeting finished.'); }}
                  className="bg-red-650 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-all shadow-md active:scale-[0.98]"
                >
                  End Meeting
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
        <button 
          type="button" 
          onClick={attachPublication}
          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-500 transition-colors"
          title="Share Publication"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        <input
          type="text"
          placeholder="Type message here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 text-left"
        />
        <button 
          type="submit" 
          className="p-2 rounded-xl bg-blue-600 hover:bg-blue-750 text-white transition-all active:scale-95 shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

export default MessagesView;
