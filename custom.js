


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
  itemName = $("#itemNameField").val().trim();
  quantity = $("#qtyField").val();

  if (!itemName || !quantity || quantity <= 0) {

        if (quantity <= 0){

          $("#invalidItem").text("Quantity must be 1 or more");
        } else {
          $("#invalidItem").text("Please fill all fields");
        }

  //       setTimeout(function(){  $("#invalidItem").popup("close"); }, 5000);
  //   });
  } else {
    chosenItems[itemName] = quantity;
    //alert(JSON.stringify(chosenItems));

    $( "#add_item_popup" ).popup("close");

    // $("#itemList").append("<li><a href='#'>" + itemName + "<span class='ui-li-count'>x" + quantity + "</span></a><a href='#'></a></li>");
    // $("#itemList").listview("refresh");
    generateItemList();

    $("#itemNameField").val("");
    $("#qtyField").val("");
  }

}

function generateItemList(){
  var output = "";
  $("#itemList").empty();

  //var itemIdNumber = 0;
  for (var item in chosenItems){

    output += "<li><a href='#' >" + item + "<span class='ui-li-count'>x" + chosenItems[item] + "</span></a><a id='" + item + "' href='#' onclick='deleteItem(this)'></a></li>";

    //itemIdNumber += 1;
  }
  $("#itemList").append(output);
  $("#itemList").listview("refresh");
}

function deleteItem(obj) {
  $(obj).closest("li").remove();

  delete chosenItems[$(obj).attr("id")];
}

function setItemName(obj){

  var selectedItem = $(obj).text();
  $("input[id=itemNameField]").val(selectedItem);
  $("#itemNameList").addClass("ui-screen-hidden");

}
