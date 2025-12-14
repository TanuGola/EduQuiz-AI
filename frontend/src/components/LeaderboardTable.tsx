import React from 'react';
import { LeaderboardEntry } from '../types';

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries }) => {
  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Student</th>
          <th>Quiz</th>
          <th>Category</th>
          <th>Score</th>
          <th>Correct/Wrong</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry, index) => (
          <tr key={entry._id}>
            <td>{index + 1}</td>
            <td>{entry.studentId.name}</td>
            <td>{entry.quizId.title}</td>
            <td>{entry.quizId.category}</td>
            <td className="score">{entry.score}%</td>
            <td>{entry.correct}/{entry.wrong}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
