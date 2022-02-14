## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Documentation](#documentation)
* [API references](#api-references)
* [Setup](#setup)
* [Deployment](#deployment)

## General info
This project was made according to the Design of Dynamic WebSites courses dispensed at Luleå University of Technology.

    ├─ api/             API routing (see api/README.md)
    ├─ doc/             Documentation (see doc/README.md)
    ├─ partials/        EJS reusable parts
    ├─ src/             Application source code
    │  ├─ class/        Classes objects
    │  ├─ database/     Database interface
    │  ├─ models/       Data generation
    │  ├─ services/     Services code
    │  └─ vendor/       Utils
    ├─ public/          Publicly accessible ressources
    ├─ views/           EJS views
    ├─ server.js        Entry point
    └─ app.js           Router

## Technologies
Project is created with:
* Node.js: v16.13
* MySQL: v5.7

## Documentation
See this [folder](https://github.com/nbouvier/DDWS-Lab/tree/main/doc) in order to get documentation about :
* System sketch
* System architecture
* Services specifications
* Mockups

## API references
You will find all the API references under the [API folder](https://github.com/nbouvier/DDWS-Lab/tree/main/api).

## Setup
To run this project, install it locally using npm:

```
$ npm install
```

Set up the database using the sql.sql file and configure environment variables by copying .env.example into .env and modifying necessary variables.

Then start the server:

```
$ node server
```

You can also use nohup if you want to be able to close your SSH terminal:

```
$ nohup node server &
```

Now you can go on at http://localhost:3000/ (or any other URL depending on your configuration).

## Deployment
Following is a step by step tutorial to set up this system on a clean Linux machine.
Here I'll be using a Ubuntu 20.04 LTS.

First, install all the mysql-5.7 packages. This step is well explain in this tutorial 
https://computingforgeeks.com/how-to-install-mysql-on-ubuntu-focal/

Then you will need to install both node and npm.
To do so, simply use the following commands:

```
sudo apt update
sudo apt install -y curl
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt install -y nodejs

sudo apt install npm
```

You can check your installation by cheking the version of both of this softwares:

```
node --version
npm --version
```

Next you will have to install git:

```
sudo apt install git
git --version
```

Now, let's configure the .env file:

```
scopy .env.example .env
vi .env
<configure_each_entry>
```

Here comes the final step, loading the database:

```
mysql -u root -p
<enter_your_password>

source /<project_folder>/sql.sql
```

To verify that everything went well:

```
SHOW DATABASES;
use ddws;
SHOW TABLES;
exit
```

/!\ Creating a dedicated user for accessing this specific database would of course be a good security practice.

Now you are ready to go !
Just launch the project following the [Setup](#setup) part !
