const { json } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../connection');
const schedule = require('node-schedule');

//Signup Customer API
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


//Login API
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

//Order Table API's
//Place Order
router.post('/order', (req, res)=>{

    var sql="SET @id=?; SET @orderID=?; SET @mobile=?; SET @name=?; SET @amount=?;  SET @nod=?; SET @opd=?; SET @nol=?; SET @comments=?; \
             SET @orderStatus=?; SET @returnsAmount=?; SET @returnStatus=?; SET @payArrDate=?; \
             CALL insertorUpdateOrder(@id, @orderID, @mobile, @name, @amount, @nod, @opd, @nol, @comments, \
                                     @orderStatus, @returnsAmount, @returnStatus, @payArrDate)";

    var custBody = req.body;                

    connection.query(sql, [custBody.id, 0, custBody.mobile, custBody.name, custBody.amount, custBody.nod, custBody.opd, 
                            custBody.nol, custBody.comments, custBody.orderStatus, custBody.returnsAmount, custBody.returnStatus, 
                            custBody.payArrDate], (err, row)=>{
        if(!err)
            return res.send(row[13]);
        else
            return res.send(JSON.stringify(err));
    });
});


router.get('/orderDetails', (req, res)=>{
    var sql = "SELECT * from orders";

    connection.query(sql, (err, rows)=>{
        if(!err)
            return res.send(rows);
        else
            return res.send(JSON.stringify(err));
    });

});

//SubOrder API's
//insert subOrder
const placeSubOrder = function(){
    router.post('/order/:oID/subOrderInsert', (req, res)=>{
        var sql = "SELECT count(subOrderID) from subOrders WHERE orderID = ?"
        connection.query(sql, [req.params.oID], (err, rows)=>{
            if(!err){
                if(rows){
                    var ordBody = req.body;
                    var sql2 = "INSERT into subOrders(id, orderID, name, ocd, opd, versionNumber) \
                                values(?,?,?,?,?,?)"
                    connection.query(sql2, [ordBody.id, ordBody.orderID, ordBody.name. ordBody.ocd, ordBody.opd, (ordBody.versionNumber + 0.1)], (error, row)=>{
                        if(!error)
                            console.log(row);
                        else    
                            console.log(JSON.stringify(error));
                    });                  
                } else {
                    //check order placed date and insert new row
                }
            } else {
                res.send(JSON.stringify(err));
            }
        })
    });
}

schedule.scheduleJob('0 30 0 * * *', function(){
    placeSubOrder();
});


// router.post('/order/list', (req, res)=>{
//     var sql = "SELECT count(orderID) as cnt from orders"
//     connection.query(sql, (err, rows)=>{
//         if(!err){
//             var cnt = String(rows[0].cnt);
//             res.send(cnt);      
//         } else {
//             res.send(JSON.stringify(err));
//         }
//     })
// });

// Check all the users
router.get('/adminuser', (req, res)=>{

    var sql = "SELECT * from customers";
    connection.query(sql, (err, rows)=>{
        if(!err)
            return res.send(rows);
        else    
            return res.send(JSON.stringify(err));
    });
});


// function basicAuth(req){
//     var users = {
//         "user":"test",
//         "password":"passcode"
//     };
//     const base64Credentials =  req.headers.authorization.split(' ')[1];;
//     const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
//     const [uname, pass] = credentials.split(':');

//     if(!((uname === users.user) && (pass === users.password))){
//         console.log("Basic Auth: Failed");
//         return false;
//     }
//     return true;
// }

module.exports = router;
 