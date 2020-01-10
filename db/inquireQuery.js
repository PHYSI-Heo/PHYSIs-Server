const db = require('./mysql');
const timer = require('../utils/timer');


module.exports.setReplyState = setReplyState;
module.exports.getInquireList = getInquireList;
module.exports.getPassword = getPassword;
module.exports.getInquireInfo = getInquireInfo;
module.exports.deleteInquire = deleteInquire;
module.exports.insertInquire = insertInquire;
module.exports.updateInquire = updateInquire;

function setReplyState(reply, inquire_no, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Reply Inquire :: " + inquire_no);
  var sql = "UPDATE inquires SET replyState = '1', reply = ? WHERE no = ?";
  db.query(sql, [reply, inquire_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function getInquireList(category, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Get Inquire List..");
  var sql = "SELECT no, category, content, title, user, date, " +
    "description, replyState, pwdState FROM inquires "
  var params = [];
  if (category) {
    sql += "WHERE category = ? ";
    params.push(category);
  }
  sql += "ORDER BY no DESC";
  console.log("> SQL : " + sql);

  db.query(sql, params, (result) => {
    console.log(result);
    callback(result);
  });
}


function getPassword(inquire_no, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Get Inquire Row Password..");
  var sql = "SELECT pwd FROM inquires WHERE no = ?";
  db.query(sql, [inquire_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function getInquireInfo(inquire_no, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Get Inquire Info..");
  var sql = "SELECT no, category, content, title, user, " +
    "date, description, replyState, reply, pwdState " +
    "FROM inquires WHERE no = ?";

  db.query(sql, [inquire_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function deleteInquire(inquire_no, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Delete Inquire Info..");
  var sql = "DELETE FROM inquires WHERE no = ?";
  db.query(sql, [inquire_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function insertInquire(params, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Insert New Inquire..");
  var sql = "INSERT INTO inquires(category, content, title, user, date, description ";
  var paramsArray;
  if (params.pwd == undefined || params.pwd == '' || params.pwd == null) {
    sql += ") VALUES (?, ?, ?, ?, ?, ?)";
    paramsArray = [params.category, params.content, params.title, params.user,
      timer.getCurrentTime(), params.description
    ];
  } else {
    sql += ", pwdState, pwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    paramsArray = [params.category, params.content, params.title, params.user,
      timer.getCurrentTime(), params.description, "1", params.pwd
    ];
  }
  console.log("> SQL : " + sql);

  db.query(sql, paramsArray, (result) => {
    console.log(result);
    callback(result);
  });
}


function updateInquire(params, callback) {
  console.log('\x1b[32m%s\x1b[0m', "@ Update Inquire..");
  var sql = "UPDATE inquires SET category = ?, content = ?, title =?, user =?, date = ?, description = ? WHERE no = ?";
  var paramsArray = [params.category, params.content, params.title, params.user, timer.getCurrentTime(), params.description, params.no];

  db.query(sql, paramsArray, (result) => {
    console.log(result);
    callback(result);
  });
}
