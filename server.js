//This is the backend entry point to all functionality
const path = require('path');
const http = require('http');
const express = require('express');
////socket.io() allows for real time bi directional communication between the client and the server
const socketIo = require('socket.io');
const formatMessage = require('./utils/messages')

const app = express();
////http.createServer method turns your computer into a http server object. Can listen to ports on your computer and execute a function, a requestListener, each time a request is made
const server = http.createServer(app);
const io = socketIo(server);

// Set the static folder so that you can access the frontend
//__dirname= current directory 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'Sport Chat Bot!'
// Run when a client connects
//// .on() listens for some kind of event
io.on('connection', socket => {
    console.log("new Web Socket Connection!")

    ////socket.emit() sends a message to all the connected clients
    //Welcomes current user
    socket.emit('message', formatMessage(botName, 'welcome to the SportsChat'))

    //// this lets all clients except the client connecting that someone has connected
   //Broadcasts when a user connects
    socket.broadcast.emit('message', "A user has joined the chat!")

    //Runs when a client disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat')
    });

    //listen for chatMessage
    socket.on('chatMessage', msg => {
       
        io.emit('message', msg) //this will emit to everyone
    })
});



const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));