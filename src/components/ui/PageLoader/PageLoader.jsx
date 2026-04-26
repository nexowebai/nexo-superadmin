import React from "react";
import "./PageLoader.css";

const PageLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="app-loader__spinner">
        <div className="app-loader__ring" />
        <div className="app-loader__dots">
          <div className="app-loader__dot" />
          <div className="app-loader__dot" />
          <div className="app-loader__dot" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
