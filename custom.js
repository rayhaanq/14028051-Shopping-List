

lists = {};

itemToEdit = 0;
chosenList = 0;
objToDelete = 0;
listToEdit = 0;

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

$(document).on("pagebeforeshow", "#home", function(){

  generateLists();


  $( "#hardPress_menu" ).on( "popupafterclose", function( event, ui ) {

    $("#deleteListLI").collapsible({collapsed: true});

  } );


});

$(document).on( "taphold", ".aListLink", function( event ) {

   listToEdit = getName($(event.target));
   chosenList = $(event.target);
   objToDelete = $(event.target);

  $("#hardPress_menu").popup("open");
  alert(JSON.stringify(lists));


} );

$(document).on("pagebeforeshow", "#pcreate_list", function(){


  generateItemList();


});

$(document).on("pagebeforeshow", "#pview_list", function(){


  $("#viewListPageTitle").text(chosenList);
  generateItemListView(chosenList);
  $("#itemViewList").listview("refresh");

});
chosenItems = {};
$(document).on("pageinit", "#pcreate_list", function(){



  $( "#add_item_popup" ).on( "popupbeforeposition", function( event, ui ) {

    $("#invalidItem").text("");

  });

  $( "#add_item_popup" ).on( "popupafterclose", function( event, ui ) {

    $( "#add_item_popup" ).find("#addItemTitle").text("Add item");
    $( "#add_item_popup" ).find("#itemNameField").val("");
    $( "#add_item_popup" ).find("#qtyField").val("");
    $( "#add_item_popup" ).find("#addItemSubmit").text("Add");
    $( "#add_item_popup" ).find("#addItemSubmit").attr('onclick', 'addItem()');

  } );


});

function editViewedList(){
  viewedList = $("#viewListPageTitle").text();
  $("#pcreate_list_title").text("Edit List");
  $("#listNameField").val(viewedList);
  $("#createListButton").attr('onclick', 'saveEditedList()');
  chosenItems = lists[viewedList];
  $.mobile.changePage("#pcreate_list");

}

function editList(aList){
  $("#pcreate_list_title").text("Edit List");
  $("#listNameField").val(aList);
  $("#createListButton").attr('onclick', 'saveEditedList()');
  chosenItems = lists[aList];
  $.mobile.changePage("#pcreate_list");

}

function saveEditedList(){

  listName = $("#listNameField").val().trim();
  if (!listName){

    $("#no_name_popup").popup("open");
  } else {

    if (listName in lists) {
      lists[listName] = chosenItems;
    } else {
      delete lists[viewedList];
      lists[listName] = chosenItems;
    }



    $.mobile.changePage( "#home");

    $( "#listNameField" ).val("");
    chosenItems = {};
  }

}

function goToCreateListPage(){
  chosenItems = {};
  $("#pcreate_list_title").text("Create List");
  $("#listNameField").val("");
  $("#createListButton").attr('onclick', 'createList()');
  $.mobile.changePage("#pcreate_list");
}


function deleteViewedList(){
  var viewedList = $("#viewListPageTitle").text();
  delete lists[viewedList];
  $.mobile.changePage("#home");
}

function generateLists(){

    var output = "";
    $("#listslist").empty();

    //var itemIdNumber = 0;
    for (var list in lists){
      output += "<li><a class='" + list + " aListLink' href='#' onclick='viewList(this)'>" + list + "<span class='ui-li-count'>" + Object.keys(lists[list]).length + " item(s)</span></a><a class='" + list + "' href='#confirm_del_list_popup' data-rel='popup' onclick='setObjectToDelete(this)'></a></li>";

      //itemIdNumber += 1;
    }
    $("#listslist").append(output);
    $("#listslist").listview("refresh");

}



function viewList(obj){
  chosenList = getName(obj);
  $.mobile.changePage("#pview_list");

}

function deleteList(){
  $(objToDelete).closest("li").remove();
  delete lists[getName(objToDelete)];
  $('#confirm_del_list_popup').popup('close');
}

function deleteListHardPress(){
  $(objToDelete).closest("li").remove();
  delete lists[getName(objToDelete)];
  $('#hardPress_menu').popup('close');
}


function createList(){

  listName = $("#listNameField").val().trim();
  if (!listName){

    $("#no_name_popup").popup("open");
  } else {

    lists[listName] = chosenItems;
    $.mobile.changePage( "#home");

    $( "#listNameField" ).val("");
    chosenItems = {};
  }


}

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

    output += "<li><a class='" + item + "' href='#' onclick='prepareEditItem(this)'>" + item + "<span class='ui-li-count'>x" + chosenItems[item] + "</span></a><a class='" + item + "' href='#confirm_del_popup' data-rel='popup' onclick='setObjectToDelete(this)'></a></li>";

    //itemIdNumber += 1;
  }
  $("#itemList").append(output);
  $("#itemList").listview("refresh");
}

function generateItemListView(aList){
  var output = "";
  $("#itemViewList").empty();
  var items = lists[aList];
  //var itemIdNumber = 0;
  for (var item in items){

    output += "<li><a class='" + item + "'  href='#' onclick='strikeThrough(this)'>" + item + "<span class='ui-li-count'>x" + items[item] + "</span></a></li>";

    //itemIdNumber += 1;
  }
  $("#itemViewList").append(output);
  //$("#itemViewList").listview("refresh");
}

// function generateEditItemList(aList){
//   var output = "";
//   $("#itemList").empty();
//   var items = lists[aList];
//   //var itemIdNumber = 0;
//   for (var item in items){
//
// output += "<li><a class='" + item + "' href='#' onclick='prepareEditItem(this)'>" + item + "<span class='ui-li-count'>x" + chosenItems[item] + "</span></a><a class='" + item + "' href='#confirm_del_popup' data-rel='popup' onclick='setObjectToDelete(this)'></a></li>";
//     //itemIdNumber += 1;
//   }
//   $("#itemList").append(output);
//   //$("#itemViewList").listview("refresh");
// }

function strikeThrough(obj){
  if ($(obj).hasClass("strike_through")) {
    $(obj).removeClass("strike_through");
    $(obj).buttonMarkup({ icon: "" });
  }else {
    $(obj).addClass("strike_through");
    $(obj).addClass("ui-btn-icon-right");

    $(obj).buttonMarkup({ icon: "check" });

  }

}



function prepareEditItem(obj){

  $( "#add_item_popup" ).find("#addItemTitle").text("Edit item");
  $( "#add_item_popup" ).find("#addItemSubmit").text("Save");
  $( "#add_item_popup" ).find("#itemNameField").val(getName(obj));
  $( "#add_item_popup" ).find("#qtyField").val(chosenItems[getName(obj)]);
  $( "#add_item_popup" ).popup("open");
  $( "#add_item_popup" ).find("#addItemSubmit").attr('onclick', 'editItem()');
  itemToEdit = getName(obj);

}

function editItem (){
  itemName = $("#itemNameField").val().trim();
  quantity = $("#qtyField").val();

  if (!itemName || !quantity || quantity <= 0) {

        if (quantity <= 0){

          $("#invalidItem").text("Quantity must be 1 or more");
        } else {
          $("#invalidItem").text("Please fill all fields");
        }

  } else {

    if (itemName == itemToEdit){
      chosenItems[itemName] = quantity;
    } else {
      delete chosenItems[itemToEdit];
      chosenItems[itemName] = quantity;
    }
    $( "#add_item_popup" ).popup("close");

    // $("#itemList").append("<li><a href='#'>" + itemName + "<span class='ui-li-count'>x" + quantity + "</span></a><a href='#'></a></li>");
    // $("#itemList").listview("refresh");
    generateItemList();

    $("#itemNameField").val("");
    $("#qtyField").val("");

  }



}


function getName(obj){
  var classes= $(obj).attr("class");

  classes = classes.substring(0, classes.indexOf(' '));

  return classes;
}



function deleteItem() {


  $(objToDelete).closest("li").remove();
  delete chosenItems[getName(objToDelete)];
  $('#confirm_del_popup').popup('close');


}

function setObjectToDelete(obj){
  objToDelete = obj;
}

function closeConfirmDelete(){
  $('#confirm_del_popup').popup('close');
}


function setItemName(obj){

  var selectedItem = $(obj).text();
  $("input[id=itemNameField]").val(selectedItem);
  $("#itemNameList").addClass("ui-screen-hidden");

}
