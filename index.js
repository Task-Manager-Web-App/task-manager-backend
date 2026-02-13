// Load .env FIRST (CommonJS style)
require("dotenv").config({ path: "./.env" });

// Quick check to confirm env is loading
console.log(
  "ENV CHECK:",
  process.env.SUPABASE_URL ? "LOADED" : "NOT LOADED"
);

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ======================= BASIC ROUTE =======================
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// ======================= ROUTES =======================

// Sample Routes ------------------------------------
const sampleTasksRouter = require("./routes/sample-route");
app.use("/sample-tasks", sampleTasksRouter);

const sampleLoginRouter = require("./routes/sample-login");
app.use("/sample-login", sampleLoginRouter);

// Actual Routes ------------------------------------
const loginRouter = require("./routes/login-routes");
app.use("/login", loginRouter);

const registerRouter = require("./routes/register-routes");
app.use("/register", registerRouter);

const profileRouter = require("./routes/profile-routes");
app.use("/profile", profileRouter);

const tasksRouter = require("./routes/tasks-routes");
app.use("/tasks", tasksRouter);

const addTaskRouter = require("./routes/addTask-route");
app.use("/add-task", addTaskRouter);

// ======================= SERVER START =======================
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
