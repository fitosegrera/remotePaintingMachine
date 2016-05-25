var express = require('express');
var app = express();
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs');

//route to uploaded image
app.use('/uploads', express.static(__dirname + '/uploads'));

//when post received from camera save frame in folder
app.post('/stream', multipartMiddleware, function(req, res) {
    // console.log(req.body, req.files);
    var obj = { data: null, files: null };
    obj.data = req.body;
    obj.files = req.files;
    var pathToDelete = req.files.image.path;
    console.log(req.query['id']);
    //console.log(pathToDelete);

    var streamRoute, imgPath, originalName = "";

    if (req.query['id'] == 'cam1') {
        imgPath = obj.files.image.path;
        streamRoute = "/uploads/" + req.query['id'] + "/";
        originalName = obj.files.image.originalFilename;
    } else if (req.query['id'] == 'cam2') {
        imgPath = obj.files.image.path;
        streamRoute = "/uploads/" + req.query['id'] + "/";
        originalName = obj.files.image.originalFilename;
    } else if (req.query['id'] == 'cam3') {
        imgPath = obj.files.image.path;
        streamRoute = "/uploads/" + req.query['id'] + "/";
        originalName = obj.files.image.originalFilename;
    } else {
        console.log("ERROR: incorrect camera ID.")
    }

    saveStream(imgPath, streamRoute, originalName, pathToDelete, function() {
        res.sendStatus(200);
    });
});

// fs.watch(__dirname + '/uploads', function(event, filename) {
//     console.log('event is: ' + event);
//     if (filename) {
//         console.log('filename provided: ' + filename);
//     } else {
//         console.log('filename not provided');
//     }
// });

app.get('/cam1', function(req, res) {
    var img = fs.readFileSync('./uploads/cam1/cam1.jpg');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});
app.get('/cam2', function(req, res) {
    var img = fs.readFileSync('./uploads/cam2/cam2.jpg');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});
app.get('/cam3', function(req, res) {
    var img = fs.readFileSync('./uploads/cam3/cam3.jpg');
    res.writeHead(200, { 'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

//function to save image in a specific folder of server
function saveStream(imPa, sr, orNa, delPath, callback) {
    fs.readFile(imPa, function(err, data) {
        var newPath = __dirname + sr + orNa;
        fs.writeFile(newPath, data, function(err) {
            if (err) {
                console.log(err);
            } else {
                callback();
                console.log("IMG saved to: " + newPath);
                fs.unlink(delPath, function() {
                    console.log("TMP IMG deleted from: " + delPath);
                });
            }
        });
    });
}

//Start Server
app.listen(3333, function() {
    console.log('listening on port 3333');
});
