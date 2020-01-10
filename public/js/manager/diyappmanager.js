var editData;
var updateType = 'new';
var appObjs;

function reqUpdateApplication(apps) {
  appObjs = apps;
  console.log(appObjs);
  for (var i = 0; i < appObjs.length; i++) {
    showApplicationTab(appObjs[i].no, appObjs[i].name);
  }
}

function reqUpdateApp(params) {
  params.description = CKEDITOR.instances.editor1.getData();
  params.reference = $('#app-reference').val();
  console.log(params);
  $.ajax({
    type: "POST",
    dataType: 'json',
    data: params,
    url: '/manager/diy/update/apps',
    timeout: 2000,
    success: function(res) {
      alert("Update Result :: " + res.resCode);
      location.reload();
    }
  });
}

function reqDeleteApp(no) {
  $.ajax({
    type: "POST",
    dataType: 'json',
    data: {
      'no': no
    },
    url: '/manager/diy/delete/app',
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

function showApplicationTab(no, appName) {
  var $a = $("<a/>", {
    class: "content-item"
  });
  $a.attr('value', no);
  var $span = $("<span>" + appName + "</span>");
  $a.append($span);
  $('#apps-nav').append($a);
}

function showAppInfos(appObj) {
  $('#app-no').val(appObj.no);
  $('#app-name').val(appObj.name);
  $('#app-img').val(appObj.main_img);
  $('#app-reference').val(appObj.reference);
  $('#app-outline').val(appObj.outline);
  CKEDITOR.instances.editor1.setData(appObj.description);
}



/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {
  var selectedAppTab = $('#new-register');
  $('.content-item').on('click', function() {
    if (selectedAppTab != undefined || selectedAppTab != null) {
      selectedAppTab.removeClass("this");
    }

    selectedAppTab = $(this);
    $(this).addClass("this");
    var no = $(this).attr("value");
    if (no == 0) {
      updateType = "new";
      CKEDITOR.instances.editor1.setData(null);
      $('#app-no').val(null);
      $('#app-name').val("");
      $('#app-img').val("");
      $('#app-reference').val("");
      $('#app-outline').val("");
    } else {
      updateType = "change";
      var appObj = appObjs.filter(function(app) {
        return app.no == no;
      });
      showAppInfos(appObj[0]);
    }
  });

  $('#btn-update-app').on('click', function() {
    var name = $('#app-name').val();
    var main_img = $('#app-img').val();
    var outline = $('#app-outline').val();
    if (!editData || editData == 0 || main_img.length ==0 || name.length == 0 || outline.length == 0) {
      return;
    }

    var reqData = {
      'updateType': updateType,
      'no': $('#app-no').val(),
      'name': name,
      'main_img':main_img,
      'outline': outline
    }
    reqUpdateApp(reqData);
  });

  $('#btn-del-app').on('click', function() {
    var no = $('#app-no').val();
    if (no == undefined || no == null || no == "") {
      return;
    }
    reqDeleteApp(no);
  });
});
