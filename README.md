# ToDo App

This project was created using React, MongoDB, Electron, and Axios

## Overview
One of my first projects involving MERN, with a little bit of a twist, I decided to help myself by making a todo list where I can list my tasks and organize them based on types
[ Personal, Work, School, Etc.]

A MongoDB cluster is used to hold task metadata, although a simpler database like SQLite could have been used, I wanted to expose myself to MongoDB. 
Electron is used to make a desktop application out of the program. When first installed, the user is prompted to enter their MongoDB cluster URI, to connect them to the database. (Yep, this isn't the best, security wise, but it's for personal use)

This way, I can have multiple instances of this app (Personal Computer, Laptop) and be able to CRUD my tasks since they are connected to the same DB cluster.

## To Start

Clone the repo, make sure all dependencies are installed. 
Run the command, `npm run electron-pack` 

A `dist` directory will be made, where there will be a `...Setup` executable.
Open the executable, and the app will open, along with a desktop icon. 

Enter MongoDB URI, and with an internet connection, you should be good to go!

