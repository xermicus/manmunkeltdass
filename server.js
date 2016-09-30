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
        // get data
        socket.on('post', function(data) {
                console.log('got post: '+data);
		pk = 0
		r.get('m_index', function(err, reply) {
			if (err) { console.log(err) } else if (reply) {
				pk = reply
                		r.set(pk, data, redis.print);
				r.incr('m_index');
			}
		});
        });

        // send data
        /*var interval = setInterval(function () {
                r.setnx('keyword', 'unset');
		pk = 0
		r.spop(['done'], function(err, reply) { 
			if (err) { console.log(err) } else if (reply) {
			pk = reply;
			r.hgetall(pk.toString(), function(err, reply) {
				if(err) { console.log(err) } else if (reply) {
					socket.emit('get', reply);
				}
			});
			}
		});
		

        }, 3000);*/
}); 
    
// Run the server
http.listen(1337, function(){
        console.log('listening on *:1337');
}); 
