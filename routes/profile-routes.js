const express = require("express");
const profileRouter = express.Router();

const { supabase } = require("../supabase-client.js");

// GET /profile/:userId  -> get profile + role
profileRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("first_name,last_name")
      .eq("user_id", userId)
      .maybeSingle();

    if (pErr) return res.status(400).json({ message: pErr.message });

    const { data: roleRow, error: rErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    if (rErr) return res.status(400).json({ message: rErr.message });

    return res.json({
      user_id: userId,
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      role: roleRow?.role ?? "User",
    });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

// PUT /profile/:userId  -> update profile + role (upsert)
profileRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, role } = req.body || {};

    // profiles upsert
    const { error: upProfileErr } = await supabase.from("profiles").upsert({
      user_id: userId,
      first_name: first_name ?? "",
      last_name: last_name ?? "",
      updated_at: new Date().toISOString(),
    });

    if (upProfileErr) return res.status(400).json({ message: upProfileErr.message });

    // user_roles upsert
    const { error: upRoleErr } = await supabase.from("user_roles").upsert({
      user_id: userId,
      role: role ?? "User",
      updated_at: new Date().toISOString(),
    });

    if (upRoleErr) return res.status(400).json({ message: upRoleErr.message });

    return res.json({ message: "Profile updated" });
  } catch (err) {
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

module.exports = profileRouter;
