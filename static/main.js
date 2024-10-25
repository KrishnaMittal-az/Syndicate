var socket = io();
var currentRoom = null;

// Function to join a specific room
function joinSpecificRoom(roomName) {
    var username = document.getElementById('username').value;
    if (!username) {
        alert('Please enter a username');
        return;
    }

    if (currentRoom) {
        // Leave the previous room
        socket.emit('leave', { 'username': username, 'room': currentRoom });
    }

    // Join the new room
    socket.emit('join', { 'username': username, 'room': roomName });
    currentRoom = roomName;

    // Update the displayed current room
    document.getElementById('current-room').innerText = `Current Room: ${roomName}`;

    // Clear the chatbox and display new messages for the joined room
    document.getElementById('chatbox').innerHTML = '';

    // Update channel list to show the active channel
    var channels = document.querySelectorAll('.channel');
    channels.forEach(function (channel) {
        channel.classList.remove('active');
        if (channel.textContent === roomName) {
            channel.classList.add('active');
        }
    });
}

// Function to send a message to the current room
function sendMessage() {
    var message = document.getElementById('message').value;
    var username = document.getElementById('username').value;

    if (!currentRoom || !message.trim()) {
        return;
    }

    // Send the message to the current room
    socket.emit('message', { 'username': username, 'message': message, 'room': currentRoom });
    document.getElementById('message').value = ''; // Clear input field
}

// Handle incoming messages and display them in the chatbox
socket.on('message', function (msg) {
    var chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += '<p>' + msg + '</p>'; // Append the message to the chatbox
});
