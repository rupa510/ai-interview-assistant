import React, { useState } from 'react';
import ChatWindow from './components/Chat/ChatWindow';
import CandidateList from './components/Dashboard/CandidateList';

function App() {
  const [tab, setTab] = useState('chat');

  return (
    <div className="container mt-4">
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'chat' && 'active'}`} onClick={() => setTab('chat')}>Interviewee</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'dashboard' && 'active'}`} onClick={() => setTab('dashboard')}>Interviewer</button>
        </li>
      </ul>
      {tab === 'chat' ? <ChatWindow /> : <CandidateList />}
    </div>
  );
}

export default App;
