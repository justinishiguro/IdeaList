import React from "react";
import { NavLink } from "react-router-dom";
import "./style/home.css";
import ideaImage from './style/images/idea.png';

export default function Home() {
    // Add any event handlers or state you need

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
            <div className="start-button-container">
                <NavLink to="/create">
                    <button className="start-button">LET’S START</button>
                </NavLink>
            </div>
            {/* Additional content goes here */}
        </div>
    );
}
