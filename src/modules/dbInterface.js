var mongoClient = require('mongodb').MongoClient,
    socket = require('socket.io-client')('http://localhost:3000');

var CONFIG = require('../config/config');

var dbInterface = {},
    url = 'mongodb://' + CONFIG.dbUsername + ':' + CONFIG.dbPassword + '@' + CONFIG.dbURL;

var getConnection = function (callback) {

    mongoClient.connect(url, function(err, db) {
        console.log('Connected correctly to database server.');

        callback && callback(db);
    });
};

dbInterface.saveItem = function (item, collectionName, notificationName) {

    getConnection(function (db) {
        var collection = db.collection(collectionName);

        collection.findOne(item).then(function (result) {

            if (result === null) {
                collection.insertOne(item)
                    .then(function (result) {

                        if (result.insertedCount === 1 && notificationName) {
                            socket.emit(notificationName, item);
                        } else {
                            console.log('There was a problem saving item: ');
                            console.log(result.ops[0]);
                        }
                    });
            }
            db.close().then(function () {
                console.log('Disconnected from database server.');
            });
        });
    });
};

dbInterface.getItems = function (collectionName, callback) {

    getConnection(function (db) {
        var collection = db.collection(collectionName);

        collection.find().toArray().then(function (items) {

            db.close();
            console.log(items);
            callback && callback(items);
        });
    });
};

module.exports = dbInterface;
