const express = require("express"); //Express
const path = require("path");
const mysql = require("mysql"); //MySQL
const dotenv = require("dotenv"); //DotEnv
const cookieParser = require('cookie-parser'); //Cookie Parser

dotenv.config({ path: './.env'}); //DotEnv connect

const app = express();
const http=require('http').createServer(app);
const io=require('socket.io').listen(http);


// MySql connect start
const db = mysql.createConnection({
  host     : process.env.DATABASE_HOST,
  user     : 'NodeUser',
  password : process.env.DATABASE_PASSWORD,
  database : process.env.DATABASE
});

const publicDirectory = path.join(__dirname,'./public');
app.use(express.static(publicDirectory));  //app -> http

//as sent by html forms
app.use(express.urlencoded({ extended: false})); //app -> http
//as sent by API clients
app.use(express.json()); //app -> http
app.use(cookieParser()); //app -> http

app.set('view engine', 'hbs') //app -> http

//ubrat name password-2, password 2 na server ne otpravlayut
db.connect( error=> {
    if(error)
      {
        console.log(error);
      }
        else {
          console.log("\n   !!!MySQL connect...!!!\n");
        }
});

//db.end();
// MySql connect end

//Define Routes
app.use('/', require('./routes/pages')); // app -> http
app.use('/auth', require('./routes/auth')); // app -> http
//Define Routes

http.listen(80, () =>
{
  console.log("\n   !!!Server started!!!");
});


// taxi code start

var cID,payDriver,disDriver,urlDriver;
var coordinateDriver=[[],[]];
var input_val_driver=[[],[]];
/* --
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});

var public_key=key.exportKey('public');*/ //--
/*const text = 'Hello RSA!';
const encrypted = key.encrypt(text, 'base64');
console.log('encrypted: ', encrypted);
const decrypted = key.decrypt(encrypted, 'utf8');
console.log('decrypted: ', decrypted);*/


io.sockets.on('connection', function(socket)
    {
      /* test start */
      socket.on('coordinate',function(coordinate,pay,dis,url,input_val)  //harcumenq katarum coordinate ev gin stanalu hamar
      {
        console.log("A: "+coordinate[0],"\nB: "+coordinate[1],"\nPay: "+pay+" AMD","\nDistance: "+dis,"\nurl:"+url,"\nАдрес клиента: "+ input_val[0],"\nАдрес назначения: "+ input_val[1]);
        coordinateDriver=coordinate;
        payDriver=pay;
        disDriver=dis;
        urlDriver=url;
        input_val_driver=input_val;

      //  socket.emit('coordriver',coordinateDriver,payDriver,disDriver);

      });

        socket.emit('coordriver',coordinateDriver,payDriver,disDriver,urlDriver,input_val_driver);

});
