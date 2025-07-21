require("dotenv").config();
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./docs/swagger.json');

const PORT = process.env.APP_PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
const express = require("express");
const app = express();
swaggerSpec.servers = [
  {
    url: baseUrl
  }
]

const db = require("./models")
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const goalRoutes = require("./routes/goal");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());
app.get("/", (req, res) => {
  res.send({message: "Hello, welcome to ProCircle BE"});
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/goal", goalRoutes);


app.listen(PORT, () => {
  console.log(`Server started successfully at http://localhost:${PORT}`);
});
