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
  const { user_id, role } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Check if user owns the task or is admin
    const { data: task } = await supabase
      .from("tasks")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Allow if user owns task OR is admin
    if (task.user_id !== user_id && role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

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
  const { title, description, user_id, role } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (!title || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  try {
    // Check if user owns the task or is admin
    const { data: task } = await supabase
      .from("tasks")
      .select("user_id")
      .eq("id", id)
      .single();

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Allow if user owns task OR is admin
    if (task.user_id !== user_id && role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

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