const express = require("express");
const addTaskRouter = express.Router();

const { supabase } = require("../supabase-client.js");

// POST http://localhost:3000/add-task
addTaskRouter.post("/", async (req, res) => {
  try {
    console.log("✅ /add-task hit:", req.body);

    const { title, description, user_id } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!user_id) {
      return res.status(400).json({ message: "user_id is required" });
    }

    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: title.trim(),
          description: description ? description.trim() : null,
          user_id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({ message: "Task inserted", task: data });
  } catch (err) {
    console.error("❌ Server error:", err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

module.exports = addTaskRouter;
