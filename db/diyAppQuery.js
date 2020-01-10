const db = require('./mysql');

module.exports.getDIYApps = getDIYApps;
module.exports.deleteDiyApp = deleteDiyApp;
module.exports.insertDiyApp = insertDiyApp;


function getDIYApps(isDetail, app_no, callback) {
  console.log('\x1b[35m%s\x1b[0m', "@ Select DIY App List..");
  var sql = "SELECT no, name, reference, main_img, outline ";

  if (isDetail) {
    sql += ", description ";
  }
  sql += "FROM diyapps ";

  if (app_no) {
    sql += "WHERE no = \'" + app_no + "\'";
  }
  console.log("> SQL : " + sql);

  db.query(sql, [], (result) => {
    console.log(result);
    callback(result);
  });
}


function deleteDiyApp(app_no, callback) {
  console.log('\x1b[35m%s\x1b[0m', "@ Delete DIY App :: " + app_no);
  var sql = "DELETE FROM diyapps WHERE no = ?";
  db.query(sql, [app_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function insertDiyApp(params, callback) {
  console.log('\x1b[35m%s\x1b[0m', "@ Insert DIY App..");
  var sql = "INSERT INTO diyapps(name, reference, main_img, outline, description) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [params.name, params.reference, params.main_img, params.outline, params.description], (result) => {
    console.log(result);
    callback(result);
  });
}
