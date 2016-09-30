var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// redis stuff
var redis = require("redis")
var r= redis.createClient(6379,'127.0.0.1');
r.auth('foo');
r.on("error", function (err) {
    console.log("Redis Error: " + err);
});
r.setnx('m_index', 0);

// Basic routing
app.get('/', function(req, res){
        res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

// socket.io
io.on('connection', function(socket) {
        console.log('Client connected...');
	
	// spread messages after connect
	r.setnx('m_index', 0);
	r.get('m_index', function(err, reply) {
	                if (err) { console.log(err) } else if (reply) {
			pk = parseInt(reply);
			for (i = 0; i < pk; i++) {
				r.get(i.toString(), function(err, reply) {
	                        if (err) { console.log(err) } else if (reply) {
                                	socket.emit('emitpost', reply);
                        	}
                		});

			}
		}
	});
        
	// get data
        socket.on('post', function(data) {
                console.log('got post: '+data.length);
		pk = 0
		r.setnx('m_index', 0);
		r.get('m_index', function(err, reply) {
			if (err) { console.log(err) } else if (reply && data.length > 0 && data.length < 512) {
				pk = reply
                		r.set(pk, data, redis.print);
				r.incr('m_index');
				io.sockets.emit('emitpost', data);
			}
		});
        });

}); 
    
// Run the server
http.listen(1337, function(){
        console.log('listening on *:1337');
}); 
