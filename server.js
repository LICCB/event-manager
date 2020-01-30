const express = require('express');
const bodyParser = require('body-parser');
const app = express()

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    res.render('index');
})

app.get('/createEvent', function (req, res) {
  res.render('createEvent');
})

app.post('/createEvent', function (req, res) {
    console.log(req.body);
    res.render('createEvent');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})