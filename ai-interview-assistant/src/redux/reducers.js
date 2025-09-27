import { combineReducers } from 'redux';
import interviewSlice from './interviewSlice';
import candidatesSlice from './candidatesSlice';

const rootReducer = combineReducers({
  interview: interviewSlice,
  candidates: candidatesSlice,
});

export default rootReducer;
