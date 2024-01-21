// import React, { useState } from "react";
// import { useNavigate } from "react-router";

//  // This following section will display the form that takes the input from the user.
//  return (
  //  <div>
  //    <h3>Generate Ideas</h3>
  //    <form onSubmit={onSubmit}>
  //      <div className="form-group">
  //        <label htmlFor="name">Idea</label>
  //        <input
  //          type="text"
  //          className="form-control"
  //          id="name"
  //          value={form.name}
  //          onChange={(e) => updateForm({ name: e.target.value })}
  //        />
  //      </div>
  //      <div className="form-group">
  //        <input
  //          type="submit"
  //          value="Submit Idea"
  //          className="btn btn-primary"
  //        />
  //      </div>
  //    </form>
  //  </div>
//  );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./style/create.css";
import handsShowImage from './style/images/hands-show.png';

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


    return (
        <div className="idea-generation">
            <div className="text-wrapper">IDEA GENERATION</div>
            <p className="div">It’s time to start brainstorming!</p>
            <img src={handsShowImage} className="hands-show" alt="Hands show" />
            <div className="frame">
                <div className="group">
                    <p className="TIME">
                        <span className="span">TIME</span>
                        <span className="text-wrapper-2">: </span>
                        <span className="span">0:00</span>
                    </p>
                </div>
                <div>
                    {/* <p className="idea">
                        <span className="text-wrapper-3">idea 1 </span>
                        <span className="text-wrapper-4">... </span>
                    </p> */}
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
    );
}

