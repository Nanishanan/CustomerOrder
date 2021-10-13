const express = require('express');
const router = express.Router();
const connection = require('../connection');
const schedule = require('node-schedule');

//SubOrder API's
//insert subOrder
const placeSubOrder = function(){

        var sql = "SELECT * from orders WHERE ((current_date() = DATE_ADD(opd,interval mul day)) or (opd = current_date())) AND (noll != 0)";

        connection.query(sql, (err, rows)=>{
            if(!err){
                if(rows){
                    rows.forEach(row => {
                        updateSubOrder(row);
                        });
                    } 
            } else {
                console.log(err);
            }
        })
}

function updateSubOrder(row){
    var sql = "set @id=?; SET @orderID=?; SET @name=?; SET @ocd=?; SET @opd=?; \
            CALL subOrderInsertion(@id, @orderID, @name, @ocd, @opd);";
    connection.query(sql, [row.id, row.orderID, row.name, row.ocd, row.opd], (err, r)=>{
        if(!err)
            console.log("Sub Order ID: " +r[5][0].subOrderID);
            // res.send(r);
        else 
            console.log(JSON.stringify(err));
    });
}

// schedule.scheduleJob('*/3 * * * * *', function(){
schedule.scheduleJob('0 30 0 * * *', function(){ //-> Scheduled to run at 12:30 AM each day
    placeSubOrder();
});

module.exports = router;
