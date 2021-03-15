const express = require('express');
const router = express.Router();
const helper = require('../helper');
const UserModel = require('../models/UserModel');
const BasicModel = require('../models/BasicModel');
const userService = require('../services/userService');

// define user paths for CRUD operations
const DASHBOARD = "/admin/dashboard";
const PROFILE = "/admin/profile";
const SIGNIN = "/signin";
const SIGNUP = "/signup";
const BASE = "/users";
const WITH_ID = BASE + "/:id";  

const userPaths = {
    GET: WITH_ID,
    CREATE: BASE,
    UPDATE: WITH_ID,
    DELETE: WITH_ID,
    SEARCH: BASE,
    SIGNIN: SIGNIN,
    SIGNUP: SIGNUP,
    DASHBOARD: DASHBOARD,
    PROFILE: PROFILE
};


/* 
 * POST login page (Sign In). 
 */
router.post(userPaths.SIGNIN, async function(req, res, next) {
  try {
    var params = req.body;
    var redirectToSignIn = false;
    var strErrorMessage = `Error while getting Users`;

    if (params.email.trim().length == 0) {
      // check email against empty string
      redirectToSignIn = true;
      strErrorMessage = `Please enter an email`;
     } else {
       // try to retrieve from database user by his email
        var data = await userService.getUserByEmail(params.email);

        if (data && data.userModel != null) {
            // if user exists in the database - check his password
            if (!helper.comparePassword(params.password, data.userModel.passwordHash)) {
                // if password does not match then set up redirect flag and error message
                redirectToSignIn = true;
                strErrorMessage = `Incorrect password`;
            } else {
                // login and password matches db user - set session and redirect to dashboard
                req.session.loggedin = true;
                req.session.user = data.userModel;
                // console.log(req.session.userModel.toString);
                res.redirect("admin/dashboard");
            }
        } else {
            // if user with specified email was not found in the database
            redirectToSignIn = true;
            strErrorMessage = `User does not exist`;
        }
      }

      if (redirectToSignIn) {
        // redirect to signin page with particular message
        next(err);
      }
    } catch (err) {
    console.error(strErrorMessage, err.message);
    res.render("signin", { data: { message:  strErrorMessage} });
  }
});


/* 
 * POST registration page (Sign Up). 
 */
router.post(userPaths.SIGNUP, async function(req, res, next) {
  try {
console.log('=========> articles.js router.postSignUp: path= ' + userPaths.SIGNUP);

      var userReq = req.body;
      var redirectToSignUp = false;
      var strErrorMessage = `Error while signing up`;

      if (userReq.email.trim().length == 0) {
          // check email against empty value
          // TODO: check correct email pattern
          redirectToSignUp = true;
          strErrorMessage = `Email is required`;
      } else if (userReq.passwd.trim().length == 0 || userReq.passwd != userReq.repasswd) {
          // check password
          redirectToSignUp = true;
          strErrorMessage = `Password does not match or empty`;
      } else if (userReq.firstname.trim().length == 0) {
          // check first name against empty value
          redirectToSignUp = true;
          strErrorMessage = `First name is required`;
      } else if (userReq.lastname.trim().length == 0) {
          // check last name against empty value
          redirectToSignUp = true;
          strErrorMessage = `Last name is required`;
      } else {
        // try to retrieve user from database to check if the email does not exist yet
        var data = await userService.getUserByEmail(userReq.email);

        if (!data || data.userModel == null) {
          // user with specified email does not exist within the database - can be created new one
          var password = helper.hashPassword(userReq.passwd);
    
          // create UserModel object from request body parameters
          var User = new UserModel(userReq.email, userReq.firstname, userReq.lastname, password, '');
      
          // add user
          var results = await userService.create(User);
          if (User.id != BasicModel.NEW_ID) {
              // after successfull signing up set up session and redirect to dashboard
              req.session.loggedin = true;
              req.session.username = User.firstName; 
              message = 'User created successfully';
              res.redirect("/admin/dashboard");
          }
        } else {
          // user with specified email already exists within the database - dont create and throw message
          redirectToSignUp = true;
          strErrorMessage = `Email already exists. Login or use another.`;
        }
      }

      if (redirectToSignUp) {
        // redirect to signup page with particular message
        next(err);
      }
  } catch (err) {
    console.error(strErrorMessage, err.message);
    res.render("signup", { data: { message: strErrorMessage } });
    next(err);
  }
});

/* 
 * GET multiple users for specified page. 
 */
router.get('/', async function(req, res, next) {
  try {
    console.log('=========> users.js router.getMultiple: path= /');
    res.json(await userService.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting Users `, err.message);
    next(err);
  }
});

/* 
 * CREATE user 
 */
router.post(userPaths.CREATE, async function(req, res, next) {
  try {
    console.log('=========> users.js router.post: path= ' + userPaths.CREATE);
    console.log('=========> req.body= ' + req.body);

    res.json(await userService.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

/* 
 * UPDATE user 
 */
router.post(userPaths.UPDATE, async function(req, res, next) {
  try {

    var userModel = null;
    var userReq = req.body;
    var strErrorMessage = `Error while updating user data`;

    if (userReq.email.trim().length == 0) {
        // check email against empty value
        // TODO: check correct email pattern
        strErrorMessage = `Email is required`;
    } else if (userReq.passwd.trim().length == 0 || userReq.passwd != userReq.repasswd) {
        // check password
        strErrorMessage = `Password does not match or empty`;
    } else if (userReq.firstname.trim().length == 0) {
        // check first name against empty value
        strErrorMessage = `First name is required`;
    } else if (userReq.lastname.trim().length == 0) {
        // check last name against empty value
        strErrorMessage = `Last name is required`;
    } else {

      var password = helper.hashPassword(userReq.passwd);
    
      // create UserModel object from request body parameters
      var userModel = new UserModel(userReq.firstname, userReq.lastname, userReq.email, password, userReq.profileinfo);
      var rows = await userService.update(req.params.id, userModel);
      // res.redirect(__dirname + 'admin/profile');
      res.render('admin/profile', { rows });
      // res.json(await userService.update(req.params.id, req.body));
    }

  } catch (err) {
    console.error(`Error while updating user`, err.message);
    next(err);
  }
});

/* 
 * DELETE user 
 */
router.delete(userPaths.DELETE, async function(req, res, next) {
  try {
    console.log('=========> users.js router.delete: path= ' + userPaths.DELETE);
    res.json(await userService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting user`, err.message);
    next(err);
  }
});

module.exports = { 
  router: router,
  userPaths 
};