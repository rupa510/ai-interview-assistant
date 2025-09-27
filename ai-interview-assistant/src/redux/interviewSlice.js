import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Current candidate info and answers
  current: {
    profile: {},
    questions: [],
    answers: [],
    scores: [],
    progress: 0,
    timing: {},
    status: 'idle', // or 'in-progress', 'paused', 'complete'
    missingFields: [],
    chatHistory: [],
    summary: '',
    startTime: null,
  },
};

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.current.profile = action.payload;
    },
    setQuestions: (state, action) => {
      state.current.questions = action.payload;
    },
    addChat: (state, action) => {
      state.current.chatHistory.push(action.payload);
    },
    setAnswers: (state, action) => {
      state.current.answers = action.payload;
    },
    setScores: (state, action) => {
      state.current.scores = action.payload;
    },
    setSummary: (state, action) => {
      state.current.summary = action.payload;
    },
    setProgress: (state, action) => {
      state.current.progress = action.payload;
    },
    setTiming: (state, action) => {
      state.current.timing = action.payload;
    },
    setStatus: (state, action) => {
      state.current.status = action.payload;
    },
    setMissingFields: (state, action) => {
      state.current.missingFields = action.payload;
    },
    setStartTime: (state, action) => {
      state.current.startTime = action.payload;
    },
    resetInterview: (state) => {
      state.current = initialState.current;
    }
  },
});

export const {
  setProfile,
  setQuestions,
  addChat,
  setAnswers,
  setScores,
  setSummary,
  setProgress,
  setTiming,
  setStatus,
  setMissingFields,
  setStartTime,
  resetInterview
} = interviewSlice.actions;
export default interviewSlice.reducer;
