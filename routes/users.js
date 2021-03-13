const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

// define user paths for CRUD operations
const BASE = "/users";
const WITH_ID = BASE + "/:id";  

const userPaths = {
    GET: WITH_ID,
    CREATE: BASE,
    UPDATE: WITH_ID,
    DELETE: WITH_ID,
    SEARCH: BASE
};


//router.param('id', function (req, res, next, id) {
  // sample user, would actually fetch from DB, etc...
//  req.user = {
//    id: id,
//    name: 'JEEL'
//  }
//  next()
//})

/*
router.route(WITH_ID)
  .all(function (req, res, next) {

  // runs for all HTTP verbs first
  // think of it as route specific middleware!
    next()
  })
  .get(function (req, res, next) {
    res.json(req.user)
  })
  .put(function (req, res, next) {
  // just an example of maybe updating the user
    req.user.name = req.params.name
    // save user ... etc
    res.json(req.user)
  })
  .post(function (req, res, next) {
    next(new Error('not implemented'))
  })
  .delete(function (req, res, next) {
    next(new Error('not implemented'))
  })
*/

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
    console.log('=========> req.body.name= ' + req.body.name);
    console.dir('=========> req= ' + req.body);

    res.json(await userService.create(req.body));
  } catch (err) {
    console.error(`Error while creating user`, err.message);
    next(err);
  }
});

/* 
 * UPDATE user 
 */
router.put(userPaths.UPDATE, async function(req, res, next) {
  try {
    res.json(await userService.update(req.params.id, req.body));
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