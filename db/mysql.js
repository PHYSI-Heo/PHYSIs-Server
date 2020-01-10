const mysql = require('mysql');

const MYSQLIP = 'localhost';
const MYSQLID = 'root';
const MYSQLPWD = '1234';
const DBNAME = 'psmf';

var dbInfo = {
  host: MYSQLIP,
  port: 3306,
  user: MYSQLID,
  password: MYSQLPWD,
  database : DBNAME,
  connectionLimit: 100,
  waitForConnections: true
};

var dbPool;

module.exports.createPool = () => {
  dbPool = mysql.createPool(dbInfo);
  if (dbPool) {
    console.log("# Create MySQL ThreadPool..Successful");
  } else {
    console.log("# Create MySQL ThreadPool..Failed");
  }
}

module.exports.query = (sql, params, callback) => {
  var result = {};
  dbPool.getConnection((con_Err, con) => {
    if (con_Err) {
      // DB Connect Err
      result.resCode = 1002;
      console.log('\x1b[35m%s\x1b[0m', "## DB Connect Err : " + con_Err.message);
      callback(result);
    } else {
      con.query(sql, params, (query_Err, rows) => {
        if (query_Err) {
          // Query Error
          result.resCode = 1003;
          console.log('\x1b[35m%s\x1b[0m', "## DB Query Err : " + query_Err.message);
        } else {
          // Query Result
          //console.log('\x1b[36m%s\x1b[0m', "** DB Query Result ");
          //console.log(rows);
          result.resCode = 1001;
          result.rows = rows;
        }
        con.release();
        callback(result);
      });
    }
  });
}

module.exports.dbInfo = dbInfo;