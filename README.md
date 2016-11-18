# Project setup instructions for Ubunt 14.04

### Step 1: Installing NODE.JS :

Install Nodejs by running the following commands in your terminal

```sh
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install nodejs-legacy
```

Now that nodejs is set up you can open your terminal and type:
```sh
node -v
```
The version number of your nodejs installation should be displayed

In most cases, you'll also want to also install npm, which is the Node.js package manager. You can do this by typing:

```sh
sudo apt-get install npm
```

### Step 2: Installing and Setting Up MongoDB :

MongoDB is a free and open-source NoSQL document database used commonly in modern web applications.

##### First open terminal and execute:

```sh
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
```

After successfully importing the key you will see something like this:

```sh
gpg: Total number processed: 1
gpg:               imported: 1  (RSA: 1)
````


Next, we have to add the MongoDB repository details so APT will know where to download the packages from.

Issue the following command to create a list file for MongoDB.

```sh
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
```

After adding the repository details, we need to update the packages list.

```sh
sudo apt-get update
```

Now we can install the MongoDB package itself.

```sh
sudo apt-get install -y mongodb-org
```

A problem might occur for few users. You might see a message like:

```sh
Reading package lists... Done
Building dependency tree
Reading state information... Done
E: Unable to locate package mongodb-org
```

If this happens run:

```sh
sudo apt-get install -y mongodb
```
For more information, visit [this link](http://stackoverflow.com/questions/28945921/e-unable-to-locate-package-mongodb-org)

Now that MongoDB is set up run the following in the terminal:

```sh
service mongo status
```

You will see something like this

![](mongo.png)

Then run
```sh
mongo
```

The output should be as shown above


### Step 3: Install and Download Robomongo

Robomongo is a software which will help us in interacting with our MongoDB database through a simple GUI

Download Robomongo from [here](https://download.robomongo.org/0.8.5/linux/robomongo-0.8.5-x86_64.deb)

Install this .deb file and run it

You should see a window open as shown under



Click on the **Create** option and save changes as displayed below

_Now we have successfully connected to MongoDB!!_

### Step 4: Setting up the project

**Clone** this project or download the zip from [here](https://github.com/ShaunakSen/node_examples/archive/master.zip)

Extract the folder to any suitable working directory

For purpose of the rest of the article let us assume your project folder is

`/home/node-examples`

Open your terminal in your project directory and then type in the following commands

```sh
cd final-project
sudo npm install
```

In the `final-project` directory there is a file called `package.json`
This file stores the list of dependencies that our web app needs and some other valuable information also.
So when we run `sudo npm install`  **all** dependencies are installed and taken care of

Now run the command
```sh
npm start
```








