import React from "react";
import "./LoadingPage.css";

const LoadingPage: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">
        <div className="spinner-inner"></div>
      </div>
    </div>
  );
};

export default LoadingPage;
