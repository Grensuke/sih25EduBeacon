import React from 'react';
import { Link } from 'react-router-dom';

const BackToHome = ({ className = '' }) => (
  <Link to="/" className={`link-back ${className}`.trim()} aria-label="Back to home">
    <svg
      className="link-back-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
    <span>Back to Home</span>
  </Link>
);

export default BackToHome;
