
$(document).on('pageinit', function(){

  $("input[id=itemNameField]").focus(function() {
    $("#itemNameList").removeClass("ui-screen-hidden");



  });



  // $("input[id=itemNameField]").focusout(function() {
  //   $("#itemNameList").addClass("ui-screen-hidden");
  // });

});


// $(document).on("pageinit", "#pcreate_list", function(){
//
//   $("input[id=itemNameField]").focusout(function(){
//
//     $("#itemNameList").addClass("ui-screen-hidden");
//   });
//
//
// });

function setItemName(obj){

  var selectedItem = $(obj).text();
  $("input[id=itemNameField]").val(selectedItem);
  $("#itemNameList").addClass("ui-screen-hidden");

}
