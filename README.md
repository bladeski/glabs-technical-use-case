## Synopsis

This is a solution to a technical use-case set by Glabs.
The challenge is as follows:

### Introduction
Glabs receive a set of files daily from a bank that contain a structured XML schema (example of one is attached). These files are manually read and then hand posted to the core lending platform.

### Task
Create an application that can:

1. Read the directory (does not have to be a local file system, could be an S3 bucket)
2. Parse each XML file in the directory, transforming each one from XML to JSON
3. Store the full JSON document in a database of choice
4. Read each JSON object document extracting all the `<ReturnedDebitItem>` objects and storing into the database
5. Trigger a notification of choice to indicate the files have been successfully parsed and key data extracted
6. Handle the archiving of the processed files (archive folder or another style of activity)
7. (Optional) create a simple UI to read the extracted data (the ReturnedDebitItems)

### Solution
The solution is a basic server-side JS application that monitors a folder in a data directory for files. On every scan it processes documents it finds and saves to a MongoDB database before processing each `ReturnedDebitItem` and saving to the database also. Once this has completed the application emits a Socket.io event to all clients listening on the web server.

There is also a web server running on http://localhost:3000 that lists all `ReturnedDebitItem` objects found in the processed XML files and displays a notification message via a Socket.io client listening to an event triggered from the server.

### Further Work
Further work is required to introduce proper validation and error handling, as well as writing tests to ensure that the code is resilient and not prone to bugs. Additionally there is further work required to style the front-end and options to add SMTP notification on top of the web-socket notifications.   

## Installation

Update the configuration file with MongoDB connection details
NPM install and run npm start
Once started the server will monitor the *src/data/new* directory and process files in here every 30 seconds, as per the task requirements.
Open http://localhost:3000 for viewing Socket.io notifications and the processed ReturnedDebitItems

## License

MIT License

Copyright (c) 2017 Jonathan Blades

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
