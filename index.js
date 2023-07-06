import express from 'express';
import bodyParser from 'body-parser';

import dbConnect from './connectivity.js';
import { authRouter } from './router/authRouter.js';


const apiPrefix = process.env.API_PRIFEX;
const port = process.env.PORT || 4000;

const app=express();
app.use(express.static('public'));
app.use(bodyParser.json());
// Configure bodyParser to handle post requests
app.use(bodyParser.urlencoded({ extended: true }));

app.use(apiPrefix,authRouter);



dbConnect();


app.get("/",(req,res)=>{
    res.send("welcome to application");
})

app.listen(port,(req,res)=>{
    console.log(`server is running at ${port}`);
})
