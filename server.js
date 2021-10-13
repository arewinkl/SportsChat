//This is the backend entry point to all functionality
const path = require('path');
const http = require('http');
const express = require('express');
////socket.io() allows for real time bi directional communication between the client and the server
const socketIo = require('socket.io');
const formatMessage = require('./utils/messages');
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require('./utils/users');

const app = express();
////http.createServer method turns your computer into a http server object. Can listen to ports on your computer and execute a function, a requestListener, each time a request is made
const server = http.createServer(app);
const io = socketIo(server);



// Set the static folder so that you can access the frontend
//__dirname= current directory 
app.use(express.static(path.join(__dirname, 'public')));

const botName = 'SportChat Bot!'


// Run when a client connects
//// .on() listens for some kind of event
io.on('connection', socket => {
    console.log("new Web Socket Connection!")
    socket.on('joinRoom', ({ username, room}) => {
       const user = userJoin(socket.id, username, room);

        socket.join(user.room);

    //Welcomes current user
      ////socket.emit() sends a message to all the connected clients
    socket.emit('message', formatMessage(botName, 'welcome to the SportsChat'))

    //// this lets all clients except the client connecting that someone has connected
   //Broadcasts when a user connects, This allows you to emit to a specific room 
    socket.broadcast.to(user.room).emit('message',formatMessage(botName, `${user.username} has joined the chat!`))
    

    //Send users and room info
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
    });
});

    //listen for chatMessage
    socket.on('chatMessage', msg => {
       const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username, msg)) //this will emit to everyone
    });

    //Runs when a client disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);

        if (user) {
        io.to(user.room).emit('message',formatMessage(botName, `${user.username} has left the chat`));
            //Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
        }
    });
});



const PORT = 3000 || process.env.PORT
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));