const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const loginRouter = require('./routers/login');
const registerRouter = require("./routers/register");
const productsRouter = require("./routers/products");
const userRouter = require("./routers/user");
const cardRouter = require("./routers/Card");
const orderRouter = require("./routers/order");
const stripRouter = require("./routers/strip");

const app = express()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}))
mongoose.connect(process.env.DB_URL)
.then(()=>console.log('the dataBase is connected successfully!'))
.catch((error) =>
console.log(error))


app.get("/",(req,res) =>{
    res.status(201).json({message:"hello world !"})
});

//ALL ROUTERS MUST BE HERE
app.use('/login', loginRouter);
app.use("/register", registerRouter);
app.use("/products", productsRouter);
app.use("/",userRouter);
app.use("/card",cardRouter);
app.use("/order",orderRouter);
app.use("/",stripRouter);




const PORT = process.env.PORT||5000;
app.listen(PORT,()=>{
    console.log(`the api is running on ${PORT}`)
})
