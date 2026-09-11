const express = require("express");
const Task = require("../models/task");

const router = express.Router();

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const { title, description, project, assignedTo } = req.body;

    if (!title || !project) {
      return res.status(400).json({
        message: "Title and project are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project")
      .populate("assignedTo");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;