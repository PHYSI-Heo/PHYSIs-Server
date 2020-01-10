function reqInquireInfo(no) {
  var form = document.createElement("form");
  form.action = "/manager/inquire/read";
  form.method = "post";

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute('name', "no");
  input.setAttribute("value", no);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}


function reqReplyInquire(no) {
  var reply = $("#inquire-reply").val();
  if(reply == ""){
    return ;
  }

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: {
      "no": no,
      "reply" : reply
    },
    url: '/manager/reply/inquire',
    timeout: 2000,
    success: function(res) {
      console.log(res);
      if (res.resCode != 1001) {
        alert("답변 정보 저장 오류 :: " + res.resCode);
      } else {
        alert("답변 정보 저장 성공.");
      }
      window.location.replace("/manager");
      // window.location.replace("/manager/inquire/list");
    }
  });
}

function reqRemoveInquire(no) {
  $.ajax({
    type: "POST",
    dataType: 'json',
    data: {
      "no": no
    },
    url: '/inquire/delete',
    timeout: 2000,
    success: function(res) {
      console.log(res);
      if (res.resCode != 1001) {
        alert("문의 정보 삭제 오류 :: " + res.resCode);
      } else {
        alert("문의 정보 삭제 성공.");
      }
      window.location.replace("/manager");
      // window.location.replace("/manager/inquire/list");
    }
  });
}

/* =============================================

        Create Elements / Append Elements

=============================================  */

function showInquireInfo(itemObj) {
  console.log(itemObj);
  $('#inquire-no').val(itemObj.no);

  $("#read-title").html(itemObj.title);
  $("#read-user").html(itemObj.user);
  $("#read-date").html(itemObj.date);
  $("#read-description").html(itemObj.description.toString().replace(/\n/g, "<br>"));

  if (itemObj.replyState == undefined || itemObj.replyState == null || itemObj.replyState == '0') {
    $("#inquire-reply").html("");
  } else {
    $("#inquire-reply").html(itemObj.reply);
  }
  // $('#btn-reply').attr('name', itemObj.no);
  // $('#btn-delete').attr('name', itemObj.no);
}


/* =============================================

                Element Events

=============================================  */
$(document).ready(function() {

  $('.board-row').live('click', function () {
    reqInquireInfo($(this).attr('name'));
  });

  $('#btn-reply').on('click', function () {
    reqReplyInquire($('#inquire-no').val());
  });

  $('#btn-del').live('click', function() {
    reqRemoveInquire($('#inquire-no').val());
  });
});
