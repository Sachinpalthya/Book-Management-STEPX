import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import SubjectView from './SubjectView';
import ChapterView from './ChapterView';
import './styles.css';

const DashboardLayout = () => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const navigate = useNavigate();

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setSelectedSubject(null);
    navigate(`/dashboard/${year}`);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    navigate(`/dashboard/${selectedYear}/${subject}`);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onYearClick={handleYearClick} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<div>Welcome to Dashboard</div>} />
          <Route path=":year" element={<SubjectView year={selectedYear} onSubjectClick={handleSubjectClick} />} />
          <Route path=":year/:subject" element={<ChapterView year={selectedYear} subject={selectedSubject} />} />
        </Routes>
      </div>
    </div>
  );
};

export default DashboardLayout;