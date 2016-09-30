var socket = io('http://localhost:1337');

function newmessage() { 
	var msg = document.getElementById('input').value;
	socket.emit('post', msg);
}
