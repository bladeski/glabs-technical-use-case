var express = require('express');
var router = express.Router();

var dbInterface = require('../modules/dbInterface');

/* GET home page. */
router.get('/', function(req, res, next) {

    dbInterface.getItems('returnedDebitItems', function (items) {

        res.render('index', {
            title: 'Returned Debit Items'
        });
    });
});

router.get('/items', function(req, res, next) {

    dbInterface.getItems('returnedDebitItems', function (items) {

        res.json(items);
    });
});

module.exports = router;
