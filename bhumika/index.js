const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;

// MySQL connection setup
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "n3u3da!",
  database: "assetly"
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to MySQL database!");
});

// Route to fetch all user stocks
app.get("/user-stocks", (req, res) => {
  connection.query("SELECT * FROM user_stocks", (err, results) => {
    if (err) {
      console.error("Error fetching user stocks:", err);
      return res.status(500).send("Error fetching data");
    }
    res.json(results);
  });
});

// Route to fetch all user gold
app.get("/user-gold", (req, res) => {
  connection.query("SELECT * FROM user_gold", (err, results) => {
    if (err) {
      console.error("Error fetching user gold:", err);
      return res.status(500).send("Error fetching data");
    }
    res.json(results);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
