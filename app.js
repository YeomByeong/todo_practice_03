const express = require('express');
const app = express();

require("dotenv").config();

const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");


let indexRouter = require("./routes/index");
let todoRouter = require("./routes/todo");
let accountRouter = require("./routes/account");


//const bodyParser = require("body-parser");

mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to MongoDB!");

    app.use(express.static("public"));
    app.use(express.json());
    //app.use(bodyParser.urlencoded({extended: false}));
    app.use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
    }));


    app.use("/", indexRouter);
    app.use("/todo", todoRouter);
    app.use("/account", accountRouter);

});


app.listen(3000);