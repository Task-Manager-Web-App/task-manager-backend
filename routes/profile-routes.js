const express = require("express");
const profileRouter = express.Router();
const { supabase } = require("../supabase-client.js");


// ======================== GET /profile/:userId  -> get profile + role ========================
profileRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // 1. Here we get the profile first (first_name, last_name) to check if user exists in profiles table.
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("first_name,last_name")
      .eq("user_id", userId)
      .maybeSingle();
    
    // Output would be like: Profile found: { first_name: 'John', last_name: 'Doe' } or null if not found
    console.log("Profile found:", profile);

    if (pErr) return res.status(400).json({ message: pErr.message });

    
    // 2. Here we get the role of the user from user_roles table. This is separate from profiles to allow for more flexible role management.
    const { data: roleRow, error: rErr } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    // Output would be like: Role found: { role: 'Admin' } or null if not found
    console.log("Role found:", roleRow);

    if (rErr) return res.status(400).json({ message: rErr.message });

    return res.json({
      user_id: userId,
      first_name: profile?.first_name ?? "",
      last_name: profile?.last_name ?? "",
      role: roleRow?.role ?? "User",
    });
  } 
  catch (err) {
    return res.status(500).json({ message: err?.message || "Server error" });
  }
  
});


// ======================== PUT /profile/:userId  -> update profile + role (upsert) ========================
profileRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { first_name, last_name, role } = req.body || {};

    // 1. Here we upsert the profile data (first_name, last_name) into profiles table
    const { error: profileErr } = await supabase
      .from("profiles")
      .upsert({
        user_id: userId,
        first_name: first_name ?? "",
        last_name: last_name ?? "",
        updated_at: new Date().toISOString(),
      });

    // Output would be like: Profile upserted successfully or error message
    console.log("Profile upserted:", profileErr ? profileErr.message : "Success");

    if (profileErr) return res.status(400).json({ message: profileErr.message });

    
    // 2. Here we check the current user role before allowing role change. Users with "User" role cannot change their role
    const currentUserRole = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();

    // Output would be like: Current role: { role: 'User' } or null if not found
    console.log("Current role:", currentUserRole.data);

    if (currentUserRole.error) return res.status(400).json({ message: currentUserRole.error.message });

    // Check if user is trying to CHANGE their role (not just sending the same role)
    const currentRole = currentUserRole.data?.role || "User";
    const isRoleChanging = role && role.toLowerCase() !== currentRole.toLowerCase();
    
    if (isRoleChanging && currentRole === "User") {
      return res.status(403).json({ message: "Users with 'User' role cannot change their role" });
    }

    
    // 3. Here we upsert the user role into user_roles table. This is separate from profiles to allow for more flexible role management
    const { error: roleErr } = await supabase
      .from("user_roles")
      .upsert({
        user_id: userId,
        role: role ?? "User",
        updated_at: new Date().toISOString(),
      });

    // Output would be like: Role upserted successfully or error message
    console.log("Role upserted:", roleErr ? roleErr.message : "Success");

    if (roleErr) return res.status(400).json({ message: roleErr.message });

    return res.json({ message: "Profile updated" });
  } 
  catch (err) {
    return res.status(500).json({ message: err?.message || "Server error" });
  }
});

module.exports = profileRouter;
