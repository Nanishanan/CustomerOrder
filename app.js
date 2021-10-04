const express = require('express');
const app = express();
const custRoutes = require('./routes/cred');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use('/customer', custRoutes);

app.get('/', (req, res)=>{
    res.send("<h1>Welcome to Home Page</h1>");
})

app.listen(port, ()=>{
    console.log("Node running in port: " +port);
});