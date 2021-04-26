# sProfile
Try it out [here](https://sprofile.games)

## Introduction

A web-enabled game distribution and player profile management platform.

## Features
1. Manage user account
	* Create a new account
		* Player Registration
		* Game Developer Registration
	* Login
		* Account recovery
2. Customize user player profile
	* Change visibility option
	* Edit player configurations via the website
		* Saving player profiles
		* Loading player profiles
3. View developer documentation
	* Download developer documentation
4. Manage sProfile game Listings
	* Create sProfile game listings
	* Edit sProfile game listings
		* Delete sProfile game listings
5. Download sProfile games
	* View gallery of game listings 
## Getting Started
**To view instrucions on how to build and deploy this web application on a website, look at the [deployment branch](https://github.com/omarnassif98/sProfile/tree/deployment) of this repo.
### Installation and Setup Locally
1. Install [Docker](https://docs.docker.com/get-docker/) if you haven't already.
2. Clone this repository.
		
		> git clone https://github.com/omarnassif98/sProfile/
		> cd sProfile
		
3. Build the docker image.

		> docker build flask -t webapp


### Run the docker image locally
1. Run the image you have just created

		> docker run -it webapp
		
2. Open a browser window and navigate to: [http://localhost:8080](http://localhost:8080)

## Demo video

https://youtu.be/q298ver7uMM

## Contributors

* Omar Abou Nassif Mourad (abounassifmourado@wit.edu), Team Lead
* Christopher Pizani (pizanic@wit.edu), Developer
* Leonard Litvak (litvakl@wit.edu), Developer
