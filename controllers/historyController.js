const historyModel = require("../models/historyModel.js")

exports.getHistoryC = (req, res)=>{
    historyModel.getHistory((err, results)=>{
        if(err){
            console.error('Error fetching history:', err);
            res.status(500).json({error: 'Internal server error'});
        } else {
            res.json(results);
        }
    });
}