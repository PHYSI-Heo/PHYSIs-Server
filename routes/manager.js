const express = require('express');
const router = express.Router();

const downloadQuery = require('../db/downloadQuery');
const inquireQuery = require('../db/inquireQuery');
const contentQuery = require('../db/contentQuery');
const diyAppQuery = require('../db/diyAppQuery');

const multer = require('multer');
const path = require("path");
const fs = require('fs');


// Upload File Options
let storage = multer.diskStorage({
  destination: function(req, file, callback) {
    console.log("# Upload FileType : " + req.body.uploadtype);
    if (req.body.uploadtype == "Download") {
      callback(null, "download/")
    } else if (req.body.uploadtype == "Image") {
      callback(null, "public/img/content/")
    } else {
      callback(null, "public/img/diy/")
    }
  },
  filename: function(req, file, callback) {
    let extension = path.extname(file.originalname); // 확장자
    let basename = path.basename(file.originalname, extension); //  파일이름
    callback(null, file.originalname)
  }
});

let upload = multer({
  storage: storage
});
// Upload File Options


var MANAGER_ID = "admin";
var MANAGER_PWD = "!06160928"
var ACCESS_SESSION = "a!c#c$e%s^s&";

router.post('/signin', (req, res) => {
  var access = false; 
  if(req.body.mid == MANAGER_ID && req.body.mpwd == MANAGER_PWD){
    req.session.mid = ACCESS_SESSION;
    access = true;
  }
  res.json({'access' : access});
});




/*  ==================================================

                      Inquire

  ==================================================*/
router.get('/', (req, res) => {
  if(req.session.mid != ACCESS_SESSION){
      res.render('manager/signin');
  }else{
    var resObj = {};
    inquireQuery.getInquireList(null, (result) => {
      resObj.page = (req.query.page) ? req.query.page : 1;
      resObj.items = [];
      if (result.resCode = 1001 && result.rows.length != 0) {
        resObj.items = result.rows;
      }
      res.render('manager/inquireList', {
        "res": resObj
      });
    });
  }
});

router.post('/inquire/read', (req, res) => {
  inquireQuery.getInquireInfo(req.body.no, (result) => {
    if (result.resCode != 1001 || result.rows.length == 0) {
      res.send("PHYSIs Server Error..");
    }
    res.render('manager/inquirereply', {
      "items": result.rows[0]
    });
  });
});

router.post('/reply/inquire', (req, res) => {
  inquireQuery.setReplyState(req.body.reply, req.body.no, (result) => {
    res.json(result);
  });
});




/*  ==================================================

                    File Upload

  ==================================================*/
router.get('/file/update', (req, res) => {
  if(req.session.mid != ACCESS_SESSION){
      res.render('manager/signin');
  }else{
      res.render('manager/fileUploader');
  }
});

router.post('/upload/files', upload.array('uploadfile', 10), (req, res) => {
  res.status(204).end();
  // =  No Content : 요청한 작업을 수행하였고 데이터를 반환할 필요가 없다는것을 의미
})

router.post('/get/storage/files', (req, res) => {
  var folderPath = __dirname.substring(0, __dirname.lastIndexOf('\\'));

  if (req.body.searchType == "image") {
    folderPath += "/public/img/content/";
  } else {
    folderPath += "/download/";
  }
  getFileList(folderPath, (files) => {
    console.log('\x1b[36m%s\x1b[0m', "# Get Files..");
    console.log("@ Path : " + folderPath);
    console.log(files);
    files.folderPath = folderPath; // (res params) - using file delete
    res.json(files);
  });
});


/*  ==================================================

                   Content Infos

  ==================================================*/

router.get('/content/setting', (req, res) => {
  if(req.session.mid != ACCESS_SESSION){
    res.render('manager/signin');
  }else{
    contentQuery.getContentInfos(null, (result) => {
      sortContentInfo(result, (sortData) => {
        res.render('manager/contentSetter', {
          "contents": sortData
        });
      });
    });
  }
});


router.post('/content/update', (req, res) => {
  if (req.body.updateType == 'new') {
    registerContent(req, res);
  } else {
    contentQuery.deleteContent(req.body.no, false, (result) => {
      if (result.resCode == 1001 && result.rows.affectedRows != 0) {
        registerContent(req, res);
      } else {        
        res.json(result);
      }
    });
  }
});


router.post('/content/delete', (req, res) => {
  contentQuery.deleteContent(req.body.no, true, (result) => {
    if (result.resCode == 1001 && result.rows.affectedRows == 0) {
      result.resCode = 4001;
    }
    res.json(result);
  });
});


/*  ==================================================

                   Download Infos

  ==================================================*/
router.get('/download/setting', (req, res) => {
  if(req.session.mid != ACCESS_SESSION){
    res.render('manager/signin');
  }else{
    contentQuery.getContents(null, (contentResult) => {
      if (contentResult.resCode != 1001) {
        res.send("PHYSIs Server Error..");
      } else {
        downloadQuery.getKitSoftware((kitResult) => {
          if (kitResult.resCode != 1001) {
            res.send("PHYSIs Server Error..");
          } else {
            downloadQuery.getDonwloadInfos(false, null, (result) => {
              if (result.resCode != 1001) {
                res.send("PHYSIs Server Error..");
              } else {
                res.render('manager/downloadSetter', {
                  "contents": contentResult.rows,
                  "kitsoftware": kitResult.rows,
                  "downloads": result.rows
                });
              }
            });
          }
        });
      }
    });
  }
});

router.post('/download/update/content', (req, res) => {
  downloadQuery.deleteDownloadInfo(req.body.no, (delResult) => {
    if (delResult.resCode == 1001) {
      downloadQuery.insertDownloadInfos(req.body, (insertResult) => {
        res.json(insertResult);
      });
    } else {
      res.json(delResult);
    }
  });
});


router.post('/download/update/kitsoftware', (req, res) => {
  if (req.body.updateType == 'new') {
    downloadQuery.insertKitSoftware(req.body, (result) => {
      res.json(result);
    });
  } else {
    downloadQuery.updateKitSoftware(req.body, (result) => {
      console.log(req.body);
      if (result.resCode == 1001 && result.rows.affectedRows == 0) {
        result.resCode = 4001;
      }
      res.json(result);
    });
  }
});



/*  ==================================================

                   DIY App Infos

  ==================================================*/

router.get('/diy/app/setting', (req, res) => {
  if(req.session.mid != ACCESS_SESSION){
    res.render('manager/signin');
  }else{
    diyAppQuery.getDIYApps(true, null, (result) => {
      if (result.resCode != 1001) {
        res.send("PHYSIs Server Error..");
      } else {
        res.render('manager/diyAppSetter', {
          'apps': result.rows
        });
      }
    });
  }
});


router.post('/diy/temp/imgs', upload.single('upload'), function(req, res) {
  // var tmpPath = req.file.path;
  var fileName = req.file.filename;
  var html = "";
  html += "<script type='text/javascript'>";
  html += " var funcNum = " + req.query.CKEditorFuncNum + ";";
  html += " var url = \"/img/diy/" + fileName + "\";";
  html += " var message = \"업로드 완료\";";
  html += " window.parent.CKEDITOR.tools.callFunction(funcNum, url);";
  html += "</script>";
  res.send(html);
});

router.post('/diy/update/apps', (req, res) => {
  if (req.body.updateType == 'new') {
    diyAppQuery.insertDiyApp(req.body, (insertResult) => {
      res.json(insertResult);
    });
  } else {
    diyAppQuery.deleteDiyApp(req.body.no, (delResult) => {
      if (delResult.resCode == 1001) {
        diyAppQuery.insertDiyApp(req.body, (insertResult) => {
          res.json(insertResult);
        });
      } else {
        res.json(delResult);
      }
    });
  }
});

router.post('/diy/delete/app', (req, res) => {
  diyAppQuery.deleteDiyApp(req.body.no, (delResult) => {
    res.json(delResult);
  });
});


module.exports = router;



function registerContent(req, res) {
  contentQuery.insertContent(req.body, (contentResult) => {
    if (contentResult.resCode != 1001) {
      res.json(contentResult);
    } else {
      var imgs = JSON.parse(req.body.imgs);
      var content_no = contentResult.rows.insertId;
      contentQuery.insertContentImgs(content_no, imgs, (insertResult) => {
        if (insertResult.resCode != 1001) {
          res.json(insertResult);
        } else {
          downloadQuery.updateContentNumber(content_no, req.body.name, (updateResult) => {
            if (updateResult.resCode == 1001 && updateResult.rows.affectedRows == 0) {
              updateResult.resCode = 4001;
            }
            res.json(updateResult);
          });
        }
      });
    }
  });
}

function getFileList(path, callback) {
  fs.readdir(path, async (err, items) => {
    if (err) {
      console.log(err.message);
      callback({
        "err": err.message
      });
    } else {
      var files = [];
      const promises = items.map((file) => {
        files.push(file);
      });
      await Promise.all(promises);
      callback({
        "files": files
      });
    }
  });
}

async function sortContentInfo(result, callback) {
  var contents = [];
  if (result.resCode == 1001 && result.rows.length != 0) {
    // init Setting
    var rows = result.rows;
    var contents = [];
    var content = rows[0];
    var imgs = [];

    const promises = rows.map((info, index) => {
      if (content.no != info.no) {
        content.imgs = imgs;
        contents.push(content);

        content = info;
        imgs = [];
      }

      if (info.priority != null && info.filename != null) {
        imgs.push({
          "priority": info.priority,
          "filename": info.filename
        });
      }

      if (index == rows.length - 1) {
        content.imgs = imgs;
        contents.push(content);
      }
    });
    await Promise.all(promises);
  }
  callback(contents);
}
