import React from 'react';

const ProgressBar = () => {
  console.log("re");
  return (
    <div className="progress">
      <div className="progress-bar progress-bar-striped active" role="progressbar" ariaValuenow="45" ariaValuemin="0" ariaValuemax="100" style={{width: "100%"}}>
        <span className="sr-only">Laddar sidan...</span>
      </div>
    </div>
  );
};

export default ProgressBar;
