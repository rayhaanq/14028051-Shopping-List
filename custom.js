


$(document).on('pageinit', function(){

  $("input[id=itemNameField]").focus(function() {
  $("#itemNameList").removeClass("ui-screen-hidden");

  });

  $("input[id=qtyField]").focus(function() {
  $("#itemNameList").addClass("ui-screen-hidden");

  });

  // $("input[id=itemNameField]").focusout(function() {
  //   $("#itemNameList").addClass("ui-screen-hidden");
  // });

});

$(document).on("pageinit", "#pcreate_list", function(){

  chosenItems = {};

  $( "#add_item_popup" ).on( "popupbeforeposition", function( event, ui ) {

    $("#invalidItem").text("");

  });


});

function addItem(){
  var itemName = $("#itemNameField").val().trim();
  var quantity = $("#qtyField").val();

  if (!itemName || !quantity) {
        $("#invalidItem").text("Please fill all fields");
  //       setTimeout(function(){  $("#invalidItem").popup("close"); }, 5000);
  //   });
  } else {
    chosenItems[itemName] = quantity;
    alert(JSON.stringify(chosenItems));
    $("#itemNameField").val("");
    $("#qtyField").val("");
    $( "#add_item_popup" ).popup("close");

  }

}



function setItemName(obj){

  var selectedItem = $(obj).text();
  $("input[id=itemNameField]").val(selectedItem);
  $("#itemNameList").addClass("ui-screen-hidden");

}
