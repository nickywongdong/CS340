/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
const PORT = process.env.PORT || 5000



app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
//app.set('port', process.argv[2]);
app.set('port', PORT);
app.set('mysql', mysql);


app.use('/guardian', require('./guardian.js'));
app.use('/npc', require('./npc.js'));

app.get('/', function (req, res) {
res.render('index')
})

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Listening on ' + app.get('port'));
});
