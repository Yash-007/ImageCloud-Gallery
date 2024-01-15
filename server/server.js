require("dotenv").config();
const dbconfig = require('./dbConfig');
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Import user and data routes
const userRoute = require("./routes/userRoute");
const dataRoute = require('./routes/dataRoute');


// Set up routes for user and data endpoints
app.use("/api/users", userRoute);
app.use("/api/data", dataRoute);

const port = 6001;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
