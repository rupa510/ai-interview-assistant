import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setAnswers,
  setScores,
  setSummary,
  setQuestions,
  setProgress,
  setStatus,
  setTiming,
  addChat,
  resetInterview,
  setProfile,
  setMissingFields,
} from '../../redux/interviewSlice';
import { addCandidate } from '../../redux/candidatesSlice';
import { generateQuestionSet, autoScoreAnswer, generateSummary } from '../../utils/ai';
import Timer from '../Timer';
import ResumeUpload from './ResumeUpload';
import WelcomeBackModal from '../WelcomeBackModal';
import { v4 as uuidv4 } from 'uuid';

function getTimeForLevel(level) {
  if (level === 'Easy') return 20;
  if (level === 'Medium') return 60;
  if (level === 'Hard') return 120;
  return 30;
}

const ChatWindow = () => {
  const interview = useSelector((state) => state.interview.current);
  const dispatch = useDispatch();

  const [chatInput, setChatInput] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);

  // Resume session on load
  useEffect(() => {
    if (interview.status === 'in-progress' || interview.status === 'paused') setShowWelcome(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missingFields = interview.missingFields || [];
  const profile = interview.profile || {};
  const questions = interview.questions || [];
  const answers = interview.answers || [];
  const progress = interview.progress || 0;
  const scores = interview.scores || [];

  // Handle chat prompt for missing fields
  const handleMissingFields = useCallback(
    (field, value) => {
      dispatch(setProfile({ ...profile, [field]: value }));
      const remaining = missingFields.filter((f) => f !== field);
      dispatch(setMissingFields(remaining));
    },
    [dispatch, profile, missingFields]
  );

  // Start the interview
  const startInterview = useCallback(() => {
    const qSet = generateQuestionSet();
    dispatch(setQuestions(qSet));
    dispatch(setStatus('in-progress'));
    dispatch(setAnswers([]));
    dispatch(setScores([]));
    dispatch(setProgress(0));
    dispatch(setTiming({}));
  }, [dispatch]);

  // Called on timer expire or manual submission
  const handleAnswerSubmit = useCallback(
    (auto = false) => {
      const allAnswers = [...answers];
      const allScores = [...scores];
      const userAnswer = auto ? '' : chatInput;
      allAnswers[progress] = userAnswer;
      const score = autoScoreAnswer(userAnswer, progress);
      allScores[progress] = score;
      dispatch(setAnswers(allAnswers));
      dispatch(setScores(allScores));
      dispatch(setProgress(progress + 1));
      setChatInput('');
      if (progress + 1 === 6) {
        // Interview is done
        const candidateObj = {
          id: uuidv4(),
          profile,
          answers: allAnswers,
          questions,
          scores: allScores,
          summary: '',
          finalScore: allScores.reduce((a, b) => a + b, 0),
        };
        candidateObj.summary = generateSummary(profile, allScores, allAnswers);
        dispatch(setSummary(candidateObj.summary));
        dispatch(setStatus('complete'));
        dispatch(addCandidate(candidateObj));
      }
    },
    [answers, scores, progress, chatInput, dispatch, profile, questions]
  );

  // When timer expires, auto-submit blank
  const autoSubmit = useCallback(() => {
    handleAnswerSubmit(true);
    // eslint-disable-next-line
  }, [handleAnswerSubmit]);

  // Render chat for missing fields
  if (missingFields.length && interview.status === 'idle') {
    const currentField = missingFields[0];
    return (
      <div className="p-3 border rounded chat-window">
        <h5>Provide your {currentField} to continue:</h5>
        <input
          className="form-control mb-2"
          value={chatInput}
          placeholder={`Enter your ${currentField}`}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && chatInput.trim()) {
              handleMissingFields(currentField, chatInput.trim());
              setChatInput('');
            }
          }}
        />
        <button
          className="btn btn-primary"
          disabled={!chatInput.trim()}
          onClick={() => {
            handleMissingFields(currentField, chatInput.trim());
            setChatInput('');
          }}
        >
          Submit
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 border rounded chat-window">
      {interview.status === 'idle' && (
        <>
          <h5>Upload Your Resume to Start</h5>
          <ResumeUpload />
          {Object.keys(profile).length === 3 && (
            <button
              className="btn btn-success my-2"
              onClick={startInterview}
              disabled={interview.questions.length > 0}
            >
              Start Interview
            </button>
          )}
        </>
      )}
      {showWelcome && (
        <WelcomeBackModal
          onClose={() => setShowWelcome(false)}
        />
      )}
      {interview.status === 'in-progress' && (
        <>
          <div>
            <div className="mb-2">
              <strong>Question {progress + 1} of 6:</strong>{' '}
              {questions[progress]?.q}
            </div>
            <Timer
              seconds={getTimeForLevel(questions[progress]?.level)}
              onExpire={autoSubmit}
            />
            <textarea
              className="form-control my-2"
              value={chatInput}
              autoFocus
              rows={2}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAnswerSubmit(false);
                }
              }}
              placeholder="Type your answer and press Enter"
            />
            <button
              className="btn btn-primary"
              onClick={() => handleAnswerSubmit(false)}
              disabled={!chatInput.trim()}
            >
              Submit
            </button>
          </div>
          <div className="mt-3">
            <strong>Your Answers so far:</strong>
            <ol>
              {answers.map((ans, i) => (
                <li key={i}>
                  <strong>{questions[i].q}</strong>
                  <div>Answer: {ans}</div>
                  <div>Score: {scores[i]}</div>
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
      {interview.status === 'complete' && (
        <>
          <div className="alert alert-success">Interview Complete!</div>
          <div>
            <h6>Candidate Summary</h6>
            <div>Name: {profile.name}</div>
            <div>Email: {profile.email}</div>
            <div>Phone: {profile.phone}</div>
            <div>Summary: {interview.summary}</div>
            <h6>All Questions and Answers</h6>
            <ol>
              {questions.map((q, i) => (
                <li key={i}>
                  <strong>{q.q}</strong>
                  <div>Answer: {answers[i]}</div>
                  <div>Score: {scores[i]}</div>
                </li>
              ))}
            </ol>
            <button
              className="btn btn-outline-secondary mt-3"
              onClick={() => dispatch(resetInterview())}
            >
              Restart Interview
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatWindow;
