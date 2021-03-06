const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
//Get username and room from URL
const { username, room } = Qs.parse(location.search,  {
    ignoreQueryPrefix : true
});
console.log(username, room)

const socket = io();


//Join Sports Chatroom
socket.emit('joinRoom', {username, room})

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});
//// .on() listens for some kind of event
//Message from server
socket.on('message', message => {
    console.log(message) //this message gets logged on the client side
    outputMessage(message)

    //Scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight
})

//Message submit

chatForm.addEventListener('submit', e => {
    e.preventDefault();

//// e.target gives you the current element
////this allows you to get the text beng typed
    const msg = e.target.elements.msg.value;

    ////Emit message to the server
    socket.emit('chatMessage', msg);

    //Clear input

    e.target.elements.msg.value= '';
    e.target.elements.msg.focus()
});

////Output message to the DOM

function outputMessage(message) {
    const div = document.createElement('div')
        div.classList.add('message');
        div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
            ${message.text}
        </p>`;

        document.querySelector('.chat-messages').appendChild(div)
}


//Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
};

//Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    })
};


// Prompt the user to make sure that they want to leave the room.

document.getElementById('leave-btn').addEventListener( 'click', () => {
    const leaveRoom = confirm('Are you sure that you want to leave the chat?');
    if (leaveRoom === true) {
        console.log ('leaving')
       
    } else {
       
    }
});

//TODO need to make it so that if the user hits cancel it keeps them on the current chat and doesnt boot them out.