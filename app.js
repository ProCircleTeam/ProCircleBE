require("dotenv").config();

const express = require("express");
const app = express();


const db = require("./models")
db.sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Unable to connect to the database:', err));


app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello, welcome to ProCircle BE");
});

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started successfuly at http://localhost:${PORT}`);
});
