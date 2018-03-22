'use strict';

var fs = require('fs'),
    request = require('request');
 
module.exports = function(viewer) {
    
    var download = function(uri, filename, callback){
      request.head(uri, function(err, res, body){
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };
    
    download('http://placehold.it/1920x1080?text='+viewer.viewer_name, 'public/_cache/viewer_images/'+viewer.viewer_name+'.png', function(err,success){
        console.log('done');
    });
    
    console.log(viewer.live_screenshot_url);
};