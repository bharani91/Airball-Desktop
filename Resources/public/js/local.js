/* --------------------------------------------
 * AirBall v1.0
 * Filename: local.js
 * URL: http://airball.in
 * Author: Bharani Muthukumaraswamy <bharani@abhayam.co.in>
 * Author URL: http://abhayam.co.in
 --------------------------------------------*/


var db = (function() {
  var api = {};
  
  var conn = Titanium.Database.open('airball_2');
  conn.execute('CREATE TABLE IF NOT EXISTS shots (id INTEGER PRIMARY KEY, url TEXT, player_name TEXT, title TEXT, remote_image_url TEXT, created_at DATETIME)');
  api.all_shots = function(page_number)  {
    results = [];
    var offset = page_number*10;
    var resultSet = conn.execute('SELECT * FROM shots ORDER BY id DESC LIMIT 10 OFFSET ' + offset );

    while (resultSet.isValidRow()) {         
      results.push({
        id: resultSet.fieldByName('id'),
        title: resultSet.fieldByName('title'),
        player_name: resultSet.fieldByName('player_name'),
        url: resultSet.fieldByName('url'),
        remote_image_url: resultSet.fieldByName('remote_image_url'),
        created_at:  resultSet.fieldByName('created_at')
      });
      resultSet.next();
    }
    resultSet.close();
    
    return results;
  }


  api.valid_shot = function(current_title) {
    var resultSet = conn.execute('SELECT * FROM shots WHERE title = ?', current_title);
    if (resultSet.isValidRow()) {
      return false
    }
    
    return true;
  }
  
  
  api.result_count = function() {
    var resultSet = conn.execute('SELECT * from shots WHERE id = (SELECT MAX(id) FROM shots);');
    return resultSet.fieldByName("id");
  }
  
  api.save_shot = function(options) { 
    if(api.valid_shot(options['title'])) {
      var date = new Date();
      conn.execute('INSERT INTO shots (url, player_name, remote_image_url, title, created_at) VALUES(?, ?, ?, ?, CURRENT_TIMESTAMP)', options['url'], options['player_name'], options['remote_image_url'], options['title']);
      return conn.lastInsertRowId; 
    }
  }
  
  return api;
}());


