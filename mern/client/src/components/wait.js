import React from "react";
import { NavLink } from "react-router-dom";
import "./style/wait.css";

export default function Wait() {
    // Add any event handlers or state you need

    return (
        <div className="home">
            <div className="overlap-group">
                <div className="rectangle" />
                <p className="where-ideas-meet">
                    <span className="text-wrapper">Waiting...</span>
                    <span className="text-wrapper">Room Name: <br></br> </span>
                </p>
            </div>
            <div className="start-button-container">
                <NavLink to="/create">
                    <button className="start-button">START NOW!</button>
                </NavLink>
            </div>
            {/* Additional content goes here */}
        </div>
    );
}
