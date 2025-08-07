const db = require('./db');

const getPortfolio = (callback)=>{
    const query = 'select * from user_stocks';
    db.query(query, callback)
}

module.exports = {
    getPortfolio
}