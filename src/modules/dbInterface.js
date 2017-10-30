var mongoClient = require('mongodb').MongoClient,
    socket = require('socket.io-client')('http://localhost:3000');

var CONFIG = require('../config/config');


/**
 * Use CONFIG file details to connect to MongoDB database
 */
var dbInterface = {},
    url = 'mongodb://' + CONFIG.dbUsername + ':' + CONFIG.dbPassword + '@' + CONFIG.dbURL;

var getConnection = function (callback) {

    mongoClient.connect(url, function(err, db) {
        console.log('Connected correctly to database server.');

        callback && callback(db);
    });
};

/**
 * dbInterface.saveItem - saves an item to the database in the collection specified and emits a socket.io event upon completion to notify users that a file has been processed
 *
 * @param  {type} item             The item to save
 * @param  {type} collectionName   The collection to save the item to
 * @param  {type} notificationName The socket.io event name to emit
 * @return {type}                  Return void
 */
dbInterface.saveItem = function (item, collectionName, notificationName) {

    getConnection(function (db) {
        var collection = db.collection(collectionName);

        collection.findOne(item).then(function (result) {

            if (result === null) {
                collection.insertOne(item)
                    .then(function (result) {

                        if (result.insertedCount === 1 && notificationName) {
                            // Emit socket.io notification
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

/**
 * dbInterface.getItems - Get all items from the specified collection
 *
 * @param  {type} collectionName The name of the collection to get items from
 * @param  {type} callback       The callback function to use
 * @return {type}                Return void
 */
dbInterface.getItems = function (collectionName, callback) {

    getConnection(function (db) {
        var collection = db.collection(collectionName);

        collection.find().toArray().then(function (items) {

            db.close();
            callback && callback(items);
        });
    });
};

module.exports = dbInterface;
