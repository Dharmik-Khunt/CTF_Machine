const express = require("express");
const cors = require("cors");

const caseRoutes = require("./routes/caseRoutes");
const investigationRoutes = require("./routes/investigationRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "online",
    message: "SOC Defensive CTF API is running",
    timestamp: new Date().toISOString(),
  });
});

// Case study routes
app.use("/api/cases", caseRoutes);

// Investigation routes
app.use("/api/investigation", investigationRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`SOC CTF backend running at http://localhost:${PORT}`);
});