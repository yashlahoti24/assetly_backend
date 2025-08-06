// const finnhub = require('finnhub');

// const finnhubClient = new finnhub.DefaultApi("d25i9ipr01qns40f3ilgd25i9ipr01qns40f3im0") // Replace this

// // Stock candles
// finnhubClient.stockCandles("AAPL", "D", 1590988249, 1591852249, (error, data, response) => {
//     console.log(data)
// });

const finnhub = require('finnhub');

// Set API Key
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = "d25i9ipr01qns40f3ilgd25i9ipr01qns40f3im0"; // your actual key

const finnhubClient = new finnhub.DefaultApi();

// Epoch timestamps
const from = Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60; // 7 days ago
const to = Math.floor(Date.now() / 1000); // now

// Fetch candle data
finnhubClient.stockCandles("AAPL", "D", from, to, (error, data, response) => {
    if (error) {
        console.error("Error:", error);
    } else {
        console.log("Stock Candles Data:", data);
    }
});
