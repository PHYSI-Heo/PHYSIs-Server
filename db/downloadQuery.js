const db = require('./mysql');


module.exports.getDonwloadInfos = getDonwloadInfos;
module.exports.getDonwloadInfo = getDonwloadInfo;
module.exports.deleteDownloadInfo = deleteDownloadInfo;
module.exports.insertDownloadInfos = insertDownloadInfos;
module.exports.updateContentNumber = updateContentNumber;
module.exports.getKitSoftware = getKitSoftware;
module.exports.insertKitSoftware = insertKitSoftware;
module.exports.updateKitSoftware = updateKitSoftware;


function getDonwloadInfos(simply, content_no, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Select Download infos..");
  var sql = "SELECT ";

  if(simply){
    sql += "no, name, outline, communication, composition ";
  }else{
    sql += "* ";
  }
  sql += "FROM downloads ";
  var params = [];
  if (content_no) {
    sql += "WHERE no = ?";
    params.push(content_no);
  }
  console.log("> SQL : " + sql);

  db.query(sql, params, (result) => {
    console.log(result);
    callback(result);
  });
}


function getDonwloadInfo(content_no, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Delete Download infos..");
  var sql = "DELETE FROM downloads WHERE no = ?";

  db.query(sql, [content_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function deleteDownloadInfo(content_no, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Delete Download infos..");
  var sql = "DELETE FROM downloads WHERE no = ?";
  db.query(sql, [content_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function insertDownloadInfos(params, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Insert Download infos..");

  var sql = "INSERT INTO downloads(no, name, name_kr, outline, communication, composition, " +
    "description, package, menual, arduino_code, android_apk, ex_android, android_git";
  var paramsArray = [params.no, params.name, params.name_kr, params.outline, params.communication,
    params.composition, params.description, params.package, params.menual, params.arduino_code,
    params.android_apk, params.ex_android, params.android_git
  ];
  var value = " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?"

  if (params.ex_arduino) {
    sql += ", ex_arduino";
    paramsArray.push(params.ex_arduino);
    value += ", ?";
  }

  if (params.reference_lib) {
    sql += ", reference_lib";
    paramsArray.push(params.reference_lib);
    value += ", ?";
  }
  sql += ")";
  value += ")";

  db.query(sql + value, paramsArray, (result) => {
    console.log(result);
    callback(result);
  });
}


function updateContentNumber(content_no, content_name, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Update Download Content Number..");
  var sql = "UPDATE downloads set no = ? WHERE name = ?";
  db.query(sql, [content_no, content_name], (result) => {
    console.log(result);
    callback(result);
  });
}


function getKitSoftware(callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Get Kit Software Infos..");
  var sql = "SELECT * FROM kitsoftware ORDER BY no DESC LIMIT 1";

  db.query(sql, [], (result) => {
    console.log(result);
    callback(result);
  });
}


function insertKitSoftware(params, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Insert Kit Software Infos..");
  var sql = "INSERT INTO kitsoftware(version, arduino_lib, arduino_menual, android_git, android_menual) VALUES (?, ?, ?, ?, ?)";
  var paramsArray = [params.version, params.arduino_lib, params.arduino_menual, params.android_git, params.android_menual];
  db.query(sql, paramsArray, (result) => {
    console.log(result);
    callback(result);
  });
}


function updateKitSoftware(params, callback) {
  console.log('\x1b[33m%s\x1b[0m', "@ Update Kit Software Infos..");
  var sql = "UPDATE kitsoftware SET version = ?, arduino_lib = ?, " +
    "arduino_menual = ?, android_git = ?, android_menual =?";
  var paramsArray = [params.version, params.arduino_lib, params.arduino_menual,
    params.android_git, params.android_menual, params.no
  ];
  db.query(sql, paramsArray, (result) => {
    console.log(result);
    callback(result);
  });
}
