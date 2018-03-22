var express = require('express');
var router = express.Router();

// Require controller modules.
var viewer_controller = require('../controllers/viewerController');

// GET Viewer home page.
router.get('/', viewer_controller.index);

// GET request for creating a Viewer. NOTE This must come before routes that display Viewer (uses id).
router.get('/viewer/create', viewer_controller.viewer_create_get);

// POST request for creating Viewer.
router.post('/viewer/create', viewer_controller.viewer_create_post);

// GET request to delete Viewer.
router.get('/viewer/:id/delete', viewer_controller.viewer_delete_get);

// POST request to delete Viewer.
router.post('/viewer/:id/delete', viewer_controller.viewer_delete_post);

// GET request to update Viewer.
router.get('/viewer/:id/update', viewer_controller.viewer_update_get);

// POST request to update Viewer.
router.post('/viewer/:id/update', viewer_controller.viewer_update_post);

// GET request for one Viewer.
router.get('/viewer/:id', viewer_controller.viewer_detail);

// GET request for list of all Viewer items.
router.get('/all', viewer_controller.viewer_list);

// // GET request for list of all Viewer items after caching screenshots.
// router.get('/cache', viewer_controller.viewer_cache_get);

// POST request for list of all Viewer items after caching screenshots.
// router.post('/cache', viewer_controller.viewer_cache_post);

module.exports = router;

