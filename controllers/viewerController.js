var Viewer = require('../models/viewer');

var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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

    Viewer.find({})
        .exec(function (err, list_viewers) {
          if (err) { return next(err); }
          //Successful, so render
            console.log(list_viewers);
          res.render('viewers_list', { title: 'Viewers List', viewers: list_viewers });
        });
    
};

// Display detail page for a specific viewer.
exports.viewer_detail = function(req, res, next) {
    async.parallel({
        viewer: function(callback) {
            Viewer.findById(req.params.id)
              .exec(callback);
        }

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.viewer==null) { // No results.
            var err = new Error('Viewer not found');
            err.status = 404;
            console.log(results);
            return next(err);
        }
        // Successful, so render
        res.render('viewer_detail', { title: 'Viewer Detail', viewer: results.viewer } );
    });
};

// Display viewer create form on GET.
exports.viewer_create_get = function(req, res, next) { 
    res.render('viewer_form', { title: 'Create Viewer' });
};

// Handle viewer create on POST.
exports.viewer_create_post = [

    // Validate fields.
    body('viewer_name').isLength({ min: 1 }).trim().withMessage('Viewer Name must be specified.')
        .matches(/^([A-z0-9\_]+)$/g).withMessage('<strong>Viewer Name</strong> contains invalid characters<br>&nbsp; &#x21B3; upper/lower case letters, numbers, and underscores only'),
    body('display_name').isLength({ min: 1 }).trim().withMessage('Display Name must be specified.')
        .matches(/^([A-z0-9\ ()]+)$/g).withMessage('<strong>Display Name</strong> contains invalid characters<br>&nbsp; &#x21B3; (upper/lower case letters, spaces, and numbers only).'),

    // Sanitize fields.
    sanitizeBody('viewer_name').trim().escape(),
    sanitizeBody('display_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            console.log(errors.array());
            res.render('viewer_form', { title: 'Create Viewer', viewer: req.body, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.
            
            console.log(req.body);

            // Create a Viewer object with escaped and trimmed data.
            var viewer = new Viewer(
                {
                    viewer_name: req.body.viewer_name,
                    display_name: req.body.display_name,
                    last_updated: new Date(Date.now()),
                    published: req.body.published
                });
            viewer.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new viewer record.
                res.redirect(viewer.url);
            });
        }
    }
];

// Display viewer delete form on GET.
exports.viewer_delete_get = function(req, res, next) {

    async.parallel({
        viewer: function(callback) {
            Viewer.findById(req.params.id).exec(callback)
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.viewer==null) { // No results.
            res.redirect('/viewers/all');
        }
        // Successful, so render.
        res.render('viewer_delete', { title: 'Delete Viewer', viewer: results.viewer } );
    });

};

// Handle viewer delete on POST.
exports.viewer_delete_post = function(req, res, next) {

    async.parallel({
        viewer: function(callback) {
          Viewer.findById(req.body.viewerid).exec(callback)
        }
    }, function(err, results) {
        if (err) { return next(err); }
        // Author has no books. Delete object and redirect to the list of viewers.
        Viewer.findByIdAndRemove(req.body.viewerid, function deleteViewer(err) {
            if (err) { return next(err); }
            // Success - go to viewer list
            res.redirect('/viewers/all')
        })
    });
};

// Display viewer update form on GET.
exports.viewer_update_get = function(req, res, next) {

    // Get book, authors and genres for form.
    async.parallel({
        viewer: function(callback) {
            Viewer.findById(req.params.id).exec(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.viewer==null) { // No results.
                var err = new Error('Viewer not found');
                err.status = 404;
                return next(err);
            }
            // Success.
            // Mark our selected genres as checked.
            res.render('viewer_form', { title: 'Update Viewer: ' + results.viewer.viewer_name, viewer: results.viewer });
        });

};

// Handle viewer update on POST.
exports.viewer_update_post = [
   
    // Validate fields.
    body('viewer_name').isLength({ min: 1 }).trim().withMessage('Viewer Name must be specified.')
        .matches(/^([A-z0-9\_]+)$/g).withMessage('<strong>Viewer Name</strong> contains invalid characters<br>&nbsp; &#x21B3; upper/lower case letters, numbers, and underscores only'),
    body('display_name').isLength({ min: 1 }).trim().withMessage('Display Name must be specified.')
        .matches(/^([A-z0-9\ ()]+)$/g).withMessage('<strong>Display Name</strong> contains invalid characters<br>&nbsp; &#x21B3; (upper/lower case letters, spaces, and numbers only).'),

    // Sanitize fields.
    sanitizeBody('viewer_name').trim().escape(),
    sanitizeBody('display_name').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a Viewer object with escaped and trimmed data and old id
        var viewer = new Viewer(
            {
                viewer_name: req.body.viewer_name,
                display_name: req.body.display_name,
                last_updated: new Date(Date.now()),
                published: req.body.published,
                _id:req.params.id //This is required, or a new ID will be assigned!
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
            async.parallel({
                viewers: function(callback) {
                    Viewer.find(callback);
                }
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('viewer_form', { title: 'Update Viewer: ' + viewer.viewer_name, viewer: viewer, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Viewer.findByIdAndUpdate(req.params.id, viewer, {}, function (err,theviewer) {
                if (err) { return next(err); }
                   // Successful - redirect to book detail page.
                   res.redirect(theviewer.url);
                });
        }
    }
];