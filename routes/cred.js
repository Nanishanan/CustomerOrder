const { json } = require('express');
const express = require('express');
const router = express.Router();
const connection = require('../connection');
const jwt = require('jsonwebtoken');
const auth = require('../controller/jwtAuth');
const dotenv = require('dotenv');
dotenv.config( {path: './.env'} );

//Signup Customer API
router.post('/signup', (req, res)=>{
    var sql = "SET @id=?; SET @name=?; SET @email=?; SET @password=?; SET @mobile=?; SET @deviceName=?; SET @deviceModel=?; SET @firebaseID=?; \
    CALL insertorupdatecust(@id, @name, @email, @password, @mobile, @deviceName, @deviceModel, @firebaseID)";
    var cust = req.body;

    connection.query(sql, [0, cust.name, cust.email, cust.password, cust.mobile, cust.deviceName, cust.deviceModel, cust.firebaseID], (err, rows)=>{
        if(!err)
            // return res.send(rows[8]);
            return res.json({row: row[8], token: generateAuth(row[8].password)});
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
            if(row[0]) {
                res.json({row: row, token: generateAuth(row[0].password)});
                // res.end();
                // console.log(generateAuth(row[0].password));
            } else    
                res.send("Wrong Credentials entered. Please give the correct username and password");
        }
        else    
            res.send(JSON.stringify(err));
    });
});

//Update password
router.post('/:id/changepassword', auth, (req, res)=>{
    var sql = "update customers set password=? where (id=? AND password=?)";
    connection.query(sql, [req.body.newPassword, req.params.id, req.body.oldPassword], (err, row)=>{
        if(!err){
            if(row.info[14] == "0")
                return res.send("Old Password Incorrect");
            else
                return res.send("Password Changed")
        } else  
            res.send(JSON.stringify(err));
    });
});

//Order Table API's
//Place Order
router.post('/order', auth, (req, res)=>{

    var sql="SET @id=?; SET @orderID=?; SET @mobile=?; SET @name=?; SET @amount=?;  SET @nod=?; SET @opd=?; SET @nol=?; SET @comments=?; \
             SET @orderStatus=?; SET @returnsAmount=?; SET @returnStatus=?; SET @payArrDate=?; SET@noll=?; \
             CALL insertorUpdateOrder(@id, @orderID, @mobile, @name, @amount, @nod, @opd, @nol, @comments, @orderStatus, @returnsAmount, @returnStatus, @payArrDate, @noll)";

    var custBody = req.body;                

    connection.query(sql, [custBody.id, 0, custBody.mobile, custBody.name, custBody.amount, custBody.nod, custBody.opd, 
                            custBody.nol, custBody.comments, custBody.orderStatus, custBody.returnsAmount, custBody.returnStatus, 
                            custBody.payArrDate, custBody.nol], (err, row)=>{
        if(!err) {
            return res.send(row[14]);
        } else
            return res.send(JSON.stringify(err));
    });
});

//Order details for specific order
router.get('/orderDetails/:orderID/', auth, (req, res)=>{
    var sql = "SELECT * from subOrders where orderID=?";

    connection.query(sql, [req.params.orderID], (err, rows)=>{
        if(!err)
            return res.send(rows);
        else
            return res.send(JSON.stringify(err));
    });
});

//All order details
router.get('/orderDetails', auth, (req, res)=>{
    var sql = "SELECT * from orders where id=?";

    connection.query(sql, [req.body.id], (err, rows)=>{
        if(!err)
            return res.send(rows);
        else
            return res.send(JSON.stringify(err));
    });
});

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

function generateAuth(user){
    const token = jwt.sign({ id: user }, process.env.SECRET_KEY);
    return token;
}   

module.exports = router;
 