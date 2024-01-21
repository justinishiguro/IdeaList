import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Idea = (props) => {
  const [isChecked, setChecked] = useState(false);

  const handleChange = async () => {
    const newChecked = !isChecked;
    setChecked(newChecked);
  
    try {
      const response = await fetch(`http://localhost:5050/ideas/vote/${props.idea._id}`, {
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

return (
 <tr>
   <td>{props.idea.text}</td>
   <td>
     <input
          type="checkbox"
          onChange={handleChange}
          checked={isChecked}
        />
   </td>
   <td>
   <button className="btn btn-link"
       onClick={() => {
         props.deleteIdea(props.idea._id);
       }}
     >
       Delete
     </button>
   </td>
 </tr>
)};

export default function IdeaList() {
 const [ideas, setIdeas] = useState([]);

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

 // This method will map out the records on the table
 function ideaList() {
   return ideas.map((idea) => {
     return (
       <Idea
         idea={idea}
         deleteIdea={() => deleteIdea(idea._id)}
         key={idea._id}
       />
       
     );
   });
 }

 // This following section will display the table with the records of individuals.
 return (
   <div>
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
