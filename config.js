
/*
 * Configuration file
 */

// define default db and app credentials
 /* don't expose password or any sensitive info, done only for demo */
const DB_HOST_DEFAULT = 'localhost';
const DB_PORT_DEFAULT = 3306;
const DB_NAME_DEFAULT = 'blog-demo';
const DB_USER_DEFAULT = 'test';
const DB_PASS_DEFAULT = 'testpass';
const DB_CONN_LIMIT_DEFAULT = 2;
const DB_QUEUE_LIMIT_DEFAULT = 0;
const DB_WAIT_FOR_CON_DEFAULT = true;
const DB_DEBUG_DEFAULT = false;

const APP_HOST_DEFAULT = 'localhost';
const APP_PORT_DEFAULT = 3000;
const APP_LIST_PER_PAGE_DEFAULT = 10;
const APP_SECRET_KEY_DEFAULT = 'secret-key';

const env = process.env;
const config = {
  db: {
    host: env.DB_HOST || DB_HOST_DEFAULT,
    port: env.DB_PORT || DB_PORT_DEFAULT,
    user: env.DB_USER || DB_USER_DEFAULT,
    password: env.DB_PASS || DB_PASS_DEFAULT,
    database: env.DB_NAME || DB_NAME_DEFAULT,
    waitForConnections: DB_WAIT_FOR_CON_DEFAULT,
    connectionLimit: env.DB_CONN_LIMIT || DB_CONN_LIMIT_DEFAULT,
    queueLimit: DB_QUEUE_LIMIT_DEFAULT,
    debug: env.DB_DEBUG || DB_DEBUG_DEFAULT
  },
    appHost: env.APP_HOST || APP_HOST_DEFAULT,
    appPort: env.APP_PORT || APP_PORT_DEFAULT,
    appListPerPage: env.APP_LIST_PER_PAGE_DEFAULT || APP_LIST_PER_PAGE_DEFAULT,
    secretKey: env.APP_SECRET_KEY || APP_SECRET_KEY_DEFAULT
};

module.exports = config;