/**
 * Module dependencies.
 */
const express = require('express');
const session = require("express-session");
// const bodyParser = require('body-parser');
// configuration properties: db connection, app. settings etc. 
const config = require('./config');
require("dotenv").config();

const app = express();

// try to read config data from .env file or set up default if .env file wasn't found
const host = process.env.APP_SALT_ROUND || config.appHost;
const port = process.env.APP_PORT || config.appPort;
const secretKey = process.env.SECRET_KEY || config.secretKey;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

// TODO: Can I call service here ?
const articleService = require('./services/articleService');
const userService = require('./services/userService');

// use the json
app.use(express.json()); // for parsing application/json
// want to use complex algorithm for deep parsing 
// that can deal with nested objects (value = true)
// otherwise is used a simple algorithm for shallow parsing (value = false)
//   extended: true,
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// commented becouse of message 'deprecated' 
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true,}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: secretKey,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// view files .ejs
app.set("views",__dirname + "/views");
app.set("view engine", "ejs");

/*
let ejsOptions = {
  // delimiter: '?', Adding this to tell you do NOT use this like I've seen in other docs, does not work for Express 4
  async: true
};

// The engine is using a callback method for async rendering
app.engine('ejs', async (path, data, cb) => {
  try{
    let html = await ejs.renderFile(path, data, ejsOptions);
    cb(null, html);
  }catch (e){
    cb(e, '');
  }
});
*/

// static
app.use("/static", express.static(__dirname + "/public"));

// default root endpoint
app.get('/', (req, res) => {
  res.redirect(articleRouter.articlePaths.SEARCH);
//  res.json({'message': 'ok'});
})

// about page endpoint
app.get('/about', (req, res) => {
  res.render('about');
//  res.json({'message': 'ok'});
})

// login page endpoint
app.get(userRouter.userPaths.SIGNIN, (req, res) => {
  res.render('signin', { data: {} });
//  res.json({'message': 'ok'});
})

// signup page endpoint
app.get(userRouter.userPaths.SIGNUP, (req, res) => {
  res.render('signup', { data: {} });
  // res.json({'message': 'ok'});
})

// logout page endpoint
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect(articleRouter.articlePaths.SEARCH);
//  res.json({'message': 'ok'});
})

// article edit page endpoint
app.get(articleRouter.articlePaths.UPDATE, async function(req, res, next) {
  try {
    var strErrorMessage = `Error while getting Article data`;
    if (req.session.loggedin && req.session.user.id != -1) {
console.log('req.session.user.id=' + req.session.user.id);
console.log('req.article.id=' + req.params.id);
      var rows = await articleService.getArticleById(req.params.id);
//console.log('rows.message=' + rows.message);
      res.render('admin/article', { rows });
    } else {
      strErrorMessage = `Please log in first`;
    }
    // res.json({'message': 'ok'});
  
} catch (err) {
  
  console.error(strErrorMessage, err.message);
  res.render('signin', { data: { message: strErrorMessage } });
  next(err);
}  
})


// dashboard page endpoint
app.get(userRouter.userPaths.DASHBOARD, async function(req, res, next) {
  try {
      var strErrorMessage = `Error while getting User articles `;
      if (req.session.loggedin && req.session.user.id != -1) {
console.log('======>' + userRouter.userPaths.DASHBOARD + 'req.session.user.id=' + req.session.user.id);
        var rows = await articleService.getMultiple(req.session.user.id, req.query.page);
        res.render('admin/dashboard', { rows });
      } else {
        strErrorMessage = `Please log in first`;
      }
      // res.json({'message': 'ok'});
    
  } catch (err) {
    console.error(strErrorMessage, err.message);
    res.render('signin', { data: { message: strErrorMessage } });
    next(err);
  }    
})

// dashboard page endpoint
app.get(userRouter.userPaths.PROFILE, async function(req, res, next) {
  try {
      var strErrorMessage = `Error while getting User data`;
      if (req.session.loggedin && req.session.user.id != -1) {
console.log('req.session.user.id=' + req.session.user.id);
        var rows = await userService.getUserById(req.session.user.id);
//console.log('rows.message=' + rows.message);
        res.render('admin/profile', { rows });
      } else {
        strErrorMessage = `Please log in first`;
      }
      // res.json({'message': 'ok'});
    
  } catch (err) {
    
    console.error(strErrorMessage, err.message);
    res.render('signin', { data: { message: strErrorMessage } });
    next(err);
  }    
})

// get list of users for specified page
app.use(userRouter.userPaths.SEARCH, userRouter.router);
// sign up the new user
app.post(userRouter.userPaths.SIGNUP, userRouter.router);
// sign in existing user
app.post(userRouter.userPaths.SIGNIN, userRouter.router);
// create new user
app.post(userRouter.userPaths.CREATE, userRouter.router);
// update existing user
app.post(userRouter.userPaths.UPDATE, userRouter.router);
// delete specified user
app.delete(userRouter.userPaths.DELETE, userRouter.router);

// get list of articles for specified page
app.use(articleRouter.articlePaths.SEARCH, articleRouter.router);
// create new article
app.post(articleRouter.articlePaths.CREATE, articleRouter.router);
// update existing article
app.post(articleRouter.articlePaths.UPDATE, articleRouter.router);
// delete specified article
app.delete(articleRouter.articlePaths.DELETE, articleRouter.router);


// Error handler middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({'message': err.message});

  return;
});

app.listen(port, () => {
    console.log(`Blog demo application listening at http://${host}:${port}`)
  });