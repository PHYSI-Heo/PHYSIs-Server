const ADD_IMG_LIMIT = 4;
var selectedImgRow;
var updateType = "new";
var contentObjs;


function reqImageFileList() {
  $.ajax({
    type: "POST",
    dataType: 'json',
    data: {
      'searchType': 'image'
    },
    url: '/manager/get/storage/files',
    timeout: 2000,
    success: function(res) {
      setFileListPopup(res.files);
    }
  });
}

function setContentElements(objs) {
  console.log(contentObjs = objs);
  for (var i = 0; i < contentObjs.length; i++) {
    showContentTab(contentObjs[i].no, contentObjs[i].name);
  }
}


function reqUpdateContent() {
  var files = [];
  $('#content-imgs').children().each(function(index) {
    var $target = $('#content-imgs').children().eq(index).children().eq(0);
    var value = $target.val();
    if (value && value.length != 0) {
      files.push({
        "priority": index,
        "filename": $target.val()
      });
    }
  });
  // console.log(files);

  var name = $('#content-name').val();
  var name_kr = $('#content-name-kr').val();
  var outline = $('#content-outline').val();
  var description = $('#content-description').val();
  var main_img = $('#content-main-img').val();
  var youtube = $('#content-youtube').val();

  // if (name == "" || name_kr == "" || outline == "" || description == "" ||
  //   main_img == "" || youtube == "" || files.length == 0) {
  //   return;
  // }
  if (name == "" || name_kr == "" || outline == "" || description == "" ||
    main_img == "" || files.length == 0) {
    alert("No input data..");
    return;
  }

  var reqData = {
    "updateType": updateType,
    "no": $('#content-no').val(),
    "name": name,
    "name_kr": name_kr,
    "outline": outline,
    "description": description,
    "main_img": main_img,
    "youtube": youtube,
    "visible": ($('#rbtn-visible').is(':checked')) ? 1 : 0,
    "imgs": JSON.stringify(files)
  };

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: reqData,
    url: '/manager/content/update',
    timeout: 2000,
    success: function(res) {
      alert("Update Result :: " + res.resCode );
      location.reload();
    }
  });
}

function reqDeleteContent() {
  $.ajax({
    type: "POST",
    dataType: 'json',
    data: {
      "no": $('#content-no').val()
    },
    url: '/manager/content/delete',
    timeout: 2000,
    success: function(res) {
      alert("Delete Result :: " + res.resCode);
      location.reload();
    }
  });
}

/* =============================================

        Create Elements / Append Elements

=============================================  */

function addimageTab(rowIndex, imageName) {
  var $div = $("<div/>");

  var $fileinput = $("<input/>", {
    class: "select-img width-70",
    type: "text",
  });
  $fileinput.attr('readonly', true);
  $fileinput.attr('name', rowIndex);
  $fileinput.attr('value', imageName);

  var $btninput = $("<input/>", {
    class: "button-submit width-25",
    type: "button",
  });
  $btninput.css('margin-left', '5%');
  $btninput.attr('id', 'btn-del');
  $btninput.attr('name', rowIndex);
  $btninput.attr('value', "Delete");

  $div.append($fileinput).append($btninput);

  $('#content-imgs').append($div);
}


function setFileListPopup(files) {
  for (var i = 0; i < files.length; i++) {

    var $p = $("<p/>", {
      class: "files-item"
    });
    $p.text(files[i]);
    $p.attr('id', 'file-row');

    $('#file-list').append($p);
  }
}


function showContentTab(no, contentName) {
  var $a = $("<a/>", {
    class: "content-item"
  });
  $a.attr('value', no);
  var $span = $("<span>" + contentName + "</span>");
  $a.append($span);
  $('#content-nav').append($a);
}


function showContentInfos(info) {
  console.log(info);
  $('#content-no').val(info.no);
  $('#content-name').val(info.name);
  $('#content-name-kr').val(info.name_kr);
  $('#content-outline').val(info.outline);
  $('#content-description').val(info.description);
  $('#content-main-img').val(info.main_img);
  $('#content-youtube').val(info.youtube);
  if (info.visible == 1) {
    $('#rbtn-visible').attr("checked", true);
  } else {
    $('#rbtn-hidden').attr("checked", true);
  }
  var images = info.imgs;
  for (var i = 0; i < images.length; i++) {
    addimageTab(i, images[i].filename);
  }
}

function removeImageRow(rowIndex) {
  $('#content-imgs').children().eq(rowIndex).remove();

  $('#content-imgs').children().each(function(index) {
    var $target = $('#content-imgs').children().eq(index).children().eq(1);
    // console.log("New Index : " + index);
    $target.attr('name', index);
  });
}

/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {
  var contentTab = $('#new-register');
  // Selected Content Tab
  $('.content-item').on('click', function() {
    contentTab.removeClass("this");
    contentTab = $(this);
    // var no = $(this).attr("value");
    $(this).addClass("this");

    var no = $(this).attr("value");
    if (no == 0) {
      updateType = "new"
      $('#content-no').val(null);
      $('#content-name').val("");
      $('#content-name-kr').val("");
      $('#content-outline').val("");
      $('#content-description').val("");
      $('#content-main-img').val("");
      $('#content-youtube').val("");
      $('#rbtn-visible').attr("checked", true);
      $('#content-imgs').empty();
      $('#btn-update').val("등록");
      $('#btn-del-content').css('display', 'none');
    } else {
      updateType = "change";
      $('#content-imgs').empty();
      $('#btn-update').val("수정");
      $('#btn-del-content').css('display', 'block');
      var info = contentObjs.filter(function(content) {
        return content.no == no;
      });
      showContentInfos(info[0]);
    }
  });
  // Click Add Image
  $('#btn-addimage').on('click', function() {
    var imgIdx = $('#content-imgs').children().length;
    addimageTab(imgIdx, null);
  });
  // Click Popup Close
  $('#btn-close').on('click', function() {
    $('#files-popup').css('display', 'none');
  });
  // Click Content UpDate
  $('#btn-update').on('click', function() {
    reqUpdateContent();
  });
  // Click content delete
  $('#btn-del-content').on('click', function() {
    reqDeleteContent();
  });
  // Click remove Image Row
  $('#btn-del').live('click', function() {
    removeImageRow($(this).attr('name'));
  });
  // CLick Image Row
  $('.select-img').live('click', function() {
    if ($('#files-popup').css('display') != 'none') {
      return;
    }
    selectedImgRow = $(this);
    $('#files-popup').css('display', 'block');
  });
  // Selected image file
  $('#file-row').live('click', function() {
    selectedImgRow.val($(this).text());
    $('#files-popup').css('display', 'none');
  });
});
