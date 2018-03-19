var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ViewerSchema = new Schema(
  {
    _name: {type: String, required: true, max: 100}
  }
);

// Virtual for author's full name
ViewerSchema
.virtual('name')
.get(function () {
  return this._name;
});

// Virtual for author's URL
ViewerSchema
.virtual('url')
.get(function () {
  return '/viewers/' + this._id;
});

//Export model
module.exports = mongoose.model('Viewer', ViewerSchema);