var downloadObjs;
var kitGitUrl;


function setContentDownloads(contents) {
  console.log(downloadObjs = contents);
  setDownloadList(downloadObjs);
}

function setDownloadList(downloads) {
  $('#download-items').empty();
  if (!downloads || downloads.length == 0) {
    $('#no-item-msg').css('display', 'block');
  } else {
    $('#no-item-msg').css('display', 'none');
    for (var i = 0; i < downloads.length; i++) {
      showDownloadRow(downloads[i]);
    }
  }
}

function reqFileDownload(fileName) {
  var form = document.createElement("form");
  form.action = "/download/file";
  form.method = "post";
  // form.enctype = "text/plain";

  var input = document.createElement("input");
  input.setAttribute("type", "hidden");
  input.setAttribute('name', "fileName");
  input.setAttribute("value", fileName);
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();

  // NOTE: Download Error..
  //Resource interpreted as Document but transferred with MIME type application/octet-stream
}

function contentFinder() {
  var keyword = $('#search-word').val();
  if (keyword.length > 2) {
    console.log(keyword);
    keyWordFilter(keyword, function(result) {
      setDownloadList(result);
    });
  }
}

function keyWordFilter(keyWord, callback) {
  var findRows = [];
  if (downloadObjs.length == 0) {
    callback(findRows);
  }
  for (var i = 0; i < downloadObjs.length; i++) {
    if (downloadObjs[i].name.indexOf(keyWord) != -1) {
      findRows.push(downloadObjs[i]);
    }
    if (i == downloadObjs.length - 1) {
      callback(findRows);
    }
  }
};


/* =============================================

        Create Elements / Append Elements

=============================================  */
function setKitDownloads(kitObj) {
  kitObj = kitObj[0];
  console.log(kitObj);
  $('#kit-version').text($('#kit-version').text() + " " + kitObj.version);
  $('#btn-kit-arduino-lib').attr('name', kitObj.arduino_lib);
  $('#btn-kit-arduino-menual').attr('name', kitObj.arduino_menual);
  $('#btn-kit-android-menual').attr('name', kitObj.android_menual);
  kitGitUrl = kitObj.android_git;
}

function showDownloadRow(obj) {
  // console.log(obj);
  $tr = $('<tr/>');

  $outline_td = $('<td/>');
  $name_p = $('<p/>', {
    class: "content-name"
  });
  $name_p.text(obj.name);

  $outline_p = $('<p/>', {
    class: "content-explain"
  });
  $outline_p.text(obj.outline);

  $download_p = $('<p/>', {
    class: "hide-window",
    id: "download_link",
    name: obj.no
  });
  $download_p.css("text-align", "right");
  $ic_i = $('<i/>', {
    class: "fas fa-cloud-download-alt"
  });
  $download_span = $('<span>DownLoad</span>');
  $download_span.css('padding-left', '10px');
  $download_span.css('font-weight', '700');
  $download_p.append($ic_i).append($download_span);
  $outline_td.append($name_p).append($outline_p).append($download_p);

  $communication_td = $('<td/>', {
    class: "hide-mobile"
  });
  $communication_td.css("text-align", "center");
  $communication_p = $('<p/>', {
    class: "content-explain"
  });
  $communication_p.html(obj.communication.replace(/\n/g, "<br />"));
  $communication_p.css("padding-left", "0px");
  $communication_td.append($communication_p);

  $composition_td = $('<td/>', {
    class: "hide-mobile"
  });
  $composition_td.css("text-align", "center");
  $composition_p = $('<p/>', {
    class: "content-explain"
  });
  $composition_p.html(obj.composition.replace(/\n/g, "<br />"));
  $composition_p.css("padding-left", "0px");
  $composition_td.append($composition_p);

  $download_td = $('<td/>', {
    class: "hide-mobile"
  });

  $link_btn = $('<button/>', {
    id: "download_link",
    class: "downloadbtn width-full btn-shodow",
    name: obj.no
  });
  $link_btn.css('float', 'none');
  $link_btn.css('font-size', '14px');
  $icon_i = $('<i/>', {
    class: "fas fa-cloud-download-alt"
  });
  $span = $('<span>Download</span>');
  $span.addClass("hide-btn-text");
  $span.css('padding-left', '8px');
  $download_td.append($link_btn.append($icon_i).append($span));

  $tr.append($outline_td).append($communication_td).append($composition_td).append($download_td);
  $('#download-items').append($tr);
}

function showDetailDownloadInfos(download) {
  var downloadObj = download[0]
  console.log(downloadObj);
  $('#content-name').text(downloadObj.name);
  $('#content-name-kr').text(downloadObj.name_kr);
  $('#download-description').html(downloadObj.description);
  $('#download-package').attr('name', downloadObj.package);
  $('#download-menual').attr('name', downloadObj.menual);
  $('#download-arduino-code').attr('name', downloadObj.arduino_code);
  if (downloadObj.ex_arduino) {
    $('#download-ex-arduino').attr('name', downloadObj.ex_arduino);
    $('#ex-arduino-div').css('display', 'block');
  }
  if (downloadObj.reference_lib) {
    $('#download-reference-lib').attr('name', downloadObj.reference_lib);
    $('#arduino-lib-div').css('display', 'block');
  }

  $('#download-anroid-apk').attr('name', downloadObj.android_apk);
  $('#download-ex-anroid').attr('name', downloadObj.ex_android);
  $('#download-android-git').prop('href', downloadObj.android_git);

}
/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {

  $('#download_link').live('click', function() {
    window.location.href = '/download/detail?no=' + $(this).attr('name');
  });

  $('.req-download').on('click', function() {
    var fileName = $(this).attr('name');
    // console.log(fileName);
    reqFileDownload(fileName);
  });

  $('#download-ex-anroid').on('click', function() {
    var giturl = $(this).attr('name');
    console.log(giturl);
    if (giturl) {
      window.location.href = giturl;
    }
  });

  $('#btn-search').on('click', function() {
    contentFinder();
  });

  $('#btn-refresh').on('click', function() {
    $('#search-word').val("");
    setDownloadList(downloadObjs);
  });

  $('#btn-kit-git').live('click', function() {
    if (kitGitUrl) {
      window.location.href = kitGitUrl;
    }
  });

});
