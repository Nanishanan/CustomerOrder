const express = require('express');
const app = express();
const basicAuth = require('express-basic-auth');
const custRoutes = require('./routes/cred');
const dotenv = require('dotenv');
const schedules = require('./middleware/schedule');

dotenv.config( {path: './.env'} );

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/customer', basicAuth({
    users : { 'test':'passcode' },
    unauthorizedResponse: (req) => {
        return `Basic Auth Failed`
    }
}));

app.use('/customer', custRoutes);
// app.use('/schedule', schedules);

app.get('/', (req, res)=>{
    res.send("<h1>Welcome to Home Page</h1>");
})

app.listen(port, ()=>{
    console.log("Node running in port: " +port);
});
