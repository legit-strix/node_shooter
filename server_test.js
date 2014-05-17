// var http = require('http'),
//     fs = require('fs')
    // NEVER use a Sync function except at start-up!
    // index = fs.readFileSync(__dirname + '/index.html');//fs.readFileSync('/Users/branceboren/workspace/node_shooter/index.html')
    // console.log(__dirname)

// Send index.html to all requests
// Check this link out for weird express 2.x to 3.x migration: https://github.com/visionmedia/express/wiki/Migrating-from-2.x-to-3.x
var express = require('express')
var http = require('http')
var app = express()
app.use(express.static(__dirname+'/public'))
var server = http.createServer(app)
// Socket.io server listens to our app
var io = require('socket.io').listen(server);

app.get('/', function(req, res){
    res.sendfile(__dirname+'/index.html')
    // res.sendfile(__dirname+'/js/index.js')
})

var classes = [{section_id:"12345678", crn: "12345", termcode: "6789", seats_available:30}, {section_id:"23456789",crn: "4444", termcode: "5555", seats_available:9}]
// Send current time to all connected clients
function sendTime() {
    io.sockets.emit('time', { time: new Date().toJSON() });
}
function sendMessage(mes){
	io.sockets.emit('new_mes', {new_mes: mes})	
}

setInterval(sendTime, 100000);

var clients= {}

// Emit welcome message on connection
io.sockets.on('connection', function(socket) {
	console.log("totes working")
	clients=io.sockets.clients()// how to get all clients
    socket.emit('welcome', { message: 'Welcome!' });
    clients.forEach(function(socket){
    	console.log(socket.id)
    })
    // socket.on('course_list', function(courses){
    	// for(var i in classes){
    		// for(var j in courses){
    			// if(classes[i][section_id]==courses[j]){
    				// console.log("same")
    			// }
    		// }
    	// }
    // })
    socket.emit('seats available', classes[0].seats_available)

    // socket.on('i am client', console.log);
    // socket.on('check it out', console.log);
    // socket.on('time', console.log)
    socket.on('input', function(data){
    	// console.log(data)
		io.sockets.emit('hello', {hello: data})
		io.sockets.emit('chat', {world: data}) // send to all clients
		// socket.broadcast.emit('world', {world: data}) // send to all but sender
    })

    socket.on('add class',function(section_id){
    	for(var i=0; i<classes.length; i++){
    		if(classes[i].section_id==section_id){
    			classes[i].seats_available--
    			io.sockets.emit('update_seats', classes[i].seats_available)
    		}
    	}
    })
});
server.listen(8080);