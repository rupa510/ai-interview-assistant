import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
};

const candidatesSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    addCandidate: (state, action) => {
      state.list.push(action.payload);
    },
    updateCandidate: (state, action) => {
      const idx = state.list.findIndex(c => c.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = action.payload;
      }
    },
    deleteCandidate: (state, action) => {
      // Remove by id
      state.list = state.list.filter(c => c.id !== action.payload);
    },
    setCandidates: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { addCandidate, updateCandidate, deleteCandidate, setCandidates } = candidatesSlice.actions;
export default candidatesSlice.reducer;
