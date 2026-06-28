const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

// Load Env
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect DB
const dbUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/eventDB";
mongoose.connect(dbUri)
  .then(async () => {
    console.log("MongoDB Connected");
    // Seed default admin
    try {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash("admin123", 10);
        const defaultAdmin = new Admin({
          username: "admin",
          password: hashedPassword
        });
        await defaultAdmin.save();
        console.log("Default admin seeded: admin / admin123");
      }
    } catch (err) {
      console.error("Admin seeding error:", err);
    }
  })
  .catch(err => console.error("MongoDB Connection Error:", err));

// Mount Modular Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/participants", require("./routes/participants"));

app.get("/", (req, res) => {
  res.send("Server Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
