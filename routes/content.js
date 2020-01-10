const express = require('express');
const router = express.Router();

const contentQuery = require('../db/contentQuery');


router.get('/', (req, res) => {
  res.render('index');
});

router.get('/projects', (req, res) => {
  contentQuery.getContents(true, (result) => {
    if (result.resCode != 1001) {
      res.send("PHYSIs Server Error..");
    } else {
      res.render('projects', {
        "contents": result.rows
      });
    }
  });
});

router.get('/content', (req, res) => {
  if (req.query.no) {
    contentQuery.getContentInfos(req.query.no, (result) => {
      if (result.resCode != 1001) {
        res.send("PHYSIs Server Error..");
      }else{
        sortImages(result.rows, (sortData) =>{
          console.log('\x1b[34m%s\x1b[0m', "> Sort Result..");
          console.log(sortData);
          res.render('content', {
            "content": sortData
          });
        });
      }
    });
  } else {
    res.redirect("/");
  }
});
module.exports = router;


async function sortImages(rows, callback) {
  var contentInfo = {};
  if(rows.length != 0){
    // init set
    contentInfo = rows[0];
    // realignment image files
    var images = [];
    const promises = rows.map((row, index) => {
      images.push(row.filename);
    });
    await Promise.all(promises);
    contentInfo.images = images;
    delete contentInfo.priority;
    delete contentInfo.filename;
  }
  callback(contentInfo);
}
