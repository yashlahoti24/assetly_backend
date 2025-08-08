const db = require('./db');

const getHistory = (callback)=>{
    const query = 'select * from user_stocks order by purchase_date desc';
    db.query(query, callback)
}

module.exports = {
    getHistory
}