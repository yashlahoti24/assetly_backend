const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3000;
const cors = require('cors');

app.use(cors());

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


app.use(express.json()); // Needed to parse JSON bodies

// Insert new stock investment
app.post("/user-stocks", (req, res) => {
  const { symbol, name, quantity, price, sector, amount, date } = req.body;

  const sql = `INSERT INTO user_stocks (STOCK_ID, STOCK_NAME, QUANTITY, PRICE, SECTOR, AMOUNT, PURCHASE_DATE)
               VALUES (?, ?, ?, ?, ?, ?, ?)`;

               console.log("entered here ")
  connection.query(sql, [symbol, name, quantity, price, sector, amount, date], (err, result) => {
    if (err) {
      console.error("Error inserting into user_stocks:", err);
      return res.status(500).send("Error inserting data");
    }
    res.status(200).json({ message: "Stock added successfully", id: result.insertId });
  });
});


app.post("/user-gold", (req, res) => {
  const { price, weight, amount, date } = req.body;

  const sql = `INSERT INTO user_gold (PRICE, WEIGHT, AMOUNT, PURCHASE_DATE)
               VALUES (?, ?, ?, ?)`;

  connection.query(sql, [price, weight, amount, date], (err, result) => {
    if (err) {
      console.error("Error inserting into user_gold:", err);
      return res.status(500).send("Error inserting data");
    }
    res.status(200).json({ message: "Gold investment added successfully", id: result.insertId });
  });
});

// Route to calculate net worth
app.get("/net-worth", (req, res) => {
  const stockQuery = "SELECT SUM(AMOUNT) AS totalStocks FROM user_stocks";
  const goldQuery = "SELECT SUM(AMOUNT) AS totalGold FROM user_gold";

  connection.query(stockQuery, (err, stockResults) => {
    if (err) {
      console.error("Error calculating stock amount:", err);
      return res.status(500).send("Error fetching stock amount");
    }

    connection.query(goldQuery, (err, goldResults) => {
      if (err) {
        console.error("Error calculating gold amount:", err);
        return res.status(500).send("Error fetching gold amount");
      }

      const totalStocks = stockResults[0].totalStocks || 0;
      const totalGold = goldResults[0].totalGold || 0;

      const netWorth = totalStocks + totalGold;

      console.log("networth is: "+ netWorth)
      res.json({ netWorth });
    });
  });
});

// Route to fetch total investment amounts for stocks and gold
app.get("/total-investments", (req, res) => {
  const stockQuery = "SELECT SUM(AMOUNT) AS totalStocks FROM user_stocks";
  const goldQuery = "SELECT SUM(AMOUNT) AS totalGold FROM user_gold";

  connection.query(stockQuery, (err, stockResults) => {
    if (err) {
      console.error("Error calculating total stock amount:", err);
      return res.status(500).send("Error fetching stock amount");
    }

    connection.query(goldQuery, (err, goldResults) => {
      if (err) {
        console.error("Error calculating total gold amount:", err);
        return res.status(500).send("Error fetching gold amount");
      }

      const totalStocks = stockResults[0].totalStocks || 0;
      const totalGold = goldResults[0].totalGold || 0;

      res.json({ stocks: totalStocks, gold: totalGold });
    });
  });
});

// Route to fetch sector distribution from user_stocks
app.get("/sector-distribution", (req, res) => {
  const sql = `
    SELECT SECTOR, COUNT(*) AS count 
    FROM user_stocks 
    GROUP BY SECTOR
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching sector distribution:", err);
      return res.status(500).send("Error fetching sector distribution");
    }

    const labels = results.map(row => row.SECTOR);
    const data = results.map(row => row.count);

    res.json({ labels, data });
  });
});




// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
