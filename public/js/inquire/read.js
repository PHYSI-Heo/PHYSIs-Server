var itemObj;

function reqEditInquire(info) {
  var form = document.createElement("form");
  form.action = "/inquire/edit";
  form.method = "post";

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute('name', "editinfo");
  input.setAttribute("value", JSON.stringify(info));
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}


function reqDeleteInquire(no) {
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
        alert("문의 정보 삭제에 실패하였습니다.\n잠시 후 다시 시도해주세요.");
      } else {
        alert("문의 정보가 삭제되었습니다.");
        window.location.replace("/inquire/board/list");
      }
    }
  });
}


/* =============================================

        Create Elements / Append Elements

=============================================  */
function showReadInfos(item) {
  itemObj = item;
  console.log(item);

  $("#read-title").html(itemObj.title);
  $("#read-user").html(itemObj.user);
  $("#read-date").html(itemObj.date);
  $("#read-description").html(itemObj.description.toString().replace(/\n/g, "<br>"));

  if (itemObj.pwdState != undefined && itemObj.pwdState != null && itemObj.pwdState == '1') {
    if (itemObj.replyState == '0') {
      // Set Edit Btn
      var $editInput = $("<input/>", {
        class: "textbtn",
        type: "button",
        value: "수정"
      });
      $editInput.attr('id', 'btn-edit');
      $('#read-btns').append($editInput);
    }
    // Set Delete Btn
    var $delInput = $("<input/>", {
      class: "textbtn",
      type: "button",
      value: "삭제"
    });
    $delInput.attr('id', 'btn-delete');
    $delInput.attr('name', itemObj.no);
    $('#read-btns').append($delInput);
  }

  if (itemObj.replyState == undefined || itemObj.replyState == null || itemObj.replyState == '0') {
    $("#read-reply").html("아직 답변이 없습니다.");
  } else {
    $("#read-reply").html(itemObj.reply.toString().replace(/\n/g, "<br>"));
  }

}

/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {
  $('#btn-back').on('click', function() {
    window.history.back();
  });

  $('#btn-edit').live('click', function() {
    if (itemObj != undefined && itemObj != null) {
      reqEditInquire(itemObj);
    } else {
      alert("잘못된 접근입니다.");
    }
  });

  $('#btn-delete').live('click', function() {
    reqDeleteInquire($(this).attr('name'));
  });
});
