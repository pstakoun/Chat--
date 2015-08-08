var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
    res.sendFile('index.html');
});

var port = 80;
http.listen(port, function() {
    console.log('Server running on port ' + port);
});

var idIndex = 0;

io.on('connection', function(socket)
{
    var id = idIndex++;
    var name = "";
    var address = socket.handshake.address;

    console.log('Client on ' + address + ' connected, assigned ID ' + id);
    io.emit('clientConnect', { id: id, name: name });

    socket.on('name', function(str) {
        name = str.trim();
        console.log('Client with ID ' + id + ' changed display name to: ' + name);
        io.emit('nameChange', { id: id, name: name });
    });

    socket.on('message', function(msg) {
        console.log('Client with ID ' + id + ' sent chat message: ', msg);
        io.emit('message', { id: id, name: name, msg: msg });
    });

    socket.on('disconnect', function() {
        console.log('Client on ' + address + ' with ID ' + id + ' disconnected');
        io.emit('clientDisconnect', { id: id, name: name});
    });
});
