var express = require('express');
var router = express.Router();

var dbInterface = require('../modules/dbInterface');


/**
 * router - Route for returning rendered HTML for index.html
 */
router.get('/', function(req, res, next) {

    dbInterface.getItems('returnedDebitItems', function (items) {

        res.render('index', {
            title: 'Returned Debit Items'
        });
    });
});

/**
 * router - API route for getting items
 */
router.get('/items', function(req, res, next) {

    dbInterface.getItems('returnedDebitItems', function (items) {

        res.json(items);
    });
});

module.exports = router;
