const express = require('express');
const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors())

const newsRoute = require("./routes/newsRoute")
app.use('/news', newsRoute)

const portfolioRoute = require('./routes/portfolioRoute');
app.use('/portfolio', portfolioRoute)


app.listen(8081, (err)=>{
    if(err)
        console.error(err);
    else
        console.log('Server is running on port 8081');
})