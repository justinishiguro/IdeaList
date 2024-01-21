import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

import Idea from '../models/Idea.js';

const router = express.Router();

router.get("/", async (req, res) => {
    let collection = await db.collection("ideas");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  });




router.post('/', async (req, res) => {

    console.log("MADE IT INTO THE POST FUNCTION");
    let idea = {
        text: req.body.text,
        votes: 0,
        // other fields initialized as needed
    };

    console.log("Saving new idea: ", idea);             /// DEBUG STATEMENT

    try {
        //const savedIdea = await idea.save();
        let collection = await db.collection("ideas");
        let result = await collection.insertOne(idea);
        res.send(result).status(204);

        console.log("Saved idea:", result); /// DEBUG STATEMENT
        //res.status(201).json(savedIdea);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete("/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
  
    const collection = db.collection("ideas");
    let result = await collection.deleteOne(query);
  
    res.send(result).status(200);
});

// Add an endpoint for incrementing idea votes
// Add an endpoint for updating idea votes
router.patch("/vote/:id", async (req, res) => {
    const { id } = req.params;
    const { increment } = req.body; // This will be either true or false
  
    try {
      const collection = db.collection("ideas");
      const voteChange = increment ? 1 : -1; // Determine whether to increment or decrement
  
      console.log(`Updating votes for idea with ID: ${id}, Vote Change: ${voteChange}`);
  
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { votes: voteChange } } // Increment or decrement votes by 1
      );
  
      if (result.modifiedCount === 0) {
        console.log(`No document found with ID ${id} to update.`);
        return res.status(404).json({ message: "Idea not found or vote already updated" });
      }
        // Get the updated votes count for debugging
        const updatedIdea = await collection.findOne({ _id: new ObjectId(id) });
        console.log(`Updated votes count for idea: ${updatedIdea.votes}`); // Log updated votes count
  
      res.status(200).json({ message: "Vote updated successfully", votesChange: voteChange });
    } catch (err) {
      console.error(`Error updating votes for idea with ID ${id}:`, err.message);
      res.status(500).json({ message: err.message });
    }
  });
  

export default router; // Using ES6 default export
