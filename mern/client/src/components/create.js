import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
 const [form, setForm] = useState({
   text: "",
   votes: 0,
 });
 const navigate = useNavigate();

 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }

 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();

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

   setForm({ text: "", votes: 0});
   //navigate("/");
 }

 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Generate Ideas</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="text">Idea</label>
         <input
           type="text"
           className="form-control"
           id="text"
           value={form.text}
           onChange={(e) => updateForm({ text: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Submit Idea"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
