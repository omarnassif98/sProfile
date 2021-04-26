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
**To view instrucions on how to run this web application locally, look at the [master branch](https://github.com/omarnassif98/sProfile) of this repo.
### Installation and Setup for web deployment
1. Install [Docker](https://docs.docker.com/get-docker/)  & [Docker-compose](https://docs.docker.com/compose/install/) if you haven't already.
2. You need to own a domain for this, make sure you have access to its A records.
3. Clone this repository.
		
		> git clone https://github.com/omarnassif98/sProfile/
		> cd sProfile
		
3. Edit init-letsencrypt.sh to reflect your domain and email.

		> nano init-letsencrypt.sh

4. Edit nginx's conf file to reflect your domain

    > nano data/nginx/app.conf

### Configure A records

1. Navigate to the resource records of your domain
2. Set domain's A resource records to the the hosting machine's ip

### Deploy to website
1. Run init-letsencrypt.sh

		> ./init-letsencrypt.sh
		
2. Open a browser window and navigate to: [http://localhost:8080](http://localhost:8080)

## Demo video

https://youtu.be/q298ver7uMM

## Contributors

* Omar Abou Nassif Mourad (abounassifmourado@wit.edu), Team Lead
* Christopher Pizani (pizanic@wit.edu), Developer
* Leonard Litvak (litvakl@wit.edu), Developer
