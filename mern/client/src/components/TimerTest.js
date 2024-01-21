// src/components/TimerTest.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '../socketContext'; // Import the useSocket hook

const TimerTest = () => {
  const navigate = useNavigate();
  const location = useLocation(); // To access the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const joinCode = queryParams.get('joinCode'); // Get teamId from the URL

  const [timer, setTimer] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);
  const socket = useSocket(); // Use the hook to access the socket

  useEffect(() => {
    console.log('Setting up socket listeners'); // Log when setting up listeners
    if (socket && joinCode) {
      // Join the team when the component mounts
      socket.emit('joinTeam', joinCode);

      socket.on('timerUpdate', (data) => {
        console.log('Timer update received:', data); // Log timer updates
        setTimer(data.remainingTime);
      });

      socket.on('timerState', (data) => {
        console.log('Timer state received:', data); // Log timer state changes
        setShowStartButton(!data.isTimerStarted); // Show or hide the start button
      });

      socket.on('phaseEnded', () => {
        console.log('Phase ended received'); // Log phase end event
        navigate('/'); // Navigate to the RecordList page when the phase ends
      });

      // Cleanup listeners when the component unmounts
      return () => {
        console.log('Cleaning up socket listeners'); // Log cleanup
        socket.off('timerUpdate');
        socket.off('timerState');
        socket.off('phaseEnded');
      };
    }
  }, [socket, navigate, joinCode]);

  const handleStartTimer = () => {
    console.log('Emitting startTimer event with teamId:', joinCode); // Log button click event
    // Send the event to start the timer along with the teamId
    if (socket && joinCode) {
      socket.emit('startTimer', joinCode);
    } else {
      console.error('Socket is not connected or teamId is missing.');
    }
  };

  const displayTime = () => {
    if (timer === null) return 'Waiting for timer...';
    const seconds = Math.floor(timer / 1000);
    return `Time remaining: ${seconds} seconds`;
  };

  return (
    <div>
      {showStartButton && (
        <button onClick={handleStartTimer} disabled={!joinCode}>
          Start Timer
        </button>
      )}
      <div>{displayTime()}</div>
    </div>
  );
};

export default TimerTest;
