const express = require("express");
const Project = require("../models/project");

const router = express.Router();

// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("members");

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;