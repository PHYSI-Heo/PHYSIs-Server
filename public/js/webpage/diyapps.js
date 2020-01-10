var appObjs;

function setDIYApps(apps) {
  appObjs = apps;
  console.log(appObjs);
  showApplicationRows(appObjs);
  showApplicationRows(appObjs);
}

function contentFinder() {
  var keyword = $('#search-word').val();
  if (keyword.length > 2) {
    keyWordFilter(keyword, function(result) {
      showApplicationRows(result);
    });
  }
}

function keyWordFilter(keyWord, callback) {
  var findRows = [];
  if (appObjs.length == 0) {
    callback(findRows);
  }
  for (var i = 0; i < appObjs.length; i++) {
    if (appObjs[i].reference.indexOf(keyWord) != -1) {
      findRows.push(appObjs[i]);
    }
    if (i == appObjs.length - 1) {
      callback(findRows);
    }
  }
};
/* =============================================

        Create Elements / Append Elements

=============================================  */
function showApplicationRows(apps) {
  $('#app-grid').empty();
  for (var i = 0; i < apps.length; i++) {
    var appObj = apps[i];
    var $app_div = $("<div/>", {
      class: "app-box tab-shodow"
    });
    $app_div.attr('name', appObj.no);

    var $view_div = $("<div/>");
    $view_div.css('padding', "15px 20px 15px 20px");

    var $img = $("<img/>", {
      src: appObj.main_img
    });
    $img.css('width', '100%');

    var $name_p = $("<p/>", {
      class: "app-name"
    });
    $name_p.text(appObj.name);
    var $outline_p = $("<p/>", {
      class: "app-outline"
    });
    $outline_p.text(appObj.outline);

    $view_div.append($img).append($name_p).append($outline_p);
    $app_div.append($view_div);
    $('#app-grid').append($app_div);
  }
  // $('#app-grid').append($("<div/>", {
  //   class: "clear"
  // }));
}


function showDetailAppData(appObj) {
  appObj = appObj[0];
  console.log(appObj);
  $('#app-name').html(appObj.name);
  $('#app-outline').html(appObj.outline);
  $('#app-body').html(appObj.description);
}

/* =============================================

                Element Events

=============================================  */


$(document).ready(function() {

  $('.tab-shodow').live('click', function() {
    var no = $(this).attr('name');
    if (no) {
      window.location.href = '/diy/detail/app?no=' + no;
    }
  });

  $('#btn-search').on('click', function() {
    contentFinder();
  });

  $('#btn-refresh').on('click', function() {
    $('#search-word').val("");
    showApplicationRows(appObjs);
  });
});
