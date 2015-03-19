Pizza Time
=================
An IoT clock that orders pizza. 

Hackathon submission video: https://vimeo.com/119480238

This was created at an intel edison hackathon over the course of 48 hours. Pizza time currently has three apps. 

* The pizza time app which hooks into Domino's api to order cheese or pepperoni pizza from the closest location. 
* A simple clock app.
* A demo app that shows how to construct a simple app for the clock. 

This is currently a work in progress and contributions are strongly encouraged. 

![Pizza Time Clock](https://dl.dropboxusercontent.com/u/1086285/artefact/pizza-time-2.jpg)

Hardware
---------------
Documentation on wiring is in the works. 
 
  - For development purposes Pizza Time uses the Intel Edison with the Arduino breakout board which can be found [on Sparkfun](https://www.sparkfun.com/products/13097). 
  - The rotary encoder that is used for the dial is [this Adafruit rotary encoder](http://www.adafruit.com/products/377)
  - For the led matrix display we used four (4x) [16 x 8 Led Matrix + Backback](http://www.adafruit.com/products/2044) 
  - The case is custom made with a ShopBot and we are planning on uploading the CAD designs for it shortly. 


Intel Edison
---------------

There are plenty of intel edison getting started guides out there so I won't waste time writing another one. Here are some of the most helpful getting started guides that we used: 

- [Sparkfun's Getting Started Guide](https://learn.sparkfun.com/tutorials/edison-getting-started-guide)
- [Intel's Getting Started Guide](https://software.intel.com/en-us/iot/getting-started)

The gist of the process goes like this:

- Download / Install USB Drivers
- Download / Install Intel Edison Arduino IDE
- Download / Install Intel Edison XDK
- Download yocto linux image from Intel
	- Use Disk Utility to reformat the Edison drive - remove all files and reboot
	- Run Arduino blink application
	- Update firmware
	- Setup / connect to wifi

> **NOTE:** 
> 
>- Make sure you are using the correct usb cables - some don't transmit data. 
>- When you have setup your edison and you are able to issue a screen /dev/tty.* 115200 -L successfully make sure you update mraa with the following command from [intel's mraa github repo](https://github.com/intel-iot-devkit/mraa):
	- echo "src mraa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/mraa-upm.conf
	- opkg update
	- opkg install libmraa0


Intel XDK
---------------

I have a bit of a love/hate relationship with Intel's XDK. It has it's quirks and drawbacks but on the whole it works decently well. However I've run into a few issues that I thought should be documented. Once you've set up your Edison (whitelisted your local IP on the Edison, etc) and connected via the XDK and you go to build I've run into a few issues:

- If you get npm install errors using the XDK I've found that ssh-ing onto the Edison, navigating to the node app directory in the root ('/') of the device and doing a manual npm install there worked far more consistently with less errors. 
- If you get the following error:  'Error extracting update - stderr maxBuffer exceeded.' when trying to upload your code make sure that 'Run npm install directly on the IoT device' box is checked in the Edison settings panel right next to the upload button. 
- If your Edison goes into a infinite loop of restarting check to see with a simple df command that there is still free space on the device. If not it could be logs that are taking up all of your space. Navigate to /var/logs/journal and remove the logs there. 


> **NOTE:**   I've made it a habit of using the unix 'df' command to see how much free space is left on the Edison due to logs taking up space. I usually find that is the culprit in > 30% of the issues I've had with the Edison. 



Software
---------------

We're using Node.js with the Edison, because it's javascript and super easy to hack things together. Here are some of the libraries that we are depending on currently:

* [Johnny-five](https://github.com/rwaldron/johnny-five) - Fantastic library and great support. We are currently powering the led matrix with johnny-five through the [Edison-IO](https://github.com/rwaldron/edison-io) plugin. The performance isn't great but it works pretty flawlessly out of the box. 
* [Moment.js](http://momentjs.com/) - Pretty much the de facto js library for anything date/time related. We're currently using this for the clock app. Eventually it would be nice to move to a RTC Module. 
* [Dominos](https://github.com/RIAEvangelist/node-dominos-pizza-api) - A simple, yet brillant node.js wrapper for the Domino's Pizza API. We couldn't have done it without ya. 

This is a work in progress and we will hopefully be making it easier to use and creating more awesome features. It's a bit too soon to layout a roadmap for where this will go but we've already got some ideas for v2. 
