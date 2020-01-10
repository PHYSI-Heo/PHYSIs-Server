const express = require('express');
const router = express.Router();
const path = require('path');

const downloadQuery = require('../db/downloadQuery');


router.get('/', (req, res) => {
  downloadQuery.getKitSoftware((kitResult) => {
    if (kitResult.resCode != 1001) {
      res.send("PHYSIs Server Error..");
    } else {
      downloadQuery.getDonwloadInfos(true, null, (result) =>{
        if (result.resCode != 1001) {
          res.send("PHYSIs Server Error..");
        } else {
          res.render('download', {
            "kitsoftware": kitResult.rows,
            "contents": result.rows
          });
        }
      });
    }
  });
});


router.get('/detail', (req, res) => {
  if (req.query.no) {
    downloadQuery.getDonwloadInfos(false, req.query.no, (result)=>{
      if (result.resCode != 1001) {
        res.send("PHYSIs Server Error..");
      } else {
        res.render('detaildownload', {
          "download": result.rows
        });
      }
    });
  } else {
    res.redirect("/");
  }
});


router.post('/file', (req, res) => {
  if (req.body.fileName) {
    var filePath = __dirname.substring(0, __dirname.lastIndexOf('\\'));
    filePath += "/download/" + req.body.fileName;
    res.download(filePath);
  } else {
    res.status(204).end();
  }
});

module.exports = router;
