var exec = require('child_process').exec;
var needle = require('needle');
var onFileChange = require('on-file-change');

var id = process.argv[2];

if (id == 'cam1' || id == 'cam2' || id == 'cam3'){
	console.log("Streaming with ID: " + id);	
}else{
	console.log("ERROR: incorrect or missing argument. Please use cam1, cam2 or cam3");
	console.log(id);
	process.exit();	
}

var filePath = __dirname + "/frames/" + id  + ".jpg";
var imageData = {
        image: {
                file: filePath,
                content_type: 'image/jpg'
        }
}

var url = "http://localhost:3333/stream?id=" + id;

onFileChange(filePath, function(){
	needle.post(url, imageData, {multipart: true}, function(err, resp, body){
		if(body == undefined){
			console.log("ERROR: calling server... retrying");
		}
		else{
			console.log("image sent: " + body);
		}
	});
});

var command = "raspistill --nopreview -w 600 -h 500 -co 40 " + 
	"-q 5 -o ~/remotePaintingMachine/camera/frames/" + id + ".jpg -tl 100 -t 0 -th 0:0:0"

exec(command, function(error, stdout, stderr) {
	console.log('stdout: ' + stdout);
    	console.log('stderr: ' + stderr);
    	if (error !== null) {
        	console.log('exec error: ' + error);
    	}
});
