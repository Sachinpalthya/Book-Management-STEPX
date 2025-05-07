import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const SubjectView = ({ year, onSubjectClick }) => {
  // Dummy subject data - replace with API call
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (year === '1stYear') {
      setSubjects(['English', 'Hindi', 'Sanskrit']);
    } else if (year === '2ndYear') {
      setSubjects(['Physics', 'Chemistry', 'Mathematics']);
    } else {
      setSubjects([]);
    }
  }, [year]);

  const handleSubjectClick = (subject) => {
    onSubjectClick(subject);
  };

  return (
    <div className="subject-view">
      <h2>{year} Subjects</h2>
      <div className="subject-list">
        {subjects.map((subject, index) => (
          <button key={index} className="subject-button" onClick={() => handleSubjectClick(subject)}>
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectView;