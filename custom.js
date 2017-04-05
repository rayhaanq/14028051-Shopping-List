

if(localStorage.getItem("lists") !== null){
  lists = JSON.parse(localStorage.getItem("lists"));
} else {
  lists = {};
}

itemToEdit = 0;
chosenList = 0;
objToDelete = 0;
listToEdit = 0;



suggestedItems = ["Apples", "Apricot", "Aubergine", " Banana", "Beetroot", "Carrot", "Courgette", "Chive", "Fennel", "Potatoes", "Strawberries"];

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

  if(isEmpty(lists)){
    $("#emptyListsMsg").text("No lists");
  } else{
    $("#emptyListsMsg").text("");
  }

  generateLists();

  getListByName("aName");

  $( "#hardPress_menu" ).on( "popupafterclose", function( event, ui ) {

    $("#deleteListLI").collapsible({collapsed: true});

  } );


});

$(document).on( "taphold", ".aListLink", function( event ) {

   listToEdit = getName($(event.target));
   chosenList = $(event.target);
   objToDelete = $(event.target);

   localStorage.setItem("listToEdit", JSON.stringify(listToEdit));
  $("#hardPress_menu").popup("open");


} );

$(document).on("pagebeforeshow", "#pcreate_list", function(){

  if(localStorage.getItem("listToEdit") !== null){
    listToEdit = JSON.parse(localStorage.getItem("listToEdit"));

    $("#pcreate_list_title").text("Edit List");
    $("#listNameField").val(listToEdit);
    $("#createListButton").attr('onclick', 'saveEditedList()');
    //chosenItems = lists[listToEdit].items;
  //  localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
  }

  chosenItems = JSON.parse(localStorage.getItem("chosenItems"));
  generateItemList();


});

$(document).on("pagebeforeshow", "#pview_list", function(){

  if (localStorage.getItem("chosenList") !== null){
    chosenList = JSON.parse(localStorage.getItem("chosenList"));
  }

  $("#viewListPageTitle").text(chosenList);
  generateItemListView(getListByName(chosenList));
  setupAllStrikes();
  $("#itemViewList").listview("refresh");

});

chosenItems = {};

$(document).on("pageinit", "#pcreate_list", function(){



  $( "#add_item_popup" ).on( "popupbeforeposition", function( event, ui ) {

    $("#invalidItem").text("");

    if(JSON.parse(localStorage.getItem("suggestedItems")) !== null){
      suggestedItems = JSON.parse(localStorage.getItem("suggestedItems"));
    }


    generateSuggestedItems();

  });

  $( "#add_item_popup" ).on( "popupafterclose", function( event, ui ) {

    $( "#add_item_popup" ).find("#addItemTitle").text("Add item");
    $( "#add_item_popup" ).find("#itemNameField").val("");
    $( "#add_item_popup" ).find("#qtyField").val("");
    $( "#add_item_popup" ).find("#addItemSubmit").text("Add");
    $( "#add_item_popup" ).find("#addItemSubmit").attr('onclick', 'addItem()');

  } );


});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getListByName(aListName){
  var found = 0;

  for (list in lists){
    if(lists[list].name === aListName){
      found = lists[list].name;
    }
  }

  return found;
}

function confirmLeave(){
  $('#confirm_leave_popup').popup('close');
  $.mobile.back();

}

function confirmLeaveHome(){
  $.mobile.changePage("#home");

}

function generateSuggestedItems(){

  $("#itemNameList").empty();
  var output = "";

  for (var item in suggestedItems){
    output += "<li><a href='#' onclick='setItemName(this)'>" + suggestedItems[item] + "</a></li>";
  }
  $("#itemNameList").append(output);
  $("#itemNameList").listview("refresh");

}

function addToSuggestedItems(){
  for(var item in chosenItems){
    if ($.inArray(item, suggestedItems) == -1){
      suggestedItems.push(item);
      localStorage.setItem("suggestedItems", JSON.stringify(suggestedItems));
    }
  }
}

function editViewedList(){
  viewedList = $("#viewListPageTitle").text();
  listToEdit = $("#viewListPageTitle").text();
  $("#pcreate_list_title").text("Edit List");
  $("#listNameField").val(viewedList);
  $("#createListButton").attr('onclick', 'saveEditedList()');
  chosenItems = lists[viewedList].items;
  localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
  localStorage.setItem("listToEdit", JSON.stringify(listToEdit));
  $.mobile.changePage("#pcreate_list");

}

function editList(aList){
  $("#pcreate_list_title").text("Edit List");
  $("#listNameField").val(aList);
  $("#createListButton").attr('onclick', 'saveEditedList()');
  chosenItems = lists[aList].items;
  localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
  $.mobile.changePage("#pcreate_list");

}

function saveEditedList(){

  listName = $("#listNameField").val().trim();
  if (!listName){

    $("#no_name_popup").popup("open");
  } else {

    if (listName in lists) {
      lists[listName].items = chosenItems;
      localStorage.setItem("lists", JSON.stringify(lists));

    } else {

      delete lists[viewedList];
      lists[listName] = new Object();
      lists[listName].name = listName;
      lists[listName].items = chosenItems;
      localStorage.setItem("lists", JSON.stringify(lists));

    }



    $.mobile.changePage( "#home");

    $( "#listNameField" ).val("");
    chosenItems = {};
    localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
  }

}

function goToCreateListPage(){
  chosenItems = {};
  localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
  localStorage.removeItem("listToEdit");
  $("#pcreate_list_title").text("Create List");
  $("#listNameField").val("");
  $("#createListButton").attr('onclick', 'createList()');
  $.mobile.changePage("#pcreate_list");
}


function deleteViewedList(){
  var viewedList = $("#viewListPageTitle").text();
  delete lists[viewedList];
  localStorage.setItem("lists", JSON.stringify(lists));
  $.mobile.changePage("#home");
}

function generateLists(){

    var output = "";
    $("#listslist").empty();

    //var itemIdNumber = 0;
    for (var list in lists){
      output += "<li><a class='" + list + " aListLink' href='#' onclick='viewList(this)'>" + list + "<span class='ui-li-count'>" + Object.keys(lists[list].items).length + " item(s)</span></a><a class='" + list + "' href='#confirm_del_list_popup' data-rel='popup' onclick='setObjectToDelete(this)'></a></li>";

      //itemIdNumber += 1;
    }
    $("#listslist").append(output);
    $("#listslist").listview("refresh");

}

selectedList = 0;

function viewList(obj){
  selectedList = obj;
  chosenList = getName(obj);
  localStorage.setItem("chosenList", JSON.stringify(chosenList));
  $.mobile.changePage("#pview_list");

}

function deleteList(){
  $(objToDelete).closest("li").remove();
  delete lists[getName(objToDelete)];
  localStorage.setItem("lists", JSON.stringify(lists));
  $('#confirm_del_list_popup').popup('close');
}

function deleteListHardPress(){
  $(objToDelete).closest("li").remove();
  delete lists[getName(objToDelete)];
  localStorage.setItem("lists", JSON.stringify(lists));
  $('#hardPress_menu').popup('close');
}


function createList(){

  listName = $("#listNameField").val().trim();
  if (!listName){

    $("#no_name_popup").popup("open");
  } else {
    newList = new Object();
    newList.name = listName;
    newList.items = chosenItems;
    newList.checkedItems = new Array();
    lists[listName] = newList;
    localStorage.setItem("lists", JSON.stringify(lists));



    //lists[listName].items = chosenItems;
    //lists[listName].checkedItems = new Array();
    addToSuggestedItems();
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
    localStorage.setItem("chosenItems", JSON.stringify(chosenItems));


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
  var items = lists[aList].items;
  //var itemIdNumber = 0;
  for (var item in items){

    output += "<li><a id='" + item + "' class='" + item + "'  href='#' onclick='strikeThrough(this)'>" + item + "<span class='ui-li-count'>x" + items[item] + "</span></a></li>";

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
  var thisList = getListByName($("#viewListPageTitle").text());

  aCheckedItem = getName(obj);

  if ($(obj).hasClass("strike_through")) {
    $(obj).removeClass("strike_through");
    $(obj).buttonMarkup({ theme: "a" });
    $(obj).buttonMarkup({ icon: "" });
    lists[thisList].checkedItems.splice($.inArray(getName(obj), lists[thisList].checkedItems),1);
    localStorage.setItem("lists", JSON.stringify(lists));
  }else {
    $(obj).addClass("strike_through");
    $(obj).buttonMarkup({ theme: "b" });
    $(obj).addClass("ui-btn-icon-right");
    $(obj).buttonMarkup({ icon: "check" });


    lists[thisList].checkedItems.push(getName(obj));
    localStorage.setItem("lists", JSON.stringify(lists));



  }
}


function setupAllStrikes(){

try {
  var checkedItemsLength = lists[getListByName(chosenList)].checkedItems.length;
} catch (e) {
  lists[getListByName(chosenList)].checkedItems = new Array();
  var checkedItemsLength = 0;
}


    for(var i = 0; i<checkedItemsLength;i++){
       //var listItem = lists[getListByName(chosenList)].checkedItems[i];
       var listItem = lists[getListByName(chosenList)].checkedItems[i];
       var listElement = $("#" + listItem);



       listElement.addClass("strike_through");
       listElement.buttonMarkup({ theme: "b" });
       listElement.buttonMarkup({ icon: "check" });
       listElement.buttonMarkup({ iconpos: "right" });
       $("#itemViewList").listview("refresh");

       localStorage.setItem("lists", JSON.stringify(lists));
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
      localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
    } else {
      delete chosenItems[itemToEdit];
      chosenItems[itemName] = quantity;
      localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
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
  var classes = 0;
  if ($(obj).attr("class") == 0){
    classes = obj;
  } else {
    classes= $(obj).attr("class");

    try {
      classes = classes.substring(0, classes.indexOf(' '));
    } catch (e) {}

  }

  return classes;
}



function deleteItem() {


  $(objToDelete).closest("li").remove();
  delete chosenItems[getName(objToDelete)];
  localStorage.setItem("chosenItems", JSON.stringify(chosenItems));
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
