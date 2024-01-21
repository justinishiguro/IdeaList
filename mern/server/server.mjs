import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";
import ideas from "./routes/ideas.js";

const PORT = 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);
app.use('/ideas', ideas); // Use the routes

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
