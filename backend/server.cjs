// Load env FIRST (line 1)
require("dotenv").config();

// Express
const express = require("express");
const app = express();

// Mongoose
const mongoose = require("mongoose");

// CORS
const cors = require("cors");
app.use(cors());

// Routes
const userRoutes = require("./Users-module/users-module");
const eventRoutes = require("./Users-module/Employee");

// Middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/palz/users", userRoutes);

// DEBUG (VERY IMPORTANT)
console.log("MONGO_URI:", process.env.MONGO_URI);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(
        `✅ Connected to MongoDB & listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });
