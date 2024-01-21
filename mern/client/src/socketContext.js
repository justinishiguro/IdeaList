// src/socketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('http://localhost:5050', {
      autoConnect: false, // Optional: Prevent auto-connecting
      // Other options here
    });

    setSocket(newSocket);

    // Connect manually
    newSocket.connect();

    // Setup the beforeunload event listener
    const handleUnload = () => {
      newSocket.disconnect(); // Disconnect socket when the window is being closed
    };

    window.addEventListener('beforeunload', handleUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      newSocket.disconnect(); // Disconnect on component unmount
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

// Hook to use the socket context
export const useSocket = () => {
  return useContext(SocketContext);
};
