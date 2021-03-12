var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const { response, static } = require('express');


/** create connection */

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password :'',
    database : 'accounts'
});

var app = express();

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

/** sent all file Webpage to client */
app.use(express.static(path.join(__dirname)));
/**  ***************************    */


app.post('/auth', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    if (username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results,  fields) {
            if (results.length > 0) {
                request.session.loggedin = true;
                request.session.username = username;
                response.redirect('/home');
            }else{
                response.send('Incorrect Username Or Password');
            }
            response.end();
        });
    }else{
        response.send('Please enter Username and Password');
        response.end();
    }
})


app.get('/home',function(request, response){
    if (request.session.loggedin){
        response.send('Welcome Back ' + request.session.username);
    }else{
        response.send('Please login to view this page');
    }
    response.end();
});

/** port connection */
app.listen(3000);