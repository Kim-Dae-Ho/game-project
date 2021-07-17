const express = require("express");
const app = express();
const router = require("./routes/router.js");
const body = require("body-parser");
const ejs = require("ejs");
const fs = require("fs");
const bodyParser = require('body-parser');
const multer = require("multer");
const mongoose = require("mongoose");
const soket = require('socket.io');
const http = require('http');
const server = http.createServer(app);


app.use(body.urlencoded({ extended: false }));
//post방식으로 데이터를 처리할 때 사용하는 기능

const session = require("express-session");

const mysql_session = require("express-mysql-session");
//세션 저장공간설정(mysql)

let conn = {
    host: "localhost",
    user: "root",
    password: "1234",
    port: "3306",
    database: "game_db"
}

let sessionSave = new mysql_session(conn);
//세션저장공간 설정 기능을 사용

app.use(session({
    secret: "smart_session", //세션ID 설정
    resave: false, //세션을 항상 저장할 것인지
    saveUninitialized: true, //세션을 저장할 때 마다 초기화할건지
    store: sessionSave
}));

app.set("view engine", "ejs");
//express에서 가지고 있는 view engine 중에 ejs라는 기능을 사용

app.use(router);
app.use(bodyParser.json());
app.listen(3100, function () {
    console.log("서버 실행중");
});

app.use(express.json());