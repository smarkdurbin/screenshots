var Viewer = require('../models/viewer');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        viewer_count: function(callback) {
            Viewer.count(callback);
        },
    }, function(err, results) {
        res.render('viewers', { title: 'Viewers', error: err, data: results });
    });
};

// Display list of all viewers.
exports.viewer_list = function(req, res, next) {

  Viewer.find({}, 'viewername')
    .exec(function (err, list_viewers) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('viewers_list', { title: 'Viewers List', viewers: list_viewers });
    });
    
};

// Display detail page for a specific viewer.
exports.viewer_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer detail: ' + req.params.id);
};

// Display viewer create form on GET.
exports.viewer_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer create GET');
};

// Handle viewer create on POST.
exports.viewer_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer create POST');
};

// Display viewer delete form on GET.
exports.viewer_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer delete GET');
};

// Handle viewer delete on POST.
exports.viewer_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer delete POST');
};

// Display viewer update form on GET.
exports.viewer_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer update GET');
};

// Handle viewer update on POST.
exports.viewer_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Viewer update POST');
};