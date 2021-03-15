/*
 * Helper Methods
 */

const bcrypt = require("bcrypt");
const config = require('./config');
require("dotenv").config();

/**
 * Encrypt password
 * 
 * @param {*} password - string password to be encrypted 
 * @returns hash - encrypted password
 */
function hash_password(password){
    // try to read config data from .env file or set up default if .env file wasn't found
    const saltRounds = process.env.APP_SALT_ROUNDS || config.appSaltRounds;

    var salt = bcrypt.genSaltSync(Number(saltRounds));
    var hash = bcrypt.hashSync(password, salt);

    return hash;
}

/**
 * Compare password
 * @param {*} password - password to be compared
 * @param {*} hash - hashed password
 * @returns boolean - ok / not ok
 */
function compare_password(password, hash){
    return bcrypt.compareSync(password, hash);
}


/**
 * Helper function getting page offset
 * 
 * @param {*} currentPage 
 * @param {*} listPerPage
 * @returns offset
 */

function getOffset(currentPage = 1, listPerPage) {
    return (currentPage - 1) * [listPerPage];
}
  
/**
 * Helper function getting rows
 * 
 * @param {*} rows 
 * @returns tetrieved rows or empty array 
 */
function emptyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows;
}
  

module.exports = {
    hashPassword: hash_password,
    comparePassword: compare_password,
    getOffset,
    emptyOrRows
}