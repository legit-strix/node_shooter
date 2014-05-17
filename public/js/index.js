var socket = io.connect('http://192.168.2.113:8080'); // subject to change
			// socket.emit('course_list', ['12345678'])
            socket.on('welcome', function(data) {
                $('#messages').append('<li>' + data.message + '</li>');
					  
				socket.on('seats available', function(data){
					$('span').text(data)
				})
				$('#add-class').click(function(){
					socket.emit('add class', "12345678")
				})
				socket.on('update_seats', function(data){
					$('span').text(data)
				})
				
				$('#text-button').click(function(){
					var value = $( '#text-box' ).val()
					// console.log(value)
		        	socket.emit('input',value)
				})
		            $( "#text-box" ).keypress(function(e) {
					    // var value = $( this ).val();
					    var value = String.fromCharCode(e.which);
					    // $( "#message-list" ).text( value );
					    // console.log(e.keyCode)
					    if(e.keyCode == 13){
					        $("#text-button").click();
					        $( "#text-box" ).val('')
					        socket.emit('input', '')
					    }
					    else{
					    	socket.emit('input',value);
					    }
					  })
				
				
                socket.emit('i am client', {data: 'foo!'});
            });
            socket.on('time', function(data) {
                console.log(data);
                $('#messages').append('<li>' + data.time + '</li>');
                socket.emit('check it out', {my:'data'})
            });
            socket.on('hello', function(data){
            	if(data.hello.length==1){
                	$('#message-list').append(' '+ data.hello)
                }
                else{
                	$('#message-list').html('Messages: ')
                }
			})
            socket.on('chat', function(data){
            	// console.log(typeof data.world)
            	// console.log(data.world.length)
            	if(data.world.length>1){
                	$('#message-words').html('Words: '+ data.world)
                }
            })
            
            socket.on('error', function() { console.error(arguments) });
            socket.on('message', function() { console.log(arguments) });