var server = require('net').createServer()
var sockets = {}
var users = {}
var rooms = {}
server.on('connection', function (socket) {
 	socket.setNoDelay(true)
 	//socket.setKeepAlive(true, 300 * 1000)
 	socket.isConnected = true
 	socket.connectionId = "id" + socket.remoteAddress + '-' + socket.remotePort // unique, used to trim out from sockets hashmap when closing socket


 	console.log('New client: ' + socket.localAddress + ":" + socket.remoteAddress + ':' + socket.remotePort)
    sockets[socket.channel] = sockets[socket.channel] || {} // hashmap of sockets  subscribed to the same channel
    sockets[socket.channel][ socket.connectionId ] = socket

    users = Object.keys(sockets[socket.channel])
    console.log(users.length)
    console.log(users)

 	socket.on('data', function (dataRaw) { // dataRaw is an instance of Buffer as well
 		var subscribers = Object.keys(sockets[socket.channel])
		console.log(dataRaw.toString());
		for (var i = 0, l = subscribers.length; i < l; i++) {
			//sockets[ users[i] ].write(dataRaw.toString() + "\n")
			sockets[socket.channel][ subscribers[i] ].isConnected && sockets[socket.channel][ subscribers[i] ].write(dataRaw.toString() + "\n")
		}
	})
	socket.on('error', function () { 
		console.log("Error");
		delete sockets[socket.channel][socket.connectionId]
		users = Object.keys(sockets[socket.channel])
		console.log(users.length)
		//return _destroySocket(socket) 
	})
  	socket.on('close', function () { 
  		console.log("close")
  		delete sockets[socket.channel][socket.connectionId]
  		users = Object.keys(sockets[socket.channel])
  		console.log(users.length)
  		//return _destroySocket(socket) 
  	})
})

server.on('listening', function () { 
	console.log('Socket server ' + server.address().address + ':' + server.address().port) 
})
server.listen(1337, '::')


function myFunc(arg) {
	console.log(`arg was => ${arg}`);
	for(var i = 0, l = users.length; i < l; i++){
		sockets[ users[i] ].write("teste\n")	
	}
	setTimeout(myFunc, 1500, 'funky');
	
}

//setTimeout(myFunc, 1500, 'funky');