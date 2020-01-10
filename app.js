const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const ejs = require('ejs');
const session = require('express-session');
const mysqlsession = require('express-mysql-session')(session);

const db = require('./db/mysql');

var app = express();

app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Set Session
app.use(session({
  secret : '3#(@29%8!#)',
  resave : false,
  saveUninitialized : true,
  store :new mysqlsession(db.dbInfo)
}));



var contentRouter = require('./routes/content');
app.use('/', contentRouter);

var inquireRouter = require('./routes/inquire');
app.use('/inquire', inquireRouter);

var downloadRouter = require('./routes/download');
app.use('/download', downloadRouter);

var managerRouter = require('./routes/manager');
app.use('/manager', managerRouter);

var basicRouter = require('./routes/basic');
app.use('/basic', basicRouter);

// Set init Database
db.createPool();

// Server Start
app.listen(app.get('port'), function() {
  console.log("# Start PHYSIs Kit Server..");
});

// MQTT Client Router
app.get('/mqttclient', (req, res) => {
  res.render('mqttclient');
});


/*
      Create Table
*/

const CT_Inquire_Board = "CREATE TABLE inquires ( " +
  "no int not null auto_increment primary key, " +
  "category varchar(10) not null, " +
  "content varchar(20) not null, " +
  "title varchar(255) not null, " +
  "user varchar(20) not null, " +
  "date varchar(15) not null, " +
  "description text(65535) not null, " +
  "replyState char(1) not null default '0', " +
  "reply text(65535), " +
  "pwdState char(1) not null default '0', " +
  "pwd varchar(30));";
db.query(CT_Inquire_Board, [], (res) => {
  console.log("@ Create Inquire Board Table : " + res.resCode);
});


const CT_Content = "CREATE TABLE contents ( " +
  "no int not null auto_increment primary key, " +
  "name varchar(100) not null, " +
  "name_kr varchar(100) not null, " +
  "outline varchar(255) not null, " +
  "description text(65535) not null, " +
  "main_img varchar(255) not null, " +
  "youtube varchar(255) not null, " +
  "visible char(2) not null default '0', " +
  "hits int not null default '0');";
db.query(CT_Content, [], (res) => {
  console.log("@ Create Content Table : " + res.resCode);
});

const CT_Content_img = "CREATE TABLE contentImgs ( " +
  "no int not null, " +
  "priority char(2) not null, " +
  "filename varchar(150) not null);";
db.query(CT_Content_img, [], (res) => {
  console.log("@ Create Content Image Table : " + res.resCode);
});


const CT_Download = "CREATE TABLE downloads ( " +
  "no int not null primary key, " +
  "name varchar(100) not null, " +
  "name_kr varchar(100) not null, " +
  "outline varchar(255) not null, " +
  "communication varchar(255) not null, " +
  "composition varchar(255) not null, " +
  "description text(65535) not null, " +
  "package varchar(150) not null, " +
  "menual varchar(150) not null, " +
  "arduino_code varchar(150) not null, " +
  "ex_arduino varchar(150), " +
  "reference_lib varchar(150), " +
  "android_apk varchar(150) not null, " +
  "ex_android varchar(255) not null, " +
  "android_git varchar(255) not null);";

db.query(CT_Download, [], (res) => {
  console.log("@ Create Download Table : " + res.resCode);
});

const CT_Kit_Software = "CREATE TABLE kitsoftware ( " +
  "no int not null auto_increment primary key, " +
  "version varchar(100) not null, " +
  "arduino_lib varchar(100) not null, " +
  "arduino_menual varchar(100) not null, " +
  "android_git varchar(100) not null, " +
  "android_menual varchar(100) not null);";

db.query(CT_Kit_Software, [], (res) => {
  console.log("@ Create Kit Software Table : " + res.resCode);
});

const CT_DIY_App = "CREATE TABLE diyapps ( " +
  "no int not null auto_increment primary key, " +
  "name varchar(100) not null, " +
  "reference varchar(255) not null, " +
  "main_img varchar(255) not null, " +
  "outline varchar(255) not null, " +
  "description text(65535) not null);";

db.query(CT_DIY_App, [], (res) => {
  console.log("@ Create DIY Application Table : " + res.resCode);
});
