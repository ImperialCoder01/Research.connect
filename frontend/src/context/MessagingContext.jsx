import { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import messagesService from '../modules/messaging/services/messages.service';
import { eventBus } from '../services/eventBus';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
// ─── Context ─────────────────────────────────────────────────────────────────
const MessagingContext = createContext(null);

export function MessagingProvider({ children }) {
  const { user } = useAuth();
  const currentUserId = user?._id || user?.id || user?.userId || 'user-me';
  const currentUserName = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'You';
  const currentUserAvatar = user?.profileImage || user?.avatarUrl || 'https://ui-avatars.com/api/?name=You';

  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState(new Map());          // convId → Message[]
  const [messagesMeta, setMessagesMeta] = useState(new Map()); // convId → {page,hasMore,isLoadingMore,isLoading}
  const [typingUsers, setTypingUsers] = useState(new Map());   // convId → Set<userId>
  const [onlineUsers, setOnlineUsers] = useState(new Set(['user-me', 'user-sarah']));
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockedUsers, setBlockedUsers] = useState(new Set());

  // Ek ref bana ke rakho taaki SocketContext aasaani se read kar sake
  const activeConvIdRef = useRef(null);
  useEffect(() => { activeConvIdRef.current = activeConversationId; }, [activeConversationId]);

  // Typing auto-clear timers: key = `${convId}:${userId}`
  const typingTimersRef = useRef(new Map());

  // ── Purani chats (conversations) load karo ─────────────────────────────────────────────────────
  const loadConversations = useCallback(async () => {
    setIsLoadingConversations(true);
    try {
      const res = await messagesService.getConversations();
      // res is { success, message, data, error } because of our interceptor, wait...
      // the axios interceptor returns response.data directly.
      // So res = { success: true, data: [...] }
      setConversations(res.data || []);
    } catch {
      toast.error('Failed to load conversations');
    } finally {
      setIsLoadingConversations(false);
    }
  }, []);

  // Load conversations on mount
  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const createConversation = useCallback(async (participantId) => {
    const res = await messagesService.createConversation(participantId);
    const conversation = res.data;
    setConversations((prev) => [
      conversation,
      ...prev.filter((item) => item._id !== conversation._id),
    ]);
    setActiveConversationId(conversation._id);
    setMessages((prev) => {
      const next = new Map(prev);
      if (!next.has(conversation._id)) next.set(conversation._id, []);
      return next;
    });
    setMessagesMeta((prev) => {
      const next = new Map(prev);
      if (!next.has(conversation._id)) {
        next.set(conversation._id, { cursor: null, hasMore: false, isLoadingMore: false, isLoading: false });
      }
      return next;
    });
    return conversation;
  }, []);

  // ── Koi chat select karo ─────────────────────────────────────────────────
  const selectConversation = useCallback(async (convId) => {
    setActiveConversationId(convId);

    if (!convId) return;

    // Unread count zero (0) kar do
    setConversations((prev) =>
      prev.map((c) => (c._id === convId ? { ...c, unreadCount: 0 } : c))
    );
    messagesService.markAsRead(convId).catch(() => { });

    // Agar pehle se load nahi hain toh messages laao
    if (!messages.has(convId)) {
      setMessagesMeta((prev) => {
        const next = new Map(prev);
        next.set(convId, { cursor: null, hasMore: false, isLoadingMore: false, isLoading: true });
        return next;
      });
      try {
        const res = await messagesService.getMessages(convId, { limit: 20 });
        const { docs: msgs, hasNextPage, nextCursor } = res.data;
        setMessages((prev) => {
          const next = new Map(prev);
          next.set(convId, [...msgs]); // chronological order from backend
          return next;
        });
        setMessagesMeta((prev) => {
          const next = new Map(prev);
          next.set(convId, { cursor: nextCursor, hasMore: hasNextPage, isLoadingMore: false, isLoading: false });
          return next;
        });
      } catch {
        toast.error('Failed to load messages');
        setMessagesMeta((prev) => {
          const next = new Map(prev);
          next.set(convId, { cursor: null, hasMore: false, isLoadingMore: false, isLoading: false });
          return next;
        });
      }
    }
  }, [messages]);

  // ── Purane messages load karo (Infinite scroll) ─────────────────────────────────
  const loadMoreMessages = useCallback(async (convId) => {
    const meta = messagesMeta.get(convId);
    if (!meta || !meta.hasMore || meta.isLoadingMore) return;

    setMessagesMeta((prev) => {
      const next = new Map(prev);
      next.set(convId, { ...meta, isLoadingMore: true });
      return next;
    });

    try {
      const res = await messagesService.getMessages(convId, { limit: 20, cursor: meta.cursor });
      const { docs: olderMsgs, hasNextPage, nextCursor } = res.data;
      setMessages((prev) => {
        const next = new Map(prev);
        next.set(convId, [...olderMsgs, ...(prev.get(convId) || [])]);
        return next;
      });
      setMessagesMeta((prev) => {
        const next = new Map(prev);
        next.set(convId, { cursor: nextCursor, hasMore: hasNextPage, isLoadingMore: false, isLoading: false });
        return next;
      });
    } catch {
      toast.error('Failed to load older messages');
      setMessagesMeta((prev) => {
        const next = new Map(prev);
        next.set(convId, { ...meta, isLoadingMore: false });
        return next;
      });
    }
  }, [messagesMeta]);

  // ── Message bhejo (Pehle UI me dikhao, fir server pe bhejo) ────────────────────────────────────────
  const sendMessage = useCallback(async (convId, content, attachments = []) => {
    const tempId = `temp-${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      tempId,
      text: content,
      type: 'text',
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatarUrl: currentUserAvatar,
      createdAt: new Date().toISOString(),
      readAt: null,
      attachment: attachments[0] || null,
      pending: true,
    };

    // 1. Pehle apne UI me message chipka do (optimistic update)
    setMessages((prev) => {
      const next = new Map(prev);
      next.set(convId, [...(prev.get(convId) || []), tempMsg]);
      return next;
    });

    try {
      const payload = {
        conversationId: convId,
        text: content
      };
      if (attachments?.[0]?._id) {
        payload.attachmentId = attachments[0]._id;
      }

      const res = await messagesService.sendMessage(payload);
      const realMsg = res.data;

      // 2. Server se confirm hone pe purana temp message asli wale se badal do
      setMessages((prev) => {
        const next = new Map(prev);
        next.set(
          convId,
          (prev.get(convId) || []).map((m) => (m.tempId === tempId ? realMsg : m))
        );
        return next;
      });

      // 3. Bahar chat list me aakhri message update karke list ko sort kar do
      setConversations((prev) =>
        [...prev.map((c) => {
          if (c._id !== convId) return c;
          return {
            ...c,
            lastMessage: {
              text: realMsg.text,
              type: realMsg.type,
              createdAt: realMsg.createdAt,
              senderId: realMsg.senderId,
            },
            lastMessageAt: realMsg.createdAt,
            unreadCount: 0,
          };
        })].sort(
          (a, b) =>
            new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
        )
      );

      // 4. SocketContext ko batao ki auto-reply (bot wala message) shuru kare
      eventBus.emit('message:sent', { messageId: realMsg._id, convId });
    } catch (err) {
      // Send fail hone par temp message hata do
      setMessages((prev) => {
        const next = new Map(prev);
        next.set(convId, (prev.get(convId) || []).filter((m) => m.tempId !== tempId));
        return next;
      });

      toast.error('Message failed to send. Retry?', {
        id: tempId,
        duration: 4000
      });
    }
  }, []);

  // ── Naya message aane par SocketContext isko call karega ───────────────
  const appendIncomingMessage = useCallback((convId, message) => {
    setMessages((prev) => {
      const next = new Map(prev);
      next.set(convId, [...(prev.get(convId) || []), message]);
      return next;
    });
    setConversations((prev) =>
      [...prev.map((c) => {
        if (c._id !== convId) return c;
        const isActive = convId === activeConvIdRef.current;
        return {
          ...c,
          lastMessage: {
            text: message.text,
            type: message.type,
            createdAt: message.createdAt,
            senderId: message.senderId,
          },
          lastMessageAt: message.createdAt,
          unreadCount: isActive ? 0 : c.unreadCount + 1,
        };
      })].sort(
        (a, b) =>
          new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0)
      )
    );
  }, []);

  // ── Message read hone par SocketContext isko call karega ─────────────────────────────
  const updateReadReceipt = useCallback((convId, messageId, readAt) => {
    setMessages((prev) => {
      const next = new Map(prev);
      next.set(
        convId,
        (prev.get(convId) || []).map((m) =>
          m._id === messageId ? { ...m, status: 'seen' } : m
        )
      );
      return next;
    });
  }, []);

  // ── Koi type kar raha hai toh SocketContext isko call karega ─────────────────────────
  const setUserTyping = useCallback((convId, userId, isTyping) => {
    const key = `${convId}:${userId}`;
    clearTimeout(typingTimersRef.current.get(key));

    if (isTyping) {
      // Auto-clear after 3 s in case the stop event is missed
      const tid = setTimeout(() => {
        setTypingUsers((prev) => {
          const next = new Map(prev);
          const s = new Set(prev.get(convId) || []);
          s.delete(userId);
          next.set(convId, s);
          return next;
        });
      }, 3000);
      typingTimersRef.current.set(key, tid);
    } else {
      typingTimersRef.current.delete(key);
    }

    setTypingUsers((prev) => {
      const next = new Map(prev);
      const s = new Set(prev.get(convId) || []);
      if (isTyping) s.add(userId);
      else s.delete(userId);
      next.set(convId, s);
      return next;
    });
  }, []);

  // ── User online/offline hone par SocketContext isko call karega ───────────────────────────
  const setUserOnline = useCallback((userId, isOnline) => {
    setOnlineUsers((prev) => {
      const next = new Set(prev);
      if (isOnline) next.add(userId);
      else next.delete(userId);
      return next;
    });
    setConversations((prev) =>
      prev.map((c) => {
        if (c.otherParticipant && c.otherParticipant._id === userId) {
           return { ...c, otherParticipant: { ...c.otherParticipant, isOnline } };
        }
        return c;
      })
    );
  }, []);

  // ── Chat delete karo (Sirf local state se) ─────────────────────────────────────
  const deleteConversation = useCallback((convId) => {
    setConversations((prev) => prev.filter((c) => c._id !== convId));
    setMessages((prev) => {
      const next = new Map(prev);
      next.delete(convId);
      return next;
    });
    if (activeConvIdRef.current === convId) {
      setActiveConversationId(null);
    }
  }, []);

  // ── User ko block karo (Sirf local state me) ──────────────────────────────────────────────
  const toggleBlockUser = useCallback((userId) => {
    setBlockedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }, []);

  // ── Derived helpers ───────────────────────────────────────────────────────
  const activeConversation =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  const getOtherParticipant = useCallback(
    (convId) => {
      const conv = conversations.find((c) => c._id === convId);
      if (!conv) return null;
      return conv.otherParticipant ?? null;
    },
    [conversations]
  );

  return (
    <MessagingContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        messages,
        messagesMeta,
        typingUsers,
        onlineUsers,
        isLoadingConversations,
        loadConversations,
        createConversation,
        selectConversation,
        sendMessage,
        loadMoreMessages,
        appendIncomingMessage,
        updateReadReceipt,
        setUserTyping,
        setUserOnline,
        getOtherParticipant,
        searchQuery,
        setSearchQuery,
        deleteConversation,
        blockedUsers,
        toggleBlockUser,
        currentUserId,
      }}
    >
      {children}
    </MessagingContext.Provider>
  );
}

export function useMessaging() {
  const ctx = useContext(MessagingContext);
  if (!ctx) throw new Error('useMessaging must be used within MessagingProvider');
  return ctx;
}
