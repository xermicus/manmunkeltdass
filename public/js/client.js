var socket = io('http://192.168.43.72:1337');

function newmessage() { 
	var msg = document.getElementById('input').value;
	socket.emit('post', msg);
}

socket.on('emitpost', function(data) {
	var list = document.getElementById('messages');

	var entry = document.createElement('li');
	entry.setAttribute('class','other');
	var div = document.createElement('div');
	div.setAttribute('class','msg');
	var text = document.createTextNode(data);
	div.appendChild(text);
	entry.appendChild(div);
	list.appendChild(entry);
	
	//cleanup
	document.getElementById('input').value = '';
	window.scrollTo(0,document.body.scrollHeight);
});

// Mobile click stuff

/*$(document).keypress(function(e) {
	if(e.which == 13) {
		newmessage();//alert('You pressed enter!');
        }
});*/
