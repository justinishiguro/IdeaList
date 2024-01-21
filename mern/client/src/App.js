// src/App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import RecordList from "./components/recordList";
import Edit from "./components/edit";
import Create from "./components/create";
import Home from "./components/home";
import TimerTest from "./components/TimerTest"; // Import the TimerTest component

const App = () => {
  return (
    <div>
      <Navbar />
      <div style={{ margin: 20 }}>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/edit/:id" element={<Edit />} />
          <Route path="/create" element={<Create />} />
        <Route path="/recordList" element={<RecordList />} />
          <Route path="/timertest" element={<TimerTest />} /> {/* Add this line */}
        </Routes>
      </div>
    </div>
  );
};

export default App;
