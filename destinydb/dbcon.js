var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'qbct6vwi8q648mrn.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
  user            : 'm4bjcarc8cc3znnc',
  password        : 'o5n069h1kkl5tfd4',
  database        : 'h4vefgtq1dh3mcwt'
});
module.exports.pool = pool;
