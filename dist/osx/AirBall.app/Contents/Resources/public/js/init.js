/* --------------------------------------------
 * AirBall v1.0
 * Filename: init.js
 * URL: http://airball.in
 * Author: Bharani Muthukumaraswamy <bharani@abhayam.co.in>
 * Author URL: http://abhayam.co.in
 --------------------------------------------*/


// Save Locally
function save_file_locally(title, url) {
  return fs.save_file(title, url);
}

// Initialize application
jQuery(document).ready(function($) {
  $("#article, .main, .sidebar, .post_list_container").height($(document).height() - 50);

  $(".refresh").live("click", function() {
    window.app.refresh(window.location.hash.split("#")[1] || "");
  });

  $(".item a.shot_link").live("click", function() {
    $(".item.active").removeClass("active");
    $(this).parent().addClass("active");
    $(".main").html($("<div/>", {
      id : "loading",
      text : "loading..."
    }));
  });

  $(window).bind("resize", function() {
    $("#article, .main, .sidebar, .post_list_container").height($(document).height() - 50);
  });

  $("button.save").live("click", function(e) {
    var file_name = fs.save_file($(this).data("remote-url"));
    var shot_data = {
      "title" : $(this).data("title"),
      "url" : file_name.toString(),
      "remote_image_url" : $(this).data("remote-url"),
      "player_name" : $(this).data("player-name"),
    };

    // window.save_shot(shot_data);
    var last_id = db.save_shot(shot_data);
    $(".save_local").html("<h3>Saved to your collections</h3>");

  });

  $("button.local_shots").click(function() {
    var local_shots = Titanium.UI.createWindow({
      id : "collectionWindow",
      url : "app://local_shots.html",
      title : "Your collections",
      width : screen.width * .8,
      height : screen.height * .8,
      x : screen.width * .1,
      y : screen.height * .1,

    });

    local_shots.open();

  });
});


// Positioning window wrt to screen
var currentWindow = Titanium.UI.getCurrentWindow();
currentWindow.setWidth(screen.width * .9);
currentWindow.setHeight(screen.height * .9);
currentWindow.setY(screen.height * .05);
currentWindow.setX(screen.width * .05);


// Tray Icon
var current_window = Titanium.UI.getMainWindow();
window.hidden = false;

var tray = Titanium.UI.addTray("app://public/images/airball_favicon.png", function() {

  if(hidden) {
    current_window.show();
    window.hidden = false;
  } else {
    window.hidden = true;
    current_window.hide();

  }

});


// Prevent Exit on clicking Close
Titanium.UI.getCurrentWindow().addEventListener(Titanium.CLOSE, function(event) {
  window.hidden = true;
  current_window.hide()
  event.stopPropagation();
});

Titanium.UI.getCurrentWindow().addEventListener(Titanium.MINIMIZED, function(event) {
  window.hidden = true;
  current_window.hide();
});

current_window.addEventListener(Titanium.UNFOCUSED, function(event) {
  window.hidden = true;
});
