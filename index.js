const express = require('express');
const cors = require('cors');
const connection = require('./models/db')
const port = 8081;

const app = express()
app.use(express.json())
app.use(cors())

const newsRoute = require("./routes/newsRoute")
app.use('/news', newsRoute)

const portfolioRoute = require('./routes/portfolioRoute');
app.use('/portfolio', portfolioRoute)

const historyRoute = require('./routes/historyRoute')
app.use('/history', historyRoute)

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

  // Insert new stock investment
app.post("/user-stocks", (req, res) => {
    const { symbol, name, quantity, price, sector, amount, date } = req.body;
  
    const sql = `INSERT INTO user_stocks (STOCK_ID, STOCK_NAME, QUANTITY, PRICE, SECTOR, PURCHASE_DATE)
                 VALUES (?, ?, ?, ?, ?, ?)`;
  
                 console.log("entered here ")
    connection.query(sql, [symbol, name, quantity, price, sector, date], (err, result) => {
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
  
  // Route to fetch current month's total expense
  app.get("/current-expense", (req, res) => {
    const stockQuery = `
      SELECT SUM(AMOUNT) AS totalStocks 
      FROM user_stocks 
      WHERE MONTH(PURCHASE_DATE) = MONTH(CURRENT_DATE()) AND YEAR(PURCHASE_DATE) = YEAR(CURRENT_DATE())
    `;
  
    const goldQuery = `
      SELECT SUM(AMOUNT) AS totalGold 
      FROM user_gold 
      WHERE MONTH(PURCHASE_DATE) = MONTH(CURRENT_DATE()) AND YEAR(PURCHASE_DATE) = YEAR(CURRENT_DATE())
    `;
  
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
        const totalExpense = totalStocks + totalGold;
  
        res.json({ totalExpense });
      });
    });
  });

app.listen(8081, (err)=>{
    if(err)
        console.error(err);
    else
        console.log('Server is running on port 8081');
})