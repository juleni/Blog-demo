/*
 * User service - the bridge between the route and the database
 */

const db = require('./database');
const helper = require('../helper');
const config = require('../config');
const userModel = require('../models/UserModel');

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
 * Create new user
 * 
 * @param {*} userModel - user object that should be created
 * @returns message - error/success
 */
async function create(userModel){
  console.log('=========> userService.js create: userModel= ' + userModel);
  
  //let user = new UserModel('Gyula', 'Bácsi', 'gyulabacsi@kermideretvar.hu', 'duloveheslo',
  //                         'Dula je jednoduchý chlapík z vidieka :-|')
  // console.log('=========> userModel= ' + user.toString);


  const result = await db.query(
    `INSERT INTO users 
     (first_name, last_name, email, password_hash, profile_info, registered_at) 
     VALUES ('${userModel.firstName}', '${userModel.lastName}', '${userModel.email}', 
             '${userModel.passwordHash}', '${userModel.profileInfo}', NOW())`
    //VALUES ('${user.firstName}', '${user.lastName}', '${user.email}', 
    //  '${user.passwordHash}', '${user.profileInfo}', NOW())`
    // VALUES (?, ?, ?, ?, ?)`, // commented becouse of the bug in mysql?
    // https://stackoverflow.com/questions/65543753/error-incorrect-arguments-to-mysqld-stmt-execute
    // [
    //  userModel.firstName, userModel.lastName, userModel.email, 
    //  userModel.passwordHash, userModel.profileInfo
    // ]
  );

  let message = 'Error in creating user';

  if (result.affectedRows) {
    message = 'User created successfully';
  }

  return {message};
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

  return {message};
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
  getMultiple,
  create,
  update,
  remove
}