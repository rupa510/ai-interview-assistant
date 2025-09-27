// Generates 2 easy, 2 medium, 2 hard sample questions for full stack dev
export function generateQuestionSet() {
  return [
    { level: 'Easy', q: 'What is JSX in React?' },
    { level: 'Easy', q: 'Name one way to create a REST API in Node.js.' },
    { level: 'Medium', q: 'How does the virtual DOM improve performance in React?' },
    { level: 'Medium', q: 'Describe how middleware works in Express.js.' },
    { level: 'Hard', q: 'How do you implement server-side rendering for a React app with Node?' },
    { level: 'Hard', q: 'Design a scalable architecture for a real-time chat app using React and Node.' }
  ];
}

// VERY basic scoring stub, expand this as needed.
export function autoScoreAnswer(answer, questionIdx) {
    if (answer.length > 40) return 5;
    if (answer.length > 20) return 3;
    return 1;
}

export function generateSummary(profile, scores, answers) {
  const avgScore = scores.reduce((a,b) => a+b, 0)/scores.length;
  return `Candidate ${profile.name} completed the interview with an average score of ${avgScore.toFixed(2)}/5. Main strengths: ${answers[2] || 'N/A'}`;
}
