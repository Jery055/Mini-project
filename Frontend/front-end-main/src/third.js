import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './third.css';

function Third() {
  const location = useLocation();
  const navigate = useNavigate();
  const { branch, semester, userType } = location.state || { branch: 'Unknown', semester: 'Unknown', userType: 'Unknown' };

  const handleCourseClick = (courseType) => {
    navigate('/four', { state: { branch, semester, courseType, userType } });
  };

  const handleHomeClick = () => {
    navigate('/second', { state: { branch, semester, userType } });
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h1 className="logo">RSET NOTES</h1>
        <button className="sidebar-btn" onClick={handleHomeClick}>
          <i className="fas fa-home"> </i>    HOME
        </button>
        <div className="branch-info">
          <h3><strong>Branch:</strong> {branch}</h3>
          <h3><strong>Semester:</strong> {semester}</h3>
          <h3><strong>User Type:</strong> {userType}</h3>
        </div>
      </aside>

      <main className="main-content">
        <h2 className="main-heading">Select Course Type</h2>
        <div className="course-buttons">
          <button className="course-btn" onClick={() => handleCourseClick('Regular Course')}>Regular Course</button>
          <button className="course-btn" onClick={() => handleCourseClick('Minors Course')}>Minors Course</button>
          <button className="course-btn" onClick={() => handleCourseClick('Honours Course')}>Honours Course</button>
          <button className="course-btn" onClick={() => handleCourseClick('Elective Course')}>Elective Course</button>
        </div>
      </main>
    </div>
  );
}

export default Third;
