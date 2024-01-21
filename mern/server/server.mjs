import express from "express";
import cors from "cors";
import http from 'http';
import { Server } from 'socket.io'; // Import the Server class from socket.io
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import ideas from "./routes/ideas.js";
import OpenAI from "openai";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const PORT = 5050;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // This is for demo purposes, specify your client's address in production
    methods: ["GET", "POST"]
  }
});

const phaseDuration = 1 * 10 * 1000; // 2 min
//let phaseTimer;
//let isTimerStarted = false; // Keep track of the timer state
const teamTimers = {};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


app.use(cors());
app.use(express.json());

app.use("/record", records);
app.use('/ideas', ideas); // Use the routes


app.post('/api/gpt-insights', async (req, res) => {
  const { ideaText, projectContext } = req.body;

  try {
    const message = `Given the following project context: ${projectContext}, here is a possible idea to address it: ${ideaText}. Provide a short list of pros and cons for the idea. Your response should be 3 bullet points each for both pros and cons, and keep your explanations very short.`;
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      temperature: 0,
      max_tokens: 1000,
    });

    console.log(JSON.stringify(response, null, 2));
    const insights = response.choices[0].message.content; // Adjusted based on your structure
    
    res.status(200).json({ insights: insights });
  } catch (err) {
    console.error('Error with OpenAI GPT:', err);
    res.status(500).json(err.message);
  }

});

io.on('connection', (socket) => {
  console.log('A user connected with Socket.IO, ID:', socket.id); // Log new connection with socket ID


  socket.on('joinTeam', (joinCode) => {
    socket.join(joinCode);
    console.log(`User with ID: ${socket.id} joined team: ${joinCode}`);

    if(teamTimers[joinCode] && teamTimers[joinCode].isTimerStarted) {
      socket.emit('timerState', { isTimerStarted: true });
      socket.emit('timerUpdate', { remainingTime: teamTimers[joinCode].remainingTime });
    } else {
      socket.emit('timerState', {isTimerStarted: false});
    }
  });

  socket.on('startTimerForTeam', (joinCode) => {
    io.to(joinCode).emit('navigateToCreate');
  });

  socket.on('startTimer', (joinCode) => {
    if (teamTimers[joinCode] && teamTimers[joinCode].isTimerStarted) {
      console.log(`Timer already started for team ${joinCode}`);
    } else {
      console.log(`Starting timer for team ${joinCode}`);
      startPhaseTimer(joinCode);
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected, ID:', socket.id);
  });
});

function startPhaseTimer(joinCode) {
  let remainingTime = phaseDuration;
  teamTimers[joinCode] = { isTimerStarted: true, timerId: null, remainingTime };
  io.to(joinCode).emit('timerState', { isTimerStarted: true });
  io.to(joinCode).emit('timerUpdate', { remainingTime });

  teamTimers[joinCode].timerId = setInterval(() => {
    remainingTime -= 1000;
    teamTimers[joinCode].remainingTime = remainingTime;
    io.to(joinCode).emit('timerUpdate', { remainingTime });

    if (remainingTime <= 0) {
      clearInterval(teamTimers[joinCode].timerId);
      io.to(joinCode).emit('phaseEnded', { nextPhase: 'voting' });
      delete teamTimers[joinCode]; // Clean up
    }
  }, 1000);
}

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
