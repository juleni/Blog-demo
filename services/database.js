/*
 * Connecting to the database and enable running queries on the database
 */

// MySQL2 is mostly API compatible with mysqljs and supports majority of features. 
// MySQL2 also offers additional features. Info at https://www.npmjs.com/package/mysql2
const mysql = require('mysql2/promise');
// configuration for database credentials
const config = require('../config');
// use connection pooling from mysql2 package that supports Promise API. 
// Promises works very well with ES7 async await
const pool = mysql.createPool(config.db);

/**
 * Execute query
 * 
 * @param {*} sql - SQL command
 * @param {*} params - parameters passed to the query
 * @returns 
 */
async function query(sql, params) {

  // const connection = await mysql.createConnection(config.db);
  // const [results, ] = await connection.execute(sql, params);
  // return results;

  const [rows, fields] = await pool.execute(sql, params);
  return rows;
}

module.exports = {
  query
}