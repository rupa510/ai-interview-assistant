import React from 'react';
import { useSelector } from 'react-redux';

const CandidateDetail = ({ id, onClose }) => {
  const candidate = useSelector(state =>
    state.candidates.list.find(c => c.id === id)
  );
  if (!candidate) return null;
  return (
    <div className="modal show d-block">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5>Candidate: {candidate.profile.name}</h5>
            <button type="button" className="btn-close" onClick={onClose}/>
          </div>
          <div className="modal-body">
            <div>Email: {candidate.profile.email}</div>
            <div>Phone: {candidate.profile.phone}</div>
            <div>Score: {candidate.finalScore}</div>
            <div>Summary: {candidate.summary}</div>
            <h6>Questions & Answers</h6>
            <ol>
              {candidate.questions.map((q, i) => (
                <li key={i}>
                  <strong>{q.q}</strong>
                  <div>Answer: {candidate.answers[i]}</div>
                  <div>Score: {candidate.scores[i]}</div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;
