const express = require('express');
const bodyParser = require('body-parser');

var app = express();
var blog = require('./blog');
app.use('/blog',blog);
app.use(express.static(__dirname+'/static/'));
app.use(bodyParser.urlencoded({extended:true}));
app.listen(3000);
app.get('/',function(req,res){
  res.render('index');
});
app.set('view engine','ejs');
app.get('/contact',function(req,res){
  res.render('form1');
});
app.post('/contact',function(req,res){
  res.redirect('/');
});
