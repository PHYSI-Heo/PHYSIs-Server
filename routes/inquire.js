const express = require('express');
const router = express.Router();

const inquireQuery = require('../db/inquireQuery');
const contentQuery = require('../db/contentQuery');

// Google reCAPTCHA Secret Key
// const SECRET_KEY = "6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe";
const SECRET_KEY = "6Lc7HqAUAAAAAJd2j6N0yxzekgXlOsz0AMdhgg5Y";
// Inquire Board Categorys
const INQUIRE_CATEGORYs = [{
    "name": "전체보기",
    "iconClass": "fa fa-th"
  },
  {
    "name": "기술",
    "iconClass": "fa fa-wrench"
  },
  {
    "name": "견적",
    "iconClass": "fa fa-won"
  },
  {
    "name": "제품",
    "iconClass": "fa fa-cube"
  },
  {
    "name": "기타",
    "iconClass": "fa fa-list-alt"
  }
]


router.get('/board/list', (req, res) => {
  var resObj = {};
  var category;

  if (req.query.category) {
    category = INQUIRE_CATEGORYs[Number(req.query.category)].name;
    resObj.category = category;
  }

  inquireQuery.getInquireList(category, (result) => {
    if (result.resCode != 1001) {
      res.send("PHYSIs Server Error..");
    } else {
      resObj.page = (req.query.page) ? req.query.page : 1;
      keyWordFilter(result.rows, req.query.findType, req.query.keyWord, (findRows) => {
        console.log("> Keyword : " + req.query.keyWord);
        resObj.items = [];
        if (findRows) {
          resObj.items = findRows;
          resObj.findType = req.query.findType;
          resObj.keyWord = req.query.keyWord;
        }
        resObj.categorys = INQUIRE_CATEGORYs;
        res.render('inquireboard', {
          "res": resObj
        });

      });
    }
  });
});


router.get('/write', (req, res) => {
  var resObj = {
    "categorys": INQUIRE_CATEGORYs
  }

  contentQuery.getContents(null, (result) => {
    if (result.resCode != 1001) {
      res.send("PHYSIs Server Error..");
    } else {
      resObj.contents = result.rows;
      res.render('inquirewrite', {
        "res": resObj
      });
    }
  });
});

router.post('/edit', (req, res) => {
  var resObj = {
    "categorys": INQUIRE_CATEGORYs
  }

  if (req.body.editinfo) {
    resObj.editinfo = JSON.parse(req.body.editinfo);
  }

  contentQuery.getContents(null, (result) => {
    if (result.resCode != 1001) {
      res.send("PHYSIs Server Error..");
    } else {
      resObj.contents = result.rows;
      res.render('inquirewrite', {
        "res": resObj
      });
    }
  });
});


router.post('/auth/password', (req, res) => {
  inquireQuery.getPassword(req.body.no, (result) => {
    if (result.rows[0].pwd != req.body.pwd) {
      result.resCode = 2001;
    }
    console.log('\x1b[33m%s\x1b[0m', "@ Inquire Item - Check authorization..");
    console.log("> Result Code : " + result.resCode);
    res.json(result);
  });
});


router.post('/read', (req, res) => {
  inquireQuery.getInquireInfo(req.body.no, (result) => {
    console.log('\x1b[33m%s\x1b[0m', "@ Read Inquire Item :: " + req.body.no);
    console.log(result);
    if (result.resCode != 1001 || result.rows.length == 0) {
      res.send("PHYSIs Server Error..");
    }else{
      res.render('inquireread', {
        "readinfo": result.rows[0]
      });
    }
  });
});


router.post('/delete', (req, res) => {
  inquireQuery.deleteInquire(req.body.no, (result) => {
    if (result.resCode == 1001 && result.rows.affectedRows == 0) {
      result.resCode = 3003;
    }
    console.log('\x1b[33m%s\x1b[0m', "# Delete Inquire Item :: " + req.body.no);
    console.log("@ Result Code : " + result.resCode);
    res.json(result);
  });
});

router.post('/register', (req, res) => {
  tokenVerify(req, (verify) => {
    if (verify.resCode != 1001) {
      res.json(verify);
    } else {
      inquireQuery.insertInquire(req.body, (result) => {
        res.json(result);
      });
    }
  });
});


router.post('/update', (req, res) => {
  tokenVerify(req, (verify) => {
    if (verify.resCode != 1001) {
      res.json(verify);
    } else {
      inquireQuery.updateInquire(req.body, (result) => {
        if (result.resCode == 1001 && result.rows.affectedRows == 0) {
          result.resCode = 3003;
        }
        res.json(result);
      });
    }
  });
});


module.exports = router;


function tokenVerify(req, callback) {
  // g-recaptcha-response is the key that browser will generate upon form submit.
  // if its blank or null means user has not selected the captcha, so return the error.
  if (req.body['captcha'] === undefined || req.body['captcha'] === '' || req.body['captcha'] === null) {
    callback({
      "resCode": 3301
    });
    // return res.json({ "resCode": 1, "responseDesc": "Please select captcha" });
  }
  // req.connection.remoteAddress will provide IP address of connected user.
  var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + SECRET_KEY + "&response=" + req.body['captcha'] + "&remoteip=" + req.connection.remoteAddress;
  // Hitting GET request to the URL, Google will respond with success or error scenario.
  require('request')(verificationUrl, function(error, response, body) {
    body = JSON.parse(body);
    // Success will be true or false depending upon captcha validation.
    if (body.success !== undefined && !body.success) {
      callback({
        "resCode": 3302
      });
      // return res.json({ "resCode": 1, "responseDesc": "Failed captcha verification" });
    }
    callback({
      "resCode": 1001
    });
    // res.json({ "resCode": 0, "responseDesc": "Sucess" });
  });
}

async function keyWordFilter(rows, findType, keyWord, callback) {
  var findRows = [];
  if (findType && keyWord) {
    const promises = rows.map((row, index) => {
      switch (Number(findType)) {
        case 0:
          if (row.title.indexOf(keyWord) != -1) {
            findRows.push(row);
          }
          break;
        case 1:
          if (row.description.indexOf(keyWord) != -1) {
            findRows.push(row);
          }
          break;
        case 2:
          if (row.content.indexOf(keyWord) != -1) {
            findRows.push(row);
          }
          break;
        default:
          if (row.user.indexOf(keyWord) != -1) {
            findRows.push(row);
          }
      }
    });
    await Promise.all(promises);
    callback(findRows);
  } else {
    callback(rows);
  }
}
