var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ViewerSchema = new Schema(
  {
    viewername: {type: String, required: true, max: 100}
  }
);

// Virtual for viewer's screenshot URL
ViewerSchema
.virtual('screenshot_url')
.get(function () {
  return 'http://192.168.0.12:8080/SampleService/api/screenshot/' + this.viewername;
});

// Virtual for author's URL
ViewerSchema
.virtual('url')
.get(function () {
  return '/viewers/' + this._id;
});

//Export model
module.exports = mongoose.model('Viewer', ViewerSchema);