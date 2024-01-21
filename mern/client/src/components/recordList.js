import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai'; // Import icons for dropdown


const Idea = ({ idea, deleteIdea, projectContext }) => {
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(false); // State to show/hide insights
  const [insights, setInsights] = useState(''); // State for AI insights specific to this idea


  const handleChange = async () => {
    const newChecked = !isChecked;
    setChecked(newChecked);
    try {
      const response = await fetch(`http://localhost:5050/ideas/vote/${idea._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        // Send the new vote state (increment or decrement) to the backend
        body: JSON.stringify({ increment: newChecked }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      console.log(result); // For debugging purposes
      
    } catch (error) {
      console.error('Failed to update vote:', error);
      alert('Failed to update vote');
    }
  };

  const handleGPTInsights = async () => {
    setLoading(true);
    console.log('Idea Text:', idea.text);
    console.log('Project Context:', idea.projectContext);
    try {
      const response = await fetch('http://localhost:5050/api/gpt-insights', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ideaText: idea.text, ideaContext: idea.projectContext }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
      setInsights(result.insights); // Set the insights
      setShowInsights(true);
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      alert('Failed to fetch AI insights');
    } finally {
      setLoading(false); // Stop loading
    }
  };


  return (
    <tr>
      <td>{idea.text}</td>
      <td>
        <input
          type="checkbox"
          onChange={handleChange}
          checked={isChecked}
        />
      </td>
      <td>
        <button className="btn btn-link" onClick={() => deleteIdea(idea._id)}>Delete</button>
        <button 
          className={`btn ${loading ? 'btn-secondary' : 'btn-info'}`} 
          onClick={() => handleGPTInsights(idea)}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'AI Insights'}
        </button>
        {showInsights && (
          <div>
            <p>AI Insights:</p>
            <p>{insights}</p>
            <button onClick={() => setShowInsights(false)}>Hide</button>
          </div>
        )}
        {!showInsights && insights && (
          <button onClick={() => setShowInsights(true)}>Show</button>
        )}
      </td>
    </tr>
  );
};

export default function IdeaList() {
  const navigate = useNavigate();
  const [ideas, setIdeas] = useState([]);
  const [createCode, setCreateCode] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [projectContext, setProjectContext] = useState('');
  
 // This method fetches the records from the database.
 useEffect(() => {
   async function getIdeas() {
     const response = await fetch(`http://localhost:5050/ideas/`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const ideas = await response.json();
     setIdeas(ideas);
   }

   getIdeas();

   return;
 }, [ideas.length]);

 // This method will delete a record
 async function deleteIdea(id) {
   await fetch(`http://localhost:5050/ideas/${id}`, {
     method: "DELETE"
   });

   const newIdeas = ideas.filter((el) => el._id !== id);
   setIdeas(newIdeas);
 }

// This method will delete the ideas that are below the average
 async function getAverage() {
  const response = await fetch(`http://localhost:5050/ideas/average-votes/`);

  if (!response.ok) {
    const message = `An error occurred: ${response.statusText}`;
    window.alert(message);
    return;
  }

  // average is here
  const avg = await response.json();

  const arrIdeas = await fetch(`http://localhost:5050/ideas/`);
  const allIdeas = await arrIdeas.json();

  allIdeas.forEach((idea) => {
    if (idea.votes < avg.averageVotes) {
      deleteIdea(idea._id)
    }
  });
}

  const ideaList = () => {
    return ideas.map((idea) => {
      
      return (
        <Idea
          idea={idea}
          deleteIdea={deleteIdea}
          projectContext={projectContext}
          key={idea._id}
        />
      );
    });
  };

  const handleCreateCodeChange = (e) => {
    setCreateCode(e.target.value);
  };

  const handleJoinCodeChange = (e) => {
    setJoinCode(e.target.value);
  };

  const handleCreateRoom = () => {
    if (createCode.trim()) {
      navigate(`/timertest?joinCode=${createCode}`);
    } else {
      alert('Please enter a code to create a room.');
    }
  };

  const handleJoinRoom = () => {
    if (joinCode.trim()) {
      navigate(`/timertest?joinCode=${joinCode}`);
    } else {
      alert('Please enter a valid join code to join a room.');
    }
  };
  

 // This following section will display the table with the records of individuals.
 return (
  <div>
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
    <div>
        <input 
          type="text" 
          value={projectContext} 
          onChange={(e) => setProjectContext(e.target.value)} 
          placeholder="Enter project context"
        />
    </div>
    <button onClick={getAverage}></button>
    <h3>Idea List</h3>
    <table className="table table-striped" style={{ marginTop: 20 }}>
      <thead>
        <tr>
          <th>Idea</th>
          <th>Like</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>{ideaList()}</tbody>
    </table>
  </div>
);
}
