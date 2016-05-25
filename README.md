#Remote Painting Machine

##### This project builds up a distributed system which streams live image from 3 cameras in 3 remote locations over the internet. A computer-vision application paints the results using 3 robotic painting machines in a gallery space.

NOTE: Te project has been tested on a raspberry pi B for the camera app, centos OS server (main online bridge server) and ubuntu-gnome 15.10 for the computer vision.

### The System:

There are 3 main software elements in this repository, all the hardware (machine part) is developed separately.

1. Cameras: Each camera is a raspberry pi with a nodejs appication taking still images using the camera module, watching for any new picture taken and posting them to an online server.

2. Server: The server runs online and receives the POST from each raspberry pi. The posts are routed to /uploads and classified based on each's camera id.

3. Remote OpenCV Application: a software (built in openframeworks) running on a PC in the gallery space, calls each camera stream on the online server and processes the images. It searches for moving objects and clasiffies them by size in an attempt to distinguish between cars, bicycles and persons. The contours are sent to the different machines which then draw the result image on a canvas.

### Dependencies:

1. Camera: a raspberry pi with nodejs installed, a camera module and the proper camera libraries.

+ [Raspberry Pi](https://www.raspberrypi.org/)
+ [Raspberry Pi Camera Module](https://www.raspberrypi.org/products/camera-module/)
+ [nodejs](https://nodejs.org/en/)
+ [raspicam library](https://www.raspberrypi.org/wp-content/uploads/2013/07/RaspiCam-Documentation.pdf)

2. Server: nodejs and forever installed.

+ [nodejs](https://nodejs.org/en/)
+ [forever](https://www.npmjs.com/package/forever)

3. Remote openCV application: openframeworks.

+ [openframeworks](http://openframeworks.cc/)

### Installing and Running

Clone the repository on each device (raspberry pi, online server and computer to run openframeworks):
		
		git clone https://github.com/fitosegrera/remotePaintingMachine.git

##### In the raspberry pi --> 

		cd remotePaintingMachine/camera
		sudo npm install

Make sure you first modify app.js to POST images to your own server. Open the app.js file and change the following line (replacing http://192.168.0.102 with your server's address): 

		var url = "http://192.168.0.102:3333/stream?id=" + id;

run app.js forever:

		forever start app.js cam1

Notice: there is an argument to this command: "cam1"... app.js is programmed to receive either cam1, cam2 or cam3 as IDs for each camera.

To have the app.js script executed at boot we have to execute some commands. Run the following replacing the “pi” with your desired runtime user for the node process. If you choose a different user other then yourself, you will have to run this with sudo.
	
		crontab -u pi -e

It will ask you which editor you wish to edit with. Select nano.
Once in the editor add the following line (make sure you add your right path):

		@reboot /usr/bin/sudo -u pi -H /usr/local/bin/forever start /home/pi/remotePaintingMachine/camera/app.js cam1

##### In the Server --> 
	
		cd remotePaintingMachine/server
		sudo npm install

run server.js forever:

		forever start server.js

##### In the computer running openframeworks -->

First you need to move the ipCameraSnapshot to your "openframeworks/app/myApps" folder.

Make sure you have all the addons needed installed:

+ ofxOpenCv

+ ofxSimpleTimer

+ ofxJSON

You can find these in [oF addons page](http://openframeworks.cc/addons)

Configure the app to connect to your server. Open the config.json file located in:
		
		ipCameraSnapshot/bin/data/config.json

it looks like:

		{
			"url" : "http://YOUR.SERVER.URL:3333/uploads/cam1/cam1.jpg",
			"flipped" : false,
			"width" : 640,
			"height" : 480,
			"timer" : 3000
		}

Change "YOUR.SERVER.URL" for either the IP address or DNS of your server, save and close. The key timer is the frequency for the app to call a new frame from the server (it is in milliseconds). Flipped in case you need to mirror the image from the camera VERTICAL/HORIZONTAL (if you do, then set it to true).

Run the app (in linux)

		cd ipCameraSnapshot
		make run

###To be continued...

