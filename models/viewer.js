var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ViewerSchema = new Schema(
  {
    published: {type: Boolean, required: true},
    viewer_name: {type: String, required: true, max: 100},
    display_name: {type: String, required: false, max: 100},
    last_updated: {type: Date, required: true},
  }
);

// Virtual for viewer's screenshot URL
ViewerSchema
.virtual('live_screenshot_url')
.get(function () {
  return 'http://192.168.0.12:8080/SampleService/api/screenshot/' + this.viewername;
});

ViewerSchema
.virtual('cached_screenshot_url')
.get(function () {
  return 'http://some/network/path/for/cached/images/' + this.viewername + '.jpg';
});

// Virtual for individual viewer's URL
ViewerSchema
.virtual('url')
.get(function () {
  return '/viewers/viewer/' + this._id;
});

//Export model
module.exports = mongoose.model('Viewer', ViewerSchema);