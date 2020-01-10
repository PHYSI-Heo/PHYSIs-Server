function setWriteDatas(resObj) {
  console.log(resObj);

  if (resObj.categorys) {
    showCategoryOptions(resObj.categorys);
  }

  if (resObj.contents) {
    showContentOptions(resObj.contents);
  }

  if (resObj.editinfo) {
    showEditInfos(resObj.editinfo);
  }
}


function reqInsertInquire() {
  var writeData = {
    "title": $('#inquire-title').val(),
    "category": $('#inquire-category').val(),
    "content": $('#inquire-content').val(),
    "user": $('#inquire-user').val(),
    "pwd": $('#inquire-pwd').val(),
    "description": $('#inquire-description').val(),
    "captcha": grecaptcha.getResponse()
  }

  console.log(writeData);

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: writeData,
    url: '/inquire/register',
    timeout: 2000,
    success: function(res) {
      console.log(res);
      if (res.resCode != 1001) {
        alert("올바른 접근이 아닙니다.\n문의게시판으로 이동합니다.");
      } else {
        alert("문의사항이 등록되었습니다.\n빠른 시간내에 답변을 드리겠습니다.");
      }
      window.location.replace("/inquire/board/list");
    }
  });
}

function reqUpdateInquire() {
  var writeData = {
    "no": $("#item-no").val(),
    "title": $('#inquire-title').val(),
    "category": $('#inquire-category').val(),
    "content": $('#inquire-content').val(),
    "user": $('#inquire-user').val(),
    "description": $('#inquire-description').val(),
    "captcha": grecaptcha.getResponse()
  }

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: writeData,
    url: '/inquire/update',
    timeout: 2000,
    success: function(res) {
      console.log(res);
      if (res.resCode != 1001) {
        alert("올바른 접근이 아닙니다.\n문의게시판으로 이동합니다.");
      } else {
        alert("문의사항이 수정되었습니다.");
      }
      window.location.replace("/inquire/board/list");
    }
  });
}

/* =============================================

        Create Elements / Append Elements

=============================================  */
function showEditInfos(info) {
  $('#inquire-title').val(info.title);
  $('#inquire-category').val(info.category);
  $('#inquire-content').val(info.content);
  $('#inquire-user').val(info.user);
  $('#inquire-pwd').val(info.pwd);
  $('#inquire-description').val(info.description);

  $('#btn-register').val("수정");
  $("#tr-pwd").css('display', 'none');
  $("#item-no").val(info.no);
}

function showCategoryOptions(categorys) {
  for (var i = 1; i < categorys.length; i++) {
    var $option = $("<option/>");
    $option.html(categorys[i].name);
    $('#inquire-category').append($option);
  }
}

function showContentOptions(contents) {
  for (var i = 0; i < contents.length; i++) {
    var $option = $("<option/>");
    $option.html(contents[i].name);
    $('#inquire-content').append($option);
  }
}


/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {
  $('#btn-back').on('click', function() {
    window.history.back();
  });

  $('#btn-upload').on('click', function() {
    if (grecaptcha.getResponse() == "") {
      alert("자동등록방지 기능을 확인(체크)해주세요.");
      return;
    }

    if ($('#tr-pwd').css('display') != 'none') {
      reqInsertInquire();
    } else {
      reqUpdateInquire();
    }
  });
});
