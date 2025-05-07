import React from 'react';
import { Link } from 'react-router-dom';
import './styles.css';

const Sidebar = ({ onYearClick }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Title</h2>
      <button className="sidebar-button" onClick={() => onYearClick('1stYear')}>
        1st Year
      </button>
      <button className="sidebar-button" onClick={() => onYearClick('2ndYear')}>
        2nd Year
      </button>
      <Link to="/logout" className="sidebar-logout">
        Log Out
      </Link>
    </div>
  );
};

export default Sidebar;