const express = require('express');
const bodyParser  = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');
var passwordHash = require('password-hash');
var app = express.Router();

mongoose.connect('mongodb://localhost/blogs',{useNewUrlParser:true, useUnifiedTopology:true});

const blogSchema = new mongoose.Schema({
  title:String,
  content:String,
},{collection:'blogs'});
const userSchema = new mongoose.Schema({
  username:String,
  password:String,
},{collection:'users'});
var Blog = mongoose.model('Blog',blogSchema);
var User = mongoose.model('User',userSchema);
 blogs = [{title:'Blog 1', content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}]
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/static/'));
//app.set('view engine', 'ejs');

app.get('/', function(req,res){
  Blog.find({},function(err,items){
    if(items.length == 0){
      Blog.insertMany([
        {title:'Blog 1',
       content:'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'}
      ]);

      res.redirect('/');
      return;
    }
    blogs = items;
  res.render('blog/index',{blog:blogs});
});
});
app.get('/compose',function(req,res){
  res.render('blog/addBlog');
});
app.post('/compose', function(req,res){
  var blog = new Blog({
    title:req.body.title,
    content:req.body.content,
  });
  blog.save();
  blogs.push(blog);
  res.redirect('/blog');
});
app.get('/posts/:title',function(req,res){
  var title = req.params.title;
  var blogPost;
  for(var i  = 0;i< blogs.length;i++){
    if(title == blogs[i].title){
      blogPost = blogs[i];
      break;
    }
    else{
      blogPost = {
        title: '404',
        content:'webpage not found'
      }
    }
}
  res.render('blog/blog',{blog:blogPost});
});

app.get('/login',function(req,res){
  res.render('blog/login');
});
app.get('/signup',function(req,res){
  res.render('blog/signup');
});

app.post('/login',function(req,res){
  var hash = User.find({username:req.body.username}).password;
User.find({
  username:req.body.username,
},function(err,users){
  if(users.length == 0 || passwordHash.verify(req.body.password,hash) == true){
    res.send("Either the username of password is incorrect, please try again");
  }
  else{
res.redirect('/blog/compose');

}
})
});

app.post('/signup',function(req,res){
  var username = req.body.username;
  var hashedPassword = passwordHash.generate(req.body.password);
  var confirmp = req.body.confirmp;
  User.find({username:username}, function(err,users){
    if(users.length == 0){
      var newUser = new User({
        username:username,
        password:hashedPassword,
      });
      newUser.save();
      res.redirect('login');
    }
  else{
    res.send("Username already exists");
  }

});
});

module.exports = app;
