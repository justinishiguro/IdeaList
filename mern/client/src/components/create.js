import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./style/create.css";
import handsShowImage from './style/images/hands-show.png';

export default function Create() {

  const [form, setForm] = useState({
    text: "",
    votes: 0,
    projectContext: ""  // Add a projectContext state
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


    return (
        <div className="idea-generation">
        <div className="content-container">
          <img src={handsShowImage} className="hands-show" alt="Hands show" />
          <div className="text-form-container">
            <div className="text-wrapper">IDEA GENERATION</div>
            <p className="div">It’s time to start brainstorming!</p>
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
                      <input
                        type="text"
                        className="idea-wrapper"
                        id="projectContext"
                        value={form.projectContext}
                        onChange={(e) => updateForm({ projectContext: e.target.value })}
                        placeholder="Enter project context"
                      />
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

