import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communities: [
    { id: 'c1', name: 'AI Safety Research Network', members: 420 },
    { id: 'c2', name: 'Quantum Cryptography Alliance', members: 185 },
    { id: 'c3', name: 'Open Science Advocates', members: 1200 }
  ],
  collaborationRequests: [
    { id: 'cr1', senderName: 'David Chen', type: 'project', targetName: 'AcuITY Assessment Project', time: '2 hours ago' },
    { id: 'cr2', senderName: 'Elena Rostova', type: 'coauthor', targetName: 'Attention multi-modal Search Paper', time: 'Yesterday' }
  ],
  coAuthorRequests: [],
  loading: false
};

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    setCommunities(state, action) {
      state.communities = action.payload;
    },
    setCollaborationRequests(state, action) {
      state.collaborationRequests = action.payload;
    },
    removeRequest(state, action) {
      state.collaborationRequests = state.collaborationRequests.filter(r => r.id !== action.payload);
    },
    addCommunity(state, action) {
      state.communities.push(action.payload);
    }
  }
});

export const {
  setCommunities,
  setCollaborationRequests,
  removeRequest,
  addCommunity
} = communitySlice.actions;

export default communitySlice.reducer;
