var fs = require('fs-plus'),
    xmlParser = require('fast-xml-parser'),
    jsonFind = require('json-find');

var CONFIG = require('../config/config');

var dbInterface = require('./dbInterface');

var dataProcessor = {};

/**
 * dataProcessor.monitor - monitors the selected directory for new files
 *
 * @param  {type} dataDirectory The directory to monitor
 */
dataProcessor.monitor = function (dataDirectory) {

    var fileLocation = dataDirectory + '/new';
    fs.readdir(fileLocation, function (err, items) {

        if (err) {
            console.log("Error accessing data directory. Error:");
            console.log(err);
            return;
        }

        items.forEach(function (item) {

            var readStream = fs.createReadStream(fileLocation + '/' + item),
                file = '';

            readStream.on('data', function (chunk) {
                file += chunk;
            }).on('end', function () {
                processFile(file);
                moveFile(item, fileLocation, dataDirectory + '/archive');
            });
        });

        // Continue monitoring the data directory - scan every 30 seconds
        setTimeout(function () {
            dataProcessor.monitor(dataDirectory);
        }, CONFIG.scanInterval);
    });
};


/**
 * processFile - validates that a file is valid XML and then saves XML and returned debit items to db
 *
 * @param  {type} file The file to process
 * @return {type}      Return void
 */
function processFile (file) {

    var options = {
        attrPrefix : "_",
        textNodeName : "#text",
        ignoreNonTextNodeAttr : false,
        ignoreTextNodeAttr : false,
        ignoreNameSpace : true,
        ignoreRootElement : false,
        textNodeConversion : true,
        textAttrConversion : false,
        arrayMode : false
    };

    if (xmlParser.validate(file) === true) {
        var json = xmlParser.parse(file, options);
        dbInterface.saveItem(json, 'documents');

        var values = jsonFind.findValues(json, 'ReturnedDebitItem');

        values.ReturnedDebitItem.forEach(function (item) {
            dbInterface.saveItem(item, 'returnedDebitItems', 'New Item');
        });
    }
};

/**
 * moveFile - Moves a file from one location to another
 *
 * @param  {type} file        The file to move
 * @param  {type} location    The current location of the file
 * @param  {type} destination The location to move the file to
 * @return {type}             Return void
 */

function moveFile (file, location, destination) {

    if (fs.isFileSync(location + '/' + file) && fs.isDirectorySync(destination)) {
        console.log('Moving ' + file + ' from ' + location + ' to ' + destination);
        fs.moveSync(location + '/' + file, destination + '/' + file);
    }
};

module.exports = dataProcessor;
