const express = require("express");
const tasksRouter = express.Router();

const { supabase } = require("../supabase-client.js");

// ======================== GET /tasks ========================
tasksRouter.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.json(data);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
});

// ======================== DELETE /tasks/:id ========================
tasksRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { user_id, role } = req.body;

  if (!user_id) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {

    // 1. Here get the task's user_id from supabase to check ownership     
    const userIDofTheTask = await supabase
      .from("tasks")
      .select("user_id")
      .eq("id", id)
      .single();  


    if (!userIDofTheTask.data) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Output would be like: Task to delete: { user_id: 'some-uuid' }    
    console.log("Task to delete:", userIDofTheTask.data);


    // 2. Then check if user owns the task or is admin
    if (userIDofTheTask.data.user_id == user_id || role === "admin") {

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
      
    }

    else {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }    
    
  } 
  
  catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: String(err),
    });
  }
});


// ======================== PUT /tasks/:id ========================
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

    // 1. Here get the task's user_id from supabase to check ownership
    const userIDofTheTask = await supabase
      .from("tasks")
      .select("user_id")
      .eq("id", id)
      .single();


    if (!userIDofTheTask.data) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Output would be like: Task to update: { user_id: 'some-uuid' }
    console.log("Task to update:", userIDofTheTask.data);


    // 2. Then check if user owns the task or is admin
    if (userIDofTheTask.data.user_id == user_id || role === "admin") {

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

    }

    else {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

  }

  catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: String(err),
    });
  }
});


module.exports = tasksRouter;