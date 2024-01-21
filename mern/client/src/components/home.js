import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import "./style/home.css";
import ideaImage from './style/images/idea.png';

export default function Home() {
    const [createCode, setCreateCode] = useState('');
    const [joinCode, setJoinCode] = useState('');

    const navigate = useNavigate();


    // Add any event handlers or state you need


    const handleCreateCodeChange = (e) => {
        setCreateCode(e.target.value);
      };
    
      const handleJoinCodeChange = (e) => {
        setJoinCode(e.target.value);
      };
    
      const handleCreateRoom = () => {
        if (createCode.trim()) {
          navigate(`/wait?joinCode=${createCode}`);
        } else {
          alert('Please enter a code to create a room.');
        }
      };
    
      const handleJoinRoom = () => {
        if (joinCode.trim()) {
          navigate(`/wait?joinCode=${joinCode}`);
        } else {
          alert('Please enter a valid join code to join a room.');
        }
      };

    return (
        <div className="home">
            <div className="overlap-group">
                <div className="rectangle" />
                <p className="where-ideas-meet">
                    <span className="text-wrapper">IdeaList</span>
                </p>
                <p className="description">
                    Ready to find the Ideal Idea? This is the website for you! <br></br> Collaborate with others
                    and share all your ideas for everyone to discuss! <br />
                </p>
                <img className="big-shoes-discussion" alt="Big shoes discussion" src={ideaImage} />
            </div>
            <div>
      <input
        type="text"
        value={createCode}
        onChange={handleCreateCodeChange}
        placeholder="Create a join code"
      />
      <button onClick={handleCreateRoom} className="btn btn-primary">
        Create Room
      </button>
    </div>
    <div>
      <input
        type="text"
        value={joinCode}
        onChange={handleJoinCodeChange}
        placeholder="Enter join code to join"
      />
      <button onClick={handleJoinRoom} className="btn btn-primary">
        Join Room
      </button>
        </div>
    </div>
    );
}
