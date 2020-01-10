var contentTab;
var contentObjs;
var downloadObjs;
var kitUpdateType = "new";
var selectedRow;

function getDownloadFileList() {
  $.ajax({
    type: "POST",
    dataType: 'json',
    data: {
      'searchType': 'download'
    },
    url: '/manager/get/storage/files',
    timeout: 2000,
    success: function(res) {
      setFileListPopup(res.files);
    }
  });
}

function setContents(contents) {
  console.log(contentObjs = contents);
  for (var i = 0; i < contentObjs.length; i++) {
    showContentTab(contentObjs[i].no, contentObjs[i].name);
  }
}


function setDownloads(downloads) {
  console.log(downloadObjs = downloads);
}

function reqUpdateKitDownload() {
  var version = $('#download-kit-version').val();
  var arduino_lib = $('#download-kit-arduino-lib').val();
  var arduino_menual = $('#download-kit-arduino-menual').val();
  var android_git = $('#download-kit-android-git').val();
  var android_menual = $('#download-kit-android-menual').val();

  if (version == "" || arduino_lib == "" || arduino_menual == "" || android_git == "" || android_menual == "") {
    alert("No input path..");
    return;
  }

  var params = {
    "updateType": kitUpdateType,
    "version": version,
    "arduino_lib": arduino_lib,
    "arduino_menual": arduino_menual,
    "android_git": android_git,
    "android_menual": android_menual
  }

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: params,
    url: '/manager/download/update/kitsoftware',
    timeout: 2000,
    success: function(res) {
      alert("Update Result :: " + res.resCode);
      location.reload();
    }
  });
}


function reqUpdateContentDownload() {
  if (!contentTab) {
    alert("No selected content..");
    return;
  }

  var no = $('#content-no').val();
  var name = $('#content-name').val();
  var name_kr = $('#content-name-kr').val();

  var outline = $('#download-outline').val();
  var communication = $('#download-communication').val();
  var composition = $('#download-composition').val();
  var description = $('#download-description').val();

  var package = $('#download-package').val();
  var menual = $('#download-menual').val();
  var ex_arduino = $('#download-ex-arduino').val();
  var arduino_code = $('#download-arduino-code').val();
  var reference_lib = $('#download-reference-lib').val();
  var ex_android = $('#download-ex-android').val();
  var android_apk = $('#download-android-apk').val();
  var android_git = $('#download-android-git').val();

  if (outline == "" || communication == "" || composition == "" || description == "" || package == "" ||
    menual == "" || arduino_code == "" || ex_android == "" || android_apk == "" || android_git == "") {
    alert("No input path..");
    return;
  }

  var params = {
    "no": no,
    "name": name,
    "name_kr": name_kr,
    "outline": outline,
    "communication": communication,
    "composition": composition,
    "description": description,
    "package": package,
    "menual": menual,
    "arduino_code": arduino_code,
    "ex_android": ex_android,
    "android_apk": android_apk,
    "android_git": android_git
  }

  if (ex_arduino != "") {
    params.ex_arduino = ex_arduino;
  }

  if (reference_lib != "") {
    params.reference_lib = reference_lib;
  }

  $.ajax({
    type: "POST",
    dataType: 'json',
    data: params,
    url: '/manager/download/update/content',
    timeout: 2000,
    success: function(res) {
      alert("Result Code : " + res.resCode);
      location.reload();
    }
  });

}

/* =============================================

        Create Elements / Append Elements

=============================================  */

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

function setKitSoftware(kitsoftware) {
  kitsoftware = kitsoftware[0];
  console.log(kitsoftware);
  if (kitsoftware) {
    kitUpdateType = "update";
    $('#download-kit-version').val(kitsoftware.version);
    $('#download-kit-arduino-lib').val(kitsoftware.arduino_lib);
    $('#download-kit-arduino-menual').val(kitsoftware.arduino_menual);
    $('#download-kit-android-git').val(kitsoftware.android_git);
    $('#download-kit-android-menual').val(kitsoftware.android_menual);
  } else {
    kitUpdateType = "new";
  }
}


function showDownloadInfos(info) {
  console.log(info);
  if(info){
    $('#download-outline').val(info.outline);
    $('#download-communication').val(info.communication);
    $('#download-composition').val(info.composition);
    $('#download-description').val(info.description);

    $('#download-package').val(info.package);
    $('#download-menual').val(info.menual);
    $('#download-ex-arduino').val(info.ex_arduino);
    $('#download-arduino-code').val(info.arduino_code);
    $('#download-reference-lib').val(info.reference_lib);
    $('#download-ex-android').val(info.ex_android);
    $('#download-android-apk').val(info.android_apk);
    $('#download-android-git').val(info.android_git);
  }else{
    $('#download-outline').val("");
    $('#download-communication').val("");
    $('#download-composition').val("");
    $('#download-description').val("");

    $('#download-package').val("");
    $('#download-menual').val("");
    $('#download-ex-arduino').val("");
    $('#download-arduino-code').val("");
    $('#download-reference-lib').val("");
    $('#download-ex-android').val("");
    $('#download-android-apk').val("");
    $('#download-android-git').val("");
  }
}

/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {

  $('.content-item').on('click', function() {
    if (contentTab != undefined || contentTab != null) {
      contentTab.removeClass("this");
    }

    contentTab = $(this);
    $(this).addClass("this");
    var no = $(this).attr("value");

    var contentObj = contentObjs.filter(function(content) {
      return content.no == no;
    });
    contentObj = contentObj[0];
    $('#content-no').val(contentObj.no);
    $('#content-name').val(contentObj.name);
    $('#content-name-kr').val(contentObj.name_kr);

    var downloadObj = downloadObjs.filter(function(download) {
      return download.no == no;
    });
    showDownloadInfos(downloadObj[0]);
  });

  $('#download-table').on('click', '.textbtn', function() {
    var file_td = $(this).closest("tr").find("td:eq(1)");
    var input = file_td.children().eq(0);
    input.attr('value', null);
  });

  $('.download-file').on('click', function() {
    if ($('#files-popup').css('display') != 'none') {
      return;
    }
    selectedRow = $(this);
    $('#files-popup').css('display', 'block');
  });

  $('#btn-close').on('click', function() {
    $('#files-popup').css('display', 'none');
  });

  $('#file-row').live('click', function() {
    selectedRow.val($(this).text());
    $('#files-popup').css('display', 'none');
  });

  $('#btn-update').on('click', function() {
    reqUpdateContentDownload();
  });

  $('#btn-kit-update').on('click', function() {
    reqUpdateKitDownload();
  });

});
