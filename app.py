from flask import Flask, render_template, request
from flask_socketio import SocketIO, join_room, leave_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app)

# Route for the main page
@app.route('/')
def index():
    return render_template('index.html')

# Handle a user joining a channel
@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    send(f'{username} has joined the room {room}.', room=room)  # Message only to the room

# Handle a user leaving a channel
@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    send(f'{username} has left the room {room}.', room=room)  # Message only to the room

# Handle message sending within a channel
@socketio.on('message')
def handle_message(data):
    room = data['room']
    message = data['message']
    username = data['username']
    send(f'{username}: {message}', room=room)  # Send the message only to the room

if __name__ == '__main__':
    socketio.run(app, debug=True)
