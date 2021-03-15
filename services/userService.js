/*
 * User service - the bridge between the route and the database
 */

const db = require('./database');
const helper = require('../helper');
const config = require('../config');
const UserModel = require('../models/UserModel');

/**
 * Get multiple users for specified page
 * 
 * @param {*} page - page number the users will be retrieved for
 * @returns list of users or empty, page number
 */
async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.appListPerPage);

  const rows = await db.query(
    `SELECT id, first_name, last_name, email, registered_at FROM users LIMIT ${offset}, ${config.appListPerPage}`, 
    //`SELECT id, first_name, last_name, email, registered_at FROM users LIMIT ?, ?`, 
    //[offset, config.appListPerPage] // commented becouse of the bug in mysql?
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
 * Get user by id
 * 
 * @param {*} email - id of the user
 * @returns data - user or empty
 */
 async function getUserById(id){

  const rows = await db.query(
    `SELECT id, first_name, last_name, email, password_hash, profile_info, registered_at, last_login FROM users WHERE id=${id}`, 
    //`SELECT id, first_name, last_name, email, password_hash, profile_info, registered_at, last_login FROM users WHERE id=?`, 
    //[id] // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute
  );
  const data = helper.emptyOrRows(rows);
  const message = null;
  if (!data && data.length == 0) {
      message = 'User data were not found ???'
  }
 
  var userModel = null;
  if (data && data.length > 0) {
    userModel = new UserModel(data[0].first_name, data[0].last_name, data[0].email, data[0].profile_info);
    userModel.id = data[0].id;
    userModel.passwordHash = data[0].password_hash;
    userModel.registeredAt = data[0].registered_at;
    userModel.lastLogin = data[0].last_login;
  } else {
    message = 'User data were not found ???'
  }


  return { 
    userModel,
    message 
  }
}


/**
 * Get user by email
 * 
 * @param {*} email - email of the user
 * @returns data - user or empty
 */
 async function getUserByEmail(email){

  const rows = await db.query(
    `SELECT id, first_name, last_name, email, password_hash, registered_at FROM users WHERE email='${email}'`, 
    //`SELECT id, first_name, last_name, email, registered_at FROM users WHERE email=?`, 
    //[email] // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute
  );
  const data = helper.emptyOrRows(rows);
  var userModel = null;
  if (data && data.length > 0) {
    userModel = new UserModel(data[0].first_name, data[0].last_name, data[0].email, '');
    userModel.id = data[0].id;
    userModel.passwordHash = data[0].password_hash;
  }

  return { userModel }
}


/**
 * Create new user
 * 
 * @param {*} userModel - user object that should be created
 * @returns message - error/success
 */
async function create(userModel){
  console.log('=========> userService.js create: userModel= ' + userModel.toString);

  //let user = new UserModel('Gyula', 'Bácsi', 'gyulabacsi@kermideretvar.hu', 'duloveheslo',
  //                         'Dula je jednoduchý chlapík z vidieka :-|')
  // console.log('=========> userModel= ' + user.toString);


  const result = await db.query(
    `INSERT INTO users 
     (first_name, last_name, email, password_hash, profile_info, registered_at, last_login) 
     VALUES ('${userModel.firstName}', '${userModel.lastName}', '${userModel.email}', 
             '${userModel.passwordHash}', '${userModel.profileInfo}', NOW(), NOW())`
    // INSERT INTO users 
    // (first_name, last_name, email, password_hash, profile_info, registered_at, last_login)
    // VALUES (?, ?, ?, ?, ?, NOW(), NOW())`, // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute
    // [
    //  userModel.firstName, userModel.lastName, userModel.email, 
    //  userModel.passwordHash, userModel.profileInfo
    // ]
  );

  let message = 'Error in creating user';

  if (result.affectedRows) {
    // update ID of the user by inserted one
    userModel.id = result.insertId;
    message = 'User created successfully';
  }

  return {
    userModel,
    message
  };
}

/**
 * Update existing user
 * 
 * @param {*} id 
 * @param {*} userModel - user object that should be created
 * @returns message - error/success
 */ 

async function update(id, userModel){
  const result = await db.query(
    `UPDATE users 
     SET first_name='${userModel.firstName}', last_name='${userModel.lastName}', email='${userModel.email}',
         password_hash='${userModel.passwordHash}', profile_info='${userModel.profileInfo}' WHERE id=${id}`, 
    // SET first_name=?, last_name=?, email=?, password_hash, profile_info WHERE id=?`, // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute 
    // [
    //  userModel.firstName, userModel.lastName, userModel.email, 
    //  userModel.passwordHash, userModel.profileInfo, id
    // ]
  );

  let message = 'Error in updating user';

  if (result.affectedRows) {
    message = 'User updated successfully';
  }

  return {
    userModel,
    message
  };
}

/**
 * Remove specified user
 * 
 * @param {*} id - id of the user that should be removed
 * @returns message - error/success
 */
 async function remove(id){
  const result = await db.query(
    `DELETE FROM users WHERE id=?`, 
    [id]
  );

  let message = 'Error in deleting user';

  if (result.affectedRows) {
    message = 'User deleted successfully';
  }

  return {message};
}


module.exports = {
  getUserById,
  getUserByEmail,
  getMultiple,
  create,
  update,
  remove
}