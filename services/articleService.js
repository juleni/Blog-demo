/*
 * Article service - the bridge between the route and the database
 */

const db = require('./database');
const helper = require('../helper');
const config = require('../config');
const articleModel = require('../models/ArticleModel');

/**
 * Get multiple articles for specified page
 * 
 * @param userId - user id the articles will be retrieved for
 * @param {*} page - page number the articles will be retrieved for
 * @returns list of articles or empty, page number
 */
async function getMultiple(userId, page = 1){
  const offset = helper.getOffset(page, config.appListPerPage);

  const rows = await db.query(
    `SELECT id, title, perex, content, created_at, updated_at FROM articles WHERE user_id=${userId} 
    LIMIT ${offset}, ${config.appListPerPage}`, 
    //`SELECT id, title, perex, content, created_at, updated_at FROM articles WHERE user_id=? LIMIT ?, ?`, 
    //[userId, offset, config.appListPerPage] // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

/**
 * Create new article
 * 
 * @param userId - user id the articles will be created for
 * @param {*} articleModel - article object that should be created
 * @returns message - error/success
 */
async function create(userId, articleModel){
  console.log('=========> articleService.js create: articleModel= ' + articleModel);
  console.dir(articleModel);
  
  //let article = new ArticleModel(${userId}, 'JAVA', 'Java perex', 'JAVA content', )
  // console.log('=========> articleModel= ' + article.toString);


  const result = await db.query(
    `INSERT INTO articles 
     (user_id, title, perex, content, created_at) 
     VALUES ('${articleModel.userId}', '${articleModel.title}', '${articleModel.perex}', 
             '${articleModel.content}', NOW())`
    //VALUES ('${article.userId}', '${article.title}', '${article.perex}', 
    //  '${article.content}', NOW())`
    // VALUES (?, ?, ?, ?, ?)`, // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute
    // [
    //  articleModel.userId, articleModel.title, articleModel.perex, articleModel.content
    // ]
  );

  let message = 'Error in creating article';

  if (result.affectedRows) {
    message = 'Article created successfully';
  }

  return {message};
}

/**
 * Update existing article
 * 
 * @param {*} id - id of the article that should be updated
 * @param {*} articleModel - article object that should be created
 * @returns message - error/success
 */ 

async function update(id, articleModel){
  const result = await db.query(
    `UPDATE articles 
     SET title='${articleModel.title}', perex='${articleModel.perex}', content='${articleModel.content}'
     WHERE id=${id}`, 
    // SET title=?, perex=?, content=? WHERE id=?`, // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute 
    // [
    //   articleModel.title, articleModel.perex, articleModel.content, id
    // ]
  );

  let message = 'Error in updating article';

  if (result.affectedRows) {
    message = 'Article updated successfully';
  }

  return {message};
}

/**
 * Remove specified article
 * 
 * @param {*} id - id of the article that should be removed
 * @returns message - error/success
 */
 async function remove(id){
  const result = await db.query(
    `DELETE FROM articles WHERE id=?`, 
    [id]
  );

  let message = 'Error in deleting article';

  if (result.affectedRows) {
    message = 'Article deleted successfully';
  }

  return {message};
}

module.exports = {
  getMultiple,
  create,
  update,
  remove
}