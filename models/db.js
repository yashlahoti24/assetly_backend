const mysql = require('mysql');

const conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "n3u3da!",
    database: "Assetly"
})

conn.connect((err)=>{
    if(err)
        console.error('Database connection failed:', err);
    else
        console.log('Connected to the database');
})

module.exports = conn