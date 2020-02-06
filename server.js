const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('index');
});

app.get('/createEvent', function (req, res) {
  res.render('createEvent');
});

app.post('/createEvent', function (req, res) {
    console.log(req.body);
    res.render('createEvent');
});

app.get('/publicSignup', function (req, res) {
  res.render('publicSignup');
});

app.post('/publicSignup', function (req, res) {
    console.log(req.body);
    res.render('publicSignup');
});

app.get('/privateSignup', function (req, res) {
  res.render('privateSignup');
});

app.post('/privateSignup', function (req, res) {
    console.log(req.body);
    res.render('privateSignup');
});

app.get('/volunteerSignup', function (req, res) {
  res.render('volunteerSignup');
});

app.post('/volunteerSignup', function (req, res) {
    console.log(req.body);
    res.render('volunteerSignup');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});