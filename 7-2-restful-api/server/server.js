import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import Song from "./models/song.model.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo connected");
  } catch (err) {
    console.error("Connection error:", err.message);
  }
};

connectDB();

// POST /api/songs
app.post("/api/songs", async (req, res) => {
  try {
    const { title = "", artist = "", year } = req.body || {};

    const created = await Song.create({
      title: title.trim(),
      artist: artist.trim(),
      year,
    });

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message || "Validation error" });
  }
});

// GET /api/songs
app.get("/api/songs", async (req, res) => {
  const rows = await Song.find().sort({ createdAt: -1 });
  res.json(rows);
});

// GET /api/songs/:id
app.get("/api/songs/:id", async (req, res) => {
  const s = await Song.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Song not found" });
  res.json(s);
});

// PUT /api/songs/:id
app.put("/api/songs/:id", async (req, res) => {
  try {
    const updated = await Song.findByIdAndUpdate(
      req.params.id,
      req.body || {},
      { new: true, runValidators: true, context: "query" }
    );

    if (!updated) return res.status(404).json({ message: "Song not found" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message || "Update failed" });
  }
});

// DELETE /api/songs/:id
app.delete("/api/songs/:id", async (req, res) => {
  const deleted = await Song.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Song not found" });
  res.status(204).end();
});

// server start
app.listen(process.env.PORT || 5174, () => {
  console.log(`Server running on port ${process.env.PORT || 5174}`);
});