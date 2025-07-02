require("dotenv").config();

const express = require("express");
const app = express();


const db = require("./models")
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const goalRoutes = require("./routes/goal");

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, welcome to ProCircle BE");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/goal", goalRoutes);


const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfully at http://localhost:${PORT}`);
});
