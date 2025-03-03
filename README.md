# ToDo App
A personal task management application built with React, MongoDB, and Electron.

![Task Management](https://shields.io/badge/Task%20Management-Electron-blue)
![React](https://img.shields.io/badge/React-v18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## Overview
This is a desktop task management application that allows you to create, organize, and track tasks based on different categories (Personal, Work, School, Research, Health, and Other). The application keeps your tasks synchronized across multiple devices by connecting to a MongoDB cluster.

## Features
- ✅ Create, edit, and delete tasks
- 📊 Organize tasks by type (Personal, Work, School, Research, Health, Other)
- 📱 Cross-device synchronization via MongoDB
- 🖥️ Desktop application with Electron
- 📋 Rich text descriptions
- 🔄 Real-time database connection status

## Screenshots
![image](https://github.com/user-attachments/assets/b8293087-336b-4ba7-af99-721edd0f9cd3)


## Technologies Used
- **Frontend**: React.js for the user interface
- **Backend**: Node.js/Express for the server
- **Database**: MongoDB for data storage
- **Desktop Integration**: Electron to package as a desktop application
- **API Communication**: Axios for HTTP requests
- **Build Tool**: Electron-builder for packaging

## Installation

### Clone the repository
```bash
  git clone https://github.com/yourusername/todo-list.git
  cd todo-list
```
### Install dependencies
```bash
npm install
```
### Package the application
```bash
npm run electron-pack
```
Run the installer from the dist directory

## Setup
- When you first launch the application, you'll be prompted to enter your MongoDB connection URI.
- The application requires an internet connection to sync with the MongoDB cluster.
- Once connected, you can immediately begin creating and managing tasks.
- Your tasks will synchronize across all devices using the same MongoDB connection.
### Development
To run the application in development mode:
```bash
npm run electron-dev
```
## Future Improvements
- Task priority levels
- Due dates and reminders
- Offline mode with local database sync
- Task sharing capabilities
- Dark/light theme options
## License
This project is licensed under the MIT License - see the LICENSE file for details.
