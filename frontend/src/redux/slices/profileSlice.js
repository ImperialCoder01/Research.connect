import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
  error: null
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfile(state, action) {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateProfileSuccess(state, action) {
      state.profile = { ...state.profile, ...action.payload };
    },
    setProfileLoading(state, action) {
      state.loading = action.payload;
    },
    setProfileError(state, action) {
      state.error = action.payload;
      state.loading = false;
    }
  }
});

export const {
  setProfile,
  updateProfileSuccess,
  setProfileLoading,
  setProfileError
} = profileSlice.actions;

export default profileSlice.reducer;
