
function setGridContents(contents) {
  console.log(contents);
  // show Grid.
  for (var i = 0; i < contents.length; i++) {
    showContentGridView(contents[i]);
  }
}

function setDetailContent(content) {
  console.log(content);
  // show Detail Infos.
  showContentDetailView(content);
}

/* =============================================

        Create Elements / Append Elements

=============================================  */
function showContentGridView(contentObj) {
  var $li = $("<li/>", {
    class: "grid-item"
  });

  var $img = $("<img/>", {
    src: "/img/content/" + contentObj.main_img
  });

  var $a = $("<a/>", {
    href: "/content?no=" + contentObj.no
  });

  var $div = $("<div/>", {
    class: "grid-hover"
  });
  var $h1 = $("<h1>" + contentObj.name + "</h1>");
  var $p = $("<p>" + contentObj.name_kr + "</p>");
  // $p.css('color', '#d47b50');

  $a.append($div.append($h1).append($p));
  $('#contents-gird').append($li.append($img).append($a));
}


function showContentDetailView(contentObj) {
  var $h1 = $("<h1>" + contentObj.name + "<h1/>");
  var $h1_kr = $("<h1>" + contentObj.name_kr + "<h1/>");
  $h1_kr.css("font-size", "28px");
  $h1_kr.css("line-height", "50px");

  var $outline_div = $("<div/>", {
    class: "one-column"
  });
  var $outline_p = $("<p>" + contentObj.outline.replace(/\n/g, "<br>") + "<p/>");
  var $download_btn = $("<input/>",{
      class : "button-submit width-85",
      type : "button",
      value : "DOWNLOAD"
  });
  $download_btn.css('float', 'left');
  $download_btn.attr('name', contentObj.no);
  $download_btn.attr('id', 'btn-download')
  $outline_div.append($outline_p).append($download_btn);

  var $description_div = $("<div/>", {
    class: "two-column"
  });
  var $description_p = $("<p>" + contentObj.description.replace(/\n/g, "<br />") + "<p/>");
  $description_div.append($description_p);
  var $clear_div = $("<div/>", {
    class: "clear"
  });
  $('#text-infos').append($h1).append($h1_kr).append($outline_div);
  $('#text-infos').append($description_div).append($clear_div);

  $('#img-main').attr('src', "/img/content/" + contentObj.main_img);
  if(contentObj.youtube == "" || contentObj.youtube == undefined){
      $('#video-frame').css('display', 'none');
  }else{
      $('#youtube-frame').attr('src', contentObj.youtube);
  }

  for (var i = 0; i < contentObj.images.length; i++) {
    var $img = $("<img/>", {
      src: "/img/content/" + contentObj.images[i]
    });
    $img.css({'width':'100%', 'padding-top':'30px'});
    $('#img-infos').append($img);
  }
}


/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {

  $('#btn-download').live('click', function() {
    window.location.href = '/download/detail?no=' + $(this).attr('name');
  });
});
