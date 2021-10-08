const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');

const socket = io();

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
        div.innerHTML = `<p class="meta">Brad <span>10:00 am</span></p>
        <p class="text">
            ${message}
        </p>`;

        document.querySelector('.chat-messages').appendChild(div)
}