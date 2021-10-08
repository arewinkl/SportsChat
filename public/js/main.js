const chatForm = document.getElementById('chat-form')

const socket = io();

//// .on() listens for some kind of event
socket.on('message', message => {
    console.log(message) //this message gets logged on the client side
})

//Message submit

chatForm.addEventListener('submit', e => {
    e.preventDefault();

//// e.target gives you the current element
////this allows you to get the text beng typed
    const msg = e.target.elements.msg.value;

    ////Emit message to the server
    socket.emit('chatMessage', msg);
});