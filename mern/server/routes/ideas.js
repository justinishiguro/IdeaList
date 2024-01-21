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

export default router; // Using ES6 default export
