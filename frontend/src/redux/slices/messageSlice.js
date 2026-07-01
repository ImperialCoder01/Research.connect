import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  conversations: [
    {
      id: 'conv_1',
      type: 'one_to_one',
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      status: 'online',
      messages: [
        { senderId: 'sarah', text: 'Hi, I saw your latest paper on attention models. Excellent work!', time: '10:30 AM' },
        { senderId: 'me', text: 'Thank you Sarah! I really appreciate your feedback.', time: '10:32 AM' }
      ]
    },
    {
      id: 'conv_2',
      type: 'group',
      name: 'Quantum Chemistry Lab',
      avatar: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=150',
      messages: [
        { senderId: 'david', text: 'Did anyone get the error mitigation script to run?', time: 'Yesterday' },
        { senderId: 'elena', text: 'Yes, ZNE compiling worked well for me on 50 qubits.', time: 'Yesterday' }
      ]
    }
  ],
  activeConversationId: 'conv_1',
  chatOpen: false,
  meetingActive: false,
  meetingRoomId: ''
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    setConversations(state, action) {
      state.conversations = action.payload;
    },
    setActiveConversationId(state, action) {
      state.activeConversationId = action.payload;
    },
    sendMessage(state, action) {
      const { convId, text, senderId = 'me', attachment } = action.payload;
      const conversation = state.conversations.find(c => c.id === convId);
      if (conversation) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        conversation.messages.push({ senderId, text, time, attachment });
      }
    },
    setChatOpen(state, action) {
      state.chatOpen = action.payload;
    },
    toggleMeeting(state, action) {
      state.meetingActive = action.payload;
    },
    setMeetingRoomId(state, action) {
      state.meetingRoomId = action.payload;
    }
  }
});

export const {
  setConversations,
  setActiveConversationId,
  sendMessage,
  setChatOpen,
  toggleMeeting,
  setMeetingRoomId
} = messageSlice.actions;

export default messageSlice.reducer;
