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
const host = process.env.APP_HOST || config.appHost;
const port = process.env.APP_PORT || config.appPort;
const secretKey = process.env.SECRET_KEY || config.secretKey;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

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

// static
app.use("/static", express.static(__dirname + "/public"));

// default root endpoint
app.get('/', (req, res) => {
  res.render('index');
//  res.json({'message': 'ok'});
})

console.log('userRouter.userPaths.SEARCH = ' + userRouter.userPaths.SEARCH);
console.log('userRouter.userPaths.DELETE = ' + userRouter.userPaths.DELETE);
console.log('userRouter.userPaths.CREATE = ' + userRouter.userPaths.CREATE);
console.log('userRouter.userPaths.UPDATE = ' + userRouter.userPaths.UPDATE);

// get list of users for specified page
app.use(userRouter.userPaths.SEARCH, userRouter.router);
// create new user
app.post(userRouter.userPaths.CREATE, userRouter.router);
// create new user
app.put(userRouter.userPaths.UPDATE, userRouter.router);
// delete specified user
app.delete(userRouter.userPaths.DELETE, userRouter.router);

console.log('articleRouter.articlePaths.SEARCH = ' + articleRouter.articlePaths.SEARCH);
console.log('articleRouter.articlePaths.DELETE = ' + articleRouter.articlePaths.DELETE);
console.log('articleRouter.articlePaths.CREATE = ' + articleRouter.articlePaths.CREATE);
console.log('articleRouter.articlePaths.UPDATE = ' + articleRouter.articlePaths.UPDATE);

// get list of articles for specified page
app.use(articleRouter.articlePaths.SEARCH, articleRouter.router);
// create new article
app.post(articleRouter.articlePaths.CREATE, articleRouter.router);
// create new article
app.put(articleRouter.articlePaths.UPDATE, articleRouter.router);
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