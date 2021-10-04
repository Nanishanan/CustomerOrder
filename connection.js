const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config( {path: './.env'} );

var connection = mysql.createConnection(
    {
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE,
        multipleStatements: true
    }
);

connection.connect((err)=>{
    if(!err)
        console.log("MYSQL Server up and running");
    else 
        console.log("Error connecting " + JSON.stringify(err));
});

module.exports = connection;