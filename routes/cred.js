const { json } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../connection');

router.post('/signup', (req, res)=>{
    var sql = "SET @id=?; SET @name=?; SET @email=?; SET @password=?; SET @mobile=?; SET @deviceName=?; SET @deviceModel=?; SET @firebaseID=?; \
    CALL insertorupdatecust(@id, @name, @email, @password, @mobile, @deviceName, @deviceModel, @firebaseID)";
    var cust = req.body;

    connection.query(sql, [0, cust.name, cust.email, cust.password, cust.mobile, cust.deviceName, cust.deviceModel, cust.firebaseID], (err, rows)=>{
        if(!err)
            return res.send(rows[8]);
        else    
            console.log("Error inserting record" +JSON.stringify(err));
            return res.send(JSON.stringify(err));
    });
});

router.post('/login', (req, res)=>{
    var sql = "SELECT * from customers WHERE email=? AND password=?";
    var cust = req.body;
    connection.query(sql, [cust.email, cust.password], (err, row)=>{
        if(!err){
            if(row[0])
                res.send(row);
            else    
                res.send("Wrong Credentials entered. Please give the correct username and password");
        }
        else    
            res.send(JSON.stringify(err));
    });
});

router.get('/adminuser', (req, res)=>{
    var sql = "SELECT * from customers";
    connection.query(sql, (err, rows)=>{
        if(!err)
            return res.send(rows);
        else    
            res.send(JSON.stringify(err));
    });
});

module.exports = router;
 