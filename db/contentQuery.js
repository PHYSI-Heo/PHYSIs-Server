const db = require('./mysql');


module.exports.getContents = getContents;
module.exports.getContentInfos = getContentInfos;
module.exports.deleteContent = deleteContent;
module.exports.insertContent = insertContent;
module.exports.insertContentImgs = insertContentImgs;

function getContents(visible, callback) {
  console.log('\x1b[31m%s\x1b[0m', "@ Select Content List..");
  var sql = "SELECT no, name, name_kr, main_img FROM contents ";
  if (visible) {
    sql += "WHERE visible = '1'";
  }
  console.log("> SQL : " + sql);

  db.query(sql, [], (result) => {
    console.log(result);
    callback(result);
  });
}


function getContentInfos(content_no, callback) {
  console.log('\x1b[31m%s\x1b[0m', "@ Select Content Infos..");
  var sql = "SELECT c.no, c.name, c.name_kr, c.outline, c.description, " +
    "c.main_img, c.youtube, c.visible, i.priority, i.filename " +
    "FROM contents AS c LEFT JOIN contentImgs AS i ON c.no = i.no ";
  var params = [];
  if (content_no) {
    sql += "WHERE c.no = ?";
    params.push(content_no);
  }
  console.log("> SQL : " + sql);

  db.query(sql, params, (result) => {
    console.log(result);
    callback(result);
  });
}


function deleteContent(content_no, entirely_delete, callback) {
  console.log('\x1b[31m%s\x1b[0m', "@ Delete Content ..");
  var sql = "DELETE c, i";
  var join = " FROM contents AS c " +
    "LEFT JOIN contentimgs i ON c.no = i.no ";
  if (entirely_delete) {
    sql += ", d ";
    join += "LEFT JOIN downloads d ON c.no = d.no ";
  }
  sql = sql + join + "WHERE c.no = ?";
  console.log("> SQL : " + sql);

  db.query(sql, [content_no], (result) => {
    console.log(result);
    callback(result);
  });
}


function insertContent(params, callback) {
  console.log('\x1b[31m%s\x1b[0m', "@ Insert Content ..");
  var sql = "INSERT INTO contents" +
    "(name, name_kr, outline, description, main_img, youtube, visible) " +
    "VALUES (?, ?, ?, ?, ?, ?, ?)";
  var paramsArray = [params.name, params.name_kr, params.outline,
    params.description, params.main_img, params.youtube, params.visible
  ];
  db.query(sql, paramsArray, (result) => {
    console.log(result);
    callback(result);
  });
}


async function insertContentImgs(content_no, imgs, callback) {
  console.log('\x1b[31m%s\x1b[0m', "@ Insert Content Images..");
  var sql = "INSERT INTO contentImgs VALUES ";
  var params = [];
  const promises = imgs.map((img, index) => {
    sql += "(?, ?, ?)";
    params.push(content_no, img.priority, img.filename);
    // sql += "(\'" + content_no + "\',\'" + img.priority + "\',\'" + img.filename + "\')";
    if (imgs.length - 1 != index) {
      sql += ","
    }
  });

  await Promise.all(promises);
  console.log("> SQL : " + sql);

  db.query(sql, params, (resData) => {
    console.log(resData);
    callback(resData);
  });
}
