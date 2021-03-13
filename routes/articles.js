const express = require('express');
const router = express.Router();
const articleService = require('../services/articleService');

// define article paths for CRUD operations
const BASE = "/articles";
const WITH_ID = BASE + "/:id";  

const articlePaths = {
    GET: WITH_ID,
    CREATE: BASE,
    UPDATE: WITH_ID,
    DELETE: WITH_ID,
    SEARCH: BASE
};

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
 * GET multiple articles for specified page. 
 */
router.get('/', async function(req, res, next) {
  try {
    console.log('=========> articles.js router.getMultiple: path= /');
    res.json(await articleService.getMultiple(req.query.page));
  } catch (err) {
    console.error(`Error while getting articles `, err.message);
    next(err);
  }
});

/* 
 * CREATE article 
 */
router.post(articlePaths.CREATE, async function(req, res, next) {
  try {
    console.log('=========> articles.js router.post: path= ' + articlePaths.CREATE);
    console.log('=========> req.body= ' + req.body);
    console.log('=========> req.body.name= ' + req.body.name);
    console.dir('=========> req= ' + req);

    res.json(await articleService.create(req.body));
  } catch (err) {
    console.error(`Error while creating article`, err.message);
    next(err);
  }
});

/* 
 * UPDATE article 
 */
router.put(articlePaths.UPDATE, async function(req, res, next) {
  try {
    res.json(await articleService.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating article`, err.message);
    next(err);
  }
});

/* 
 * DELETE article 
 */
router.delete(articlePaths.DELETE, async function(req, res, next) {
  try {
    console.log('=========> articles.js router.delete: path= ' + userPaths.DELETE);
    res.json(await articleService.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting article`, err.message);
    next(err);
  }
});

module.exports = { 
  router: router,
  articlePaths 
};