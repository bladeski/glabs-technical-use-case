var fs = require('fs-plus'),
    xmlParser = require('fast-xml-parser'),
    jsonFind = require('json-find');

var CONFIG = require('../config/config');

var dbInterface = require('./dbInterface');

var dataProcessor = {};

dataProcessor.fileList = [];

// Monitor the chosen directory for files and add to the database
dataProcessor.monitor = function (dataDirectory) {

    var fileLocation = dataDirectory + '/new';
    fs.readdir(fileLocation, function (err, items) {

        if (err) {
            console.log("Error accessing data directory. Error:");
            console.log(err);
            return;
        }

        items.forEach(function (item) {

            console.log(item);
            dataProcessor.fileList.push(item);

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

// Process the xml files
processFile = function (file) {

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

// Move files
moveFile = function (file, location, destination) {

    if (fs.isFileSync(location + '/' + file) && fs.isDirectorySync(destination)) {
        console.log('Moving ' + file + ' from ' + location + ' to ' + destination);
        fs.moveSync(location + '/' + file, destination + '/' + file);
    }
};

module.exports = dataProcessor;
