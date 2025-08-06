const API_KEY = '04WF81VS40NKR97';  // Replace with your API key

// Function to fetch and display stock data (weekly, monthly, yearly)
async function getStockData() {
    const symbol = document.getElementById('symbol').value.trim().toUpperCase();

    if (!symbol) {
        alert("Please enter a stock symbol.");
        return;
    }

    const weeklyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${API_KEY}`;
    const monthlyUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${symbol}&apikey=${API_KEY}`;

    try {
        // Fetch Weekly Data
        const weeklyResponse = await fetch(weeklyUrl);
        const weeklyData = await weeklyResponse.json();

        // Fetch Monthly Data
        const monthlyResponse = await fetch(monthlyUrl);
        const monthlyData = await monthlyResponse.json();

        // Handle errors if the symbol is invalid or API call limit is exceeded
        if (weeklyData.Note || weeklyData.Error_Message || monthlyData.Note || monthlyData.Error_Message) {
            document.getElementById('stock-data').innerHTML = "Error: Invalid stock symbol or API call limit exceeded.";
            return;
        }

        // Extract Data for the Last 10 Weeks
        const weeklyPrices = extractWeeklyData(weeklyData);

        // Extract Data for the Last 10 Months
        const monthlyPrices = extractMonthlyData(monthlyData);

        // Calculate Yearly Averages from Monthly Data
        const yearlyPrices = calculateYearlyAverages(monthlyData);

        // Display Data in the HTML
        displayStockData(weeklyPrices, monthlyPrices, yearlyPrices);

        // Plot the data on the chart
        plotStockChart(weeklyPrices, monthlyPrices, yearlyPrices);

    } catch (error) {
        document.getElementById('stock-data').innerHTML = "Error fetching data. Please try again.";
        console.error(error);
    }
}

// Extract Weekly Data for the Last 10 Weeks
function extractWeeklyData(data) {
    const timeSeries = data["Weekly Time Series"];
    const dates = Object.keys(timeSeries).slice(0, 10);  // Get the last 10 weeks
    const prices = dates.map(date => ({
        date: date,
        price: timeSeries[date]["4. close"]
    }));
    return prices.reverse();  // Reverse to show the latest on the right
}

// Extract Monthly Data for the Last 10 Months
function extractMonthlyData(data) {
    const timeSeries = data["Monthly Time Series"];
    const dates = Object.keys(timeSeries).slice(0, 10);  // Get the last 10 months
    const prices = dates.map(date => ({
        date: date,
        price: timeSeries[date]["4. close"]
    }));
    return prices.reverse();  // Reverse to show the latest on the right
}

// Calculate Yearly Averages from Monthly Data
function calculateYearlyAverages(data) {
    const timeSeries = data["Monthly Time Series"];
    const dates = Object.keys(timeSeries).slice(0, 120); // Get data for 10 years (120 months)
    const yearlyPrices = [];
    for (let i = 0; i < dates.length; i += 12) {
        const yearData = dates.slice(i, i + 12).map(date => parseFloat(timeSeries[date]["4. close"]));
        const avgPrice = (yearData.reduce((sum, price) => sum + price, 0) / yearData.length).toFixed(2);
        yearlyPrices.push({
            year: new Date(dates[i]).getFullYear(),
            price: avgPrice
        });
    }
    return yearlyPrices.reverse(); // Reverse to show the latest year on the right
}

// Display the Data in the HTML
function displayStockData(weeklyPrices, monthlyPrices, yearlyPrices) {
    let output = `<h2>Stock Data</h2>`;

    // Weekly Data
    output += `<h3>Last 10 Weeks</h3>`;
    weeklyPrices.forEach(item => {
        output += `<p>Week: ${item.date}, Close Price: $${item.price}</p>`;
    });

    // Monthly Data
    output += `<h3>Last 10 Months</h3>`;
    monthlyPrices.forEach(item => {
        output += `<p>Month: ${item.date}, Close Price: $${item.price}</p>`;
    });

    // Yearly Data
    output += `<h3>Last 10 Years (Yearly Average)</h3>`;
    yearlyPrices.forEach(item => {
        output += `<p>Year: ${item.year}, Average Price: $${item.price}</p>`;
    });

    document.getElementById('stock-data').innerHTML = output;
}

// Plot the Data on a Live Market Chart (Chart.js)
function plotStockChart(weeklyPrices, monthlyPrices, yearlyPrices) {
    const ctx = document.getElementById('stockChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: [
                ...weeklyPrices.map(item => item.date),
                ...monthlyPrices.map(item => item.date),
                ...yearlyPrices.map(item => item.year)
            ],
            datasets: [{
                label: 'Stock Price',
                data: [
                    ...weeklyPrices.map(item => item.price),
                    ...monthlyPrices.map(item => item.price),
                    ...yearlyPrices.map(item => item.price),
                ],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: false,
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Time',
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)',
                    },
                    ticks: {
                        beginAtZero: false,
                    },
                },
            },
        }
    });
}







