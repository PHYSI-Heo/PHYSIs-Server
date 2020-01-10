function setBoardDatas(resObj) {
  console.log(resObj);
  var FIND_TYPEs = ["제목", "내용", "콘텐츠", "작성자"];

  var items = resObj.items;
  setBoardPaging(resObj.page, items.length, function(pageInfo) {
    if (pageInfo.endItemIdx == 0) {
      showNoItemMessage();
    } else {
      showPaging(pageInfo);
      var showItems = items.slice(pageInfo.startItemIdx, pageInfo.endItemIdx);
      for (var i = 0; i < showItems.length; i++) {
        showInquireRow(showItems[i]);
      }
    }
  });

  if (resObj.categorys) {
    showCategoryMenu(resObj.categorys, resObj.category);
    setCategoryOptions(resObj.categorys, resObj.category);
  }

  if (resObj.findType) {
    $('#selected-findType').val(FIND_TYPEs[Number(resObj.findType)]);
  }

  if (resObj.keyWord) {
    $('#search-word').val(resObj.keyWord);
  }
}

function setBoardPaging(viewPage, totalItemCnt, callback) {
  var limitPaging = 5;
  var showItemCnt = 5;
  // console.log("# Current View Page : " + viewPage);
  var block = Math.ceil(viewPage / limitPaging);
  var startPage = ((block - 1) * limitPaging) + 1;
  var endPage = startPage + limitPaging - 1;
  var totalPage = Math.ceil(totalItemCnt / showItemCnt);
  if (totalPage < endPage) {
    endPage = totalPage;
  }
  // console.log("# Current Block : " + block + " [Start] = " + startPage + " [End] = " + endPage);
  var startItemIndex = ((viewPage - 1) * showItemCnt);
  var endItemIndex = viewPage * showItemCnt;
  if (endItemIndex > totalItemCnt) {
    endItemIndex = totalItemCnt;
  }
  // console.log("# Current Item : [Start] = " + startItemIndex + " [End] = " + endItemIndex);
  callback({
    "viewPage": viewPage,
    "startPage": startPage,
    "endPage": endPage,
    "totalPage": totalPage,
    "startItemIdx": startItemIndex,
    "endItemIdx": endItemIndex
  });
}

function removePaginParams() {
  var url = window.location.href;
  var idx = url.indexOf('&page');
  if (idx != -1) {
    url = url.substring(0, idx);
  }
  if (url.indexOf('?') == -1) {
    url += "?";
  }
  return url;
}

/* =============================================

        Create Elements / Append Elements

=============================================  */
function showPaging(pageInfo) {
  // previous Paging
  var $li_previous = $("<li/>", {
    class: "paging"
  });
  var $a_previous = $("<a/>");
  var $i_left = $("<i/>", {
    class: "fas fa-chevron-left"
  });
  $a_previous.append($i_left);
  if (pageInfo.viewPage != 1) {
    $a_previous.attr('href', removePaginParams() + '&page=' + (parseInt(pageInfo.viewPage) - 1));
  }
  $('#board-page').append($li_previous.append($a_previous));

  // Item Paging
  for (var i = parseInt(pageInfo.startPage); i <= parseInt(pageInfo.endPage); i++) {
    var $li = $("<li/>", {
      class: "paging"
    });
    var $a_page = $("<a/>");
    $a_page.attr('href', removePaginParams() + '&page=' + i);
    if (i == pageInfo.viewPage) {
      $a_page.addClass("this");
    }
    $a_page.text(i);
    $('#board-page').append($li.append($a_page));
  }

  // Next Paging
  var $li_next = $("<li/>", {
    class: "paging"
  });
  var $a_next = $("<a/>");
  var $i_right = $("<i/>", {
    class: "fas fa-chevron-right"
  });
  $a_next.append($i_right);
  if (pageInfo.viewPage != pageInfo.totalPage) {
    $a_next.attr('href', removePaginParams() + '&page=' + (parseInt(pageInfo.viewPage) + 1));
  }
  $('#board-page').append($li_next.append($a_next));
}

function showInquireRow(item) {
  var $tr = $("<tr/>", {
    class: "board-row"
  });
  $tr.css('font-weight', '600')
  $tr.attr('id', 'inquire-row');
  $tr.attr('name', item.no);
  // Click event
  $tr.on('click', function() {
    checkSecretStatus(item.no, item.pwdState);
  });
  // Category
  var $td_category = $("<td/>", {
    class: "col-category"
  });
  $td_category.css('text-align', 'center');
  $td_category.html(item.category);
  $tr.append($td_category);
  // Content
  var $td_content = $("<td/>", {
    class: "hide-mobile"
  });
  $td_content.css('text-align', 'center');
  $td_content.html(item.content);
  $tr.append($td_content);
  // Title
  var $td_title = $("<td/>", {
    class: "col-title"
  });
  $td_title.css('padding-left', 10);
  var $span_title = $("<span/>", {
    // class: "single-line"
  });
  $span_title.css('padding-left', 7);
  $span_title.html(item.title);
  if (item.pwdState == 1) {
    var $i_lock = $("<i/>", {
      class: "fas fa-lock"
    });
    $i_lock.css('padding-left', 7);
    $span_title.append($i_lock);
  }
  $td_title.append($span_title);
  // Title User (Mobile)
  var $i_m_user = $("<i/>", {
    class: "far fa-user"
  });
  $i_m_user.css('padding-left', 7);
  var $span_m_user = $("<span/>");
  $span_m_user.css('padding-left', 7);
  $span_m_user.html(item.user);
  // Title Date (Mobile)
  var $i_m_date = $("<i/>", {
    class: "far fa-clock"
  });
  $i_m_date.css('padding-left', 15);
  var $span_m_date = $("<span/>");
  $span_m_date.css('padding-left', 7);
  $span_m_date.html(item.date);
  // Title hide Span Tag
  var $span_mobile = $("<span/>", {
    class: "hide-window row-registrant"
  });
  $span_mobile.append($i_m_user).append($span_m_user).append($i_m_date).append($span_m_date);
  $td_title.append($span_mobile);
  $tr.append($td_title);
  // Inquire State
  var $td_state = $("<td/>", {
    class: "col-state"
  });
  if (item.replyState == 0) {
    $td_state.html("미답변");
  } else {
    $td_state.html("답변완료");
  }
  $td_state.css('text-align', 'center');
  $tr.append($td_state);
  // User
  var $td_user = $("<td/>", {
    class: "hide-mobile"
  });
  $td_user.css('text-align', 'center');
  $td_user.html(item.user);
  $tr.append($td_user);
  // DateTime
  var $td_date = $("<td/>", {
    class: "hide-mobile"
  });
  $td_date.css('text-align', 'center');
  $td_date.html(item.date);
  $tr.append($td_date);
  $('#inquire-items').append($tr);
}

function showNoItemMessage() {
  var $div = $("<div/>", {
    class: "board-row"
  });
  $div.css('text-align', 'center');
  $div.css('height', '40px');
  $div.css('line-height', '40px');
  $div.css('font-weight', '500');
  $div.html("등록된 게시물이 없습니다.");
  $('#no-item-msg').append($div);
}

function showCategoryMenu(categoryList, category) {
  var $a = $("<a/>", {
    class: "category"
  });
  var $i = $("<i/>", {
    class: "fas fa-th"
  });
  var $span = $("<span>전체보기</span>");

  $a.append($i).append($span);
  $('#menu-category').append($a);

  if (!category) {
    $a.addClass("this");
  }

  for (var i = 1; i < categoryList.length; i++) {
    var $a = $("<a/>", {
      class: "category"
    });
    $a.attr('value', i);

    var $i = $("<i/>", {
      class: categoryList[i].iconClass
    });

    if (category && categoryList[i].name == category) {
      $a.addClass("this");
    }

    var $span = $("<span>" + categoryList[i].name + "</span>");

    $a.append($i).append($span);
    $('#menu-category').append($a);
  }
}

function setCategoryOptions(categoryList, category) {
  for (var i = 0; i < categoryList.length; i++) {
    var $option = $("<option/>");
    $option.html(categoryList[i].name);
    $('#selected-category').append($option);
  }

  if (category)
    $('#selected-category').val(category);
}

function checkSecretStatus(no, pwdState) {
  if ($('.popup-box').css('display') != 'none') {
    return;
  }

  if (pwdState == 1) {
    $("#item-no").val(no);
    $("#auth-pwd").val("");
    $("#auth-err").html("");
    $('.popup-box').show();
  } else {
    showDetailInquireInfo(no)
  }
}

function showDetailInquireInfo(no) {
  var form = document.createElement("form");
  form.action = "/inquire/read";
  form.method = "post";

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute('name', "no");
  input.setAttribute("value", no);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
}

/* =============================================

                Element Events

=============================================  */
$(document).ready(function() {

  $('.category').on('click', function() {
    var categoryValue = $(this).attr("value");
    var urlPath = "/inquire/board/list"
    if (categoryValue != undefined) {
      urlPath += "?category=" + categoryValue;
    }
    window.location.replace(urlPath);
  });

  $('#btn-search').on('click', function() {
    var keyword = $('#search-word').val();

    if (!keyword || keyword.length < 2) {
      alert("2글자 이상 입력하세요.");
      return;
    }

    var type = $("#selected-findType option").index($("#selected-findType option:selected"));
    var url = window.location.href;
    var idx = url.indexOf('&findType');
    if (idx != -1) {
      url = url.substring(0, idx);
    }
    // if (!url.includes("?")) {
    //   url += "?";
    // }
    if (url.indexOf("?") == -1) {
      url += "?";
    }
    url += "&findType=" + type + "&keyWord=" + encodeURI(keyword , "UTF-8");

    window.location.href = url;
  });

  $('#btn-write').on('click', function() {
    window.location.href = '/inquire/write';
  });

  $('#btn-close').on('click', function() {
    $('.popup-box').hide();
  });

  $('#btn-auth').on('click', function() {
    if ($("#auth-pwd").val() == "") {
      $("#auth-err").html("패스워드를 입력해주세요.");
      return;
    }

    var authData = {
      "no": $("#item-no").val(),
      "pwd": $("#auth-pwd").val()
    }

    $.ajax({
      type: "POST",
      dataType: 'json',
      data: authData,
      url: '/inquire/auth/password',
      timeout: 2000,
      success: function(res) {
        if (res.resCode == 2001) {
          $("#auth-err").html("패스워드가 일치하지 않습니다.");
        } else if (res.resCode == 1001) {
          showDetailInquireInfo($("#item-no").val());
        } else {
          $("#auth-err").html("서버와 통신이 원활하지 않습니다.");
        }
      }
    });
  });

  $('#selected-category').change(function() {
    if ($('#selected-category').css('display') != 'none') {
      var index = $("#selected-category option").index($("#selected-category option:selected"));
      var urlPath = "/inquire/board/list"
      if (index != 0) {
        urlPath += "?category=" + index;
      }
      window.location.replace(urlPath);
    }
  });
});
