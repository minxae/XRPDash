import * as widgets from "./widgets.js"; 

$(function() {
    widgets.setAllData("asdasd");
});

// Refresh handlers
$(".refresh-all-content").on("click", function(){
    widgets.setAllData("asdasd");
});