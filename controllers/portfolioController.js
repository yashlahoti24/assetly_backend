const portfolioModel = require("../models/portfolioModel.js")

exports.getPortfolioC = (req, res)=>{
    portfolioModel.getPortfolio((err, results)=>{
        if(err){
            console.error('Error fetching portfolio:', err);
            res.status(500).json({error: 'Internal server error'});
        } else {
            res.json(results);
        }
    });
}