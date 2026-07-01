import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: localStorage.getItem('theme') || 'light', // Light is primary design theme
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      
      const root = window.document.documentElement;
      if (action.payload === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    },
    toggleTheme(state) {
      const nextTheme = state.theme === 'light' ? 'dark' : 'light';
      themeSlice.caseReducers.setTheme(state, { payload: nextTheme });
    }
  }
});

export const { setTheme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
