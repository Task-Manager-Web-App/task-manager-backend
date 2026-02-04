const express = require("express");
const tasksRouter = express.Router();

const { supabase } = require("../supabase-client.js");

// GET /tasks
tasksRouter.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*");

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// DELETE /tasks/:id
tasksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({
      message: "Task deleted successfully",
      task: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: String(err),
    });
  }
});


// PUT /tasks/:id  -> update a task
tasksRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    const { data, error } = await supabase
      .from("tasks")
      .update({
        title: title.trim(),
        description: description ? description.trim() : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json({
      message: "Task updated successfully",
      task: data,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: String(err),
    });
  }
});


module.exports = tasksRouter;
