import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import "./style/create.css";
import handsShowImage from './style/images/hands-show.png';
import { useSocket } from '../socketContext'; // Import the useSocket hook


export default function Create() {
  const navigate = useNavigate();
  const location = useLocation(); // To access the URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const joinCode = queryParams.get('joinCode'); // Get teamId from the URL
  const socket = useSocket(); // Use the hook to access the socket
  const [timer, setTimer] = useState(null);
  const [showStartButton, setShowStartButton] = useState(true);

  let count = 0;




  useEffect(() => {
    console.log('Setting up socket listeners'); // Log when setting up listeners
    if (socket && joinCode) {
      // Join the team when the component mounts
      //socket.emit('joinTeam', joinCode);

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
        navigate(`/recordList?joinCode=${joinCode}`);  
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

  const [form, setForm] = useState({
    text: "",
    votes: 0,
    projectContext: ""  // Add a projectContext state
 });
 
  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
 
  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    if (!form.text.trim()) {
      window.alert("Please enter a valid idea!");
      return;
    }
 
    // When a post request is sent to the create url, we'll add a new record to the database.
    const newIdea = { ...form };
    console.log("This is the object: ", newIdea);
    await fetch("http://localhost:5050/ideas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newIdea),
    })
    .catch(error => {
      window.alert(error);
      return;
    });
 
    setForm({ text: "", votes: 0, projectContext: ""});
    //navigate("/");
  }

  useEffect(() => {
    // Send the event to start the timer along with the teamId
    if (socket && joinCode && count === 0) {
      count+=1;
      console.log('Emitting startTimer event with teamId:', joinCode); // Log button click event
      socket.emit('startTimer', joinCode);
    } else {
      console.error('Socket is not connected or teamId is missing.');
    };
  }, [socket, joinCode]);

  const displayTime = () => {
    if (timer === null) return 'Waiting for timer...';
    const seconds = Math.floor(timer / 1000);
    return `Time remaining: ${seconds} seconds`;
  };


    return (
        <div className="idea-generation">
        <div className="content-container">
          <img src={handsShowImage} className="hands-show" alt="Hands show" />
          <div className="text-form-container">
            <div className="text-wrapper">IDEA GENERATION</div>
            <p className="div">It’s time to start brainstorming!</p>
            <div>{displayTime()}</div>
            <div className="frame">
              {/* ... additional content ... */}
              <form onSubmit={onSubmit}>
              <div className="idea">
                        {/* <label htmlFor="text">Idea</label> */}
                        <input
                          type="text"
                          className="idea-wrapper"
                          id="text"
                          value={form.text}
                          onChange={(e) => updateForm({ text: e.target.value })}
                          placeholder="Write your ideas"
                        />
                      </div>
                      <div className="button-container">
                        <input
                          type="submit"
                          value="Submit Idea"
                          className="btn-primary"
                        />
                      </div>
              </form>
            </div>
          </div>
        </div>
        </div>
    );
}

