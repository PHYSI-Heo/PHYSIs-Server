/* =============================================

        Create Elements / Append Elements

=============================================  */

function addUpdateRow() {

  $upload_type_td = $("<td/>");
  $upload_type_td.css('padding', "5px");
  $type_select = $("<select/>", {
    name : "uploadtype",
    class : "width-full"
  });
  $option_img = $("<option/>");
  $option_img.text("Image");
  $option_download = $("<option/>");
  $option_download.text("Download");
  $type_select.append($option_img).append($option_download);
  $upload_type_td.append($type_select);

  $file_td = $("<td/>");
  $file_td.css('padding', "5px");
  $input_file = $("<input/>", {
    type : "file",
    name : "uploadfile",
    class : "width-full"
  });
  $file_td.append($input_file);

  $tr = $("<tr/>");
  $tr.append($upload_type_td).append($file_td);
  $('#upload-items').append($tr);
}


/* =============================================

                Element Events

=============================================  */

$(document).ready(function() {
  $('#btn-addrow').on('click', function() {
    addUpdateRow();
  });

  $('#btn-search').on('click', function() {
    $.ajax({
      type: "POST",
      dataType: 'json',
      data: {"searchType" : $('#file-selector').val()},
      url: '/manager/get/storage/files',
      timeout: 2000,
      success: function(res) {
        console.log(res);
      }
    });
  });

});
