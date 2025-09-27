import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCandidate } from '../../redux/candidatesSlice';
import CandidateDetail from './CandidateDetail';
import LoginModal from './LoginModel';

const CandidateList = () => {
  const candidates = useSelector(state => state.candidates.list);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  // Modal state
  const [showLogin, setShowLogin] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState(null);

  const filtered = candidates
    .filter(c => c.profile.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.finalScore - a.finalScore);

  const requestDelete = (id) => {
    // Set candidate to delete and show login modal first
    setCandidateToDelete(id);
    setShowLogin(true);
  };

  const handleLoginSuccess = () => {
    if (candidateToDelete) {
      dispatch(deleteCandidate(candidateToDelete));
      if (selected === candidateToDelete) setSelected(null);
      setCandidateToDelete(null);
    }
  };

  return (
    <div>
      <input
        className="form-control my-2"
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Score</th><th>Summary</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(c => (
            <tr key={c.id}>
              <td onClick={() => setSelected(c.id)} style={{cursor:'pointer'}}>{c.profile.name}</td>
              <td>{c.profile.email}</td>
              <td>{c.finalScore}</td>
              <td>{c.summary}</td>
              <td>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={() => requestDelete(c.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selected && <CandidateDetail id={selected} onClose={() => setSelected(null)} />}

      {/* Login Modal */}
      <LoginModal
        show={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={handleLoginSuccess}
      />
    </div>
  );
};

export default CandidateList;
