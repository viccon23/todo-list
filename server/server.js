const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const TaskSchema = new mongoose.Schema({
  text: String,
  description: String,
  completed: Boolean,
});
const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
  });
  
app.post("/tasks", async (req, res) => {
const newTask = new Task(req.body);
await newTask.save();
res.json(newTask);
});

app.put("/tasks/:id", async (req, res) => {
const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
res.json(updatedTask);
});

app.delete("/tasks/:id", async (req, res) => {
await Task.findByIdAndDelete(req.params.id);
res.json({ message: "Task deleted" });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(port, () => console.log(`Server running on port ${port}`));