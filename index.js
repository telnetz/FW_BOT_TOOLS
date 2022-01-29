var express = require('express');
var request = require('request');
var app = express();
const dotenv = require('dotenv');
dotenv.config();

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

var port = 5055;


app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("A new request received at " + Date.now());
    next();  
 });

 app.post("/submit", (req, res)=>{
    const token = process.env.TOKEN
    const url_line_notification = "https://notify-api.line.me/api/notify";
    if (token == '') {
        res.end("");
    }

    request({
         method: 'POST',
         uri: url_line_notification,
         header: {
             'Content-Type': 'multipart/form-data',
         },
         auth: {
             bearer: token,
         },
         form: {
             message: req.body.detail
         },
     }, (err, httpResponse, body) => {
         if (err) {
             console.log(err)
         } else {
             console.log(body)
         }
     });
    
    console.log(req.body);
    res.end("yes");
});

app.listen(port, () => {console.log('server on' + port)});