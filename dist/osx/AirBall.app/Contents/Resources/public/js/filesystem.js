/* --------------------------------------------
 * AirBall v1.0
 * Filename: filesystem.js
 * URL: http://airball.in
 * Author: Bharani Muthukumaraswamy <bharani@abhayam.co.in>
 * Author URL: http://abhayam.co.in
 --------------------------------------------*/



var fs = (function() {

  var api = {};
  
  api.save_file =  function(url) {
    segment = url.split("/");
    file_name = segment[segment.length - 1];
    var f = Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory(), file_name);
    if (!f.exists()) {
      var c = Titanium.Network.createHTTPClient();
      c.onload = function() {
        f.write(this.responseData);
      }
      c.open('GET',url, true);
      c.send();         
    }
    
    return f;
  }
 
 
  api.get_file = function(url) {
    return Titanium.Filesystem.getFile(Titanium.Filesystem.getApplicationDataDirectory(), file_name);
  }
    
  return api;
  
}());
