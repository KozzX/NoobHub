var server = require('net').createServer()
var users = {}

server.on('connection', function(user){
	user.setNoDelay(true);
	user.isConnected = true;
	user.connectionId = "id" + user.remoteAddress  + '-' + user.remotePort;
	user.write('{"action":"connect","id":"'+user.connectionId+'"}\n')

	console.log("----------User " + user.connectionId + " connected-----------");

	user.on('data', function (dataRaw){
		var pos = dataRaw.toString().indexOf("}");
		console.log("RAW",dataRaw.toString().slice(0,pos+1));
		var message = JSON.parse(dataRaw.toString().slice(0,pos+1));
		if (message.action == 'MATCHMAKE') {
			console.log("MATCHMAKE");
			user.room = "lobby";
			users[user.room] = users[user.room] || {};
			users[user.room][user.connectionId] = user;
			var lobbyUsers = Object.keys(users[user.room])
			if (lobbyUsers.length >= 2) {
				user.room = "game" + lobbyUsers[0] + lobbyUsers[1];
				users[user.room] = users[user.room] || {};
				users[user.room][lobbyUsers[0]] = users["lobby"][lobbyUsers[0]];
				users[user.room][lobbyUsers[1]] = users["lobby"][lobbyUsers[1]];

				delete users["lobby"][lobbyUsers[0]];
				delete users["lobby"][lobbyUsers[1]];

				users[user.room][lobbyUsers[0]].write('{"action":"gameinit","id":"' + lobbyUsers[0] + '","room":"' + user.room + '"}\n');
				users[user.room][lobbyUsers[1]].write('{"action":"gameinit","id":"' + lobbyUsers[1] + '","room":"' + user.room + '"}\n');

				console.log("Criar Sala",lobbyUsers);				
			};
		};
		if (message.action == 'HIT') {
			console.log("HIT");
			var gameUsers = Object.keys(users[message.room])
			for (var i = 0; i < gameUsers.length; i++) {
				users[message.room][gameUsers[i]].write(dataRaw.toString() + "\n");
			};
		};
		console.log(message);
	})//end of user.on('data')
	user.on('error', function () { return _destroySocket(user) })
	user.on('close', function () { return _destroySocket(user) })
})

var _destroySocket = function (user) {
  if (!user.room || !users[user.room] || !users[user.room][user.connectionId]) return
  users[user.room][user.connectionId].isConnected = false
  users[user.room][user.connectionId].destroy()
  delete users[user.room][user.connectionId]
  console.log(user.connectionId + ' has been disconnected from channel ' + user.room)

  if (Object.keys(users[user.room]).length === 0) {
    delete users[user.room]
    console.log('empty channel wasted')
  }
}

server.on('listening', function() {
	console.log("-------------------------------------------------");
	console.log("-------------------------------------------------");
	console.log("----------Socket Multiplayer Server ON-----------");
	console.log("----------Port: " + server.address().port + "-----------------------------");
	console.log("-------------------------------------------------");
	console.log("-------------------------------------------------");
})
server.listen(1902, '::')


/*user.channel = 'lobby';

for (var i = 0; i < 10; i++) {
	users[user.channel] = users[user.channel] || {}
	users[user.channel][ i ] = "socket"+i;

}

user.channel = 'lobby2';

for (var i = 10; i < 20; i++) {
	users[user.channel] = users[user.channel] || {}
	users[user.channel][ i ] = "socket"+i;

}
	

console.log(users["lobby"][2]);*/