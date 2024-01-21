import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../socketContext'; // Import the useSocket hook

import "./style/wait.css";

export default function Wait() {
    // Add any event handlers or state you need
    
    const navigate = useNavigate();
    const location = useLocation(); // To access the URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const joinCode = queryParams.get('joinCode'); // Get teamId from the URL
    const socket = useSocket();

    useEffect(() => {
        if (socket && joinCode) {
          socket.emit('joinTeam', joinCode);
    
          // Listen for the 'navigateToCreate' event
          socket.on('navigateToCreate', () => {
            navigate(`/create?joinCode=${joinCode}`);
          });
    
          // Cleanup when component unmounts
          return () => {
            socket.off('navigateToCreate');
          };
        }
      }, [socket, joinCode, navigate]);

  
    const [timer, setTimer] = useState(null);
    const [showStartButton, setShowStartButton] = useState(true);
    const [projectContext, setProjectContext] = useState('');
  
    const handleStartTimer = () => {
      // Send the event to start the timer along with the teamId
      if (joinCode) {
        navigate(`/create?joinCode=${joinCode}`)
      } else {
      }
    };
  
    const displayTime = () => {
      if (timer === null) return 'Waiting for timer...';
      const seconds = Math.floor(timer / 1000);
      return `Time remaining: ${seconds} seconds`;
    };

    return (
        <div className="home">
            <div className="overlap-group">
                <div className="rectangle" />
                <p className="where-ideas-meet">
                    <span className="text-wrapper">Waiting...</span>
                    <span className="text-wrapper">Room Name: {joinCode} <br></br> </span>
                </p>
            </div>
            <div className="start-button-container">
            <div className='idea-wrapper'>
                <input 
                type="text" 
                value={projectContext} 
                onChange={(e) => setProjectContext(e.target.value)} 
                placeholder="Enter project context"
                />
            </div>
            <button className='start-button' onClick={handleStartTimer} disabled={!joinCode}>
                Start Timer
            </button>
            </div>
            {/* Additional content goes here */}
        </div>
    );
}
