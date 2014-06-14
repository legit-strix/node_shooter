window.onload = function(){
	window.requestAnimFrame = (function(){
		return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     ||  
			function( callback ){
				return window.setTimeout(callback, 1000 / 60);
			};
	})();

	window.cancelRequestAnimFrame = ( function() {
		return window.cancelAnimationFrame          ||
			window.webkitCancelRequestAnimationFrame    ||
			window.mozCancelRequestAnimationFrame       ||
			window.oCancelRequestAnimationFrame     ||
			window.msCancelRequestAnimationFrame        ||
			clearTimeout
	} )();

	var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
		W = window.innerWidth,
		H = window.innerHeight,
		bullets = [],
		players = [],
		aim = {},
		points = 0,
		fps = 60,
		init,
		allowed = [65, 87, 68, 83],
		map = [],
		ma = 5,
		collision;
		// declare any other variables here

	canvas.addEventListener("mousemove", trackPosition, true)
	canvas.addEventListener("mousedown", clicked, true)
	window.addEventListener("keydown", keyed, true)
	window.addEventListener("keyup", keyed, true)

	canvas.width = W;
	canvas.height = H;

	function paintCanvas(){
		ctx.fillStyle = "white"
		ctx.fillRect = (0,0,W,H)
	}

	function Player(x, y, r, c){
		this.x = x
		this.y = y
		this.r = r
		this.c = "black"
		this.v = 5
	}
	Player.prototype.draw = function(){
		ctx.beginPath()
		ctx.fillStyle = this.c
		ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false)
		ctx.fill()
	}
	Player.prototype.shoot = function(bx, by){
		console.log("X: "+bx)
		console.log("Y: "+by)
		var bull = new Bullet(this.x, this.y, bx, by, "black", 20, 20)
		bullets.push(bull)
		console.log(bullets)
	}
	var me = new Player(100, 100, 20, "black")
	var zombie = new Player(200, 200, 20, "blue")
	players.push(me)
	players.push(zombie)

	function Bullet(ox, oy, tx, ty, c, vx, vy){ // add owner property
		this.x = ox
		this.y = oy
		this.tx = tx
		this.ty = ty
		this.h = 2
		this.w = 15
		this.c = c
		this.vx = vx
		this.vy = vy
	}
	Bullet.prototype.draw = function(){
		
		var dirX = this.tx - this.x
		var dirY = this.ty - this.y
		var dirLen = Math.sqrt(dirX * dirX + dirY * dirY)
		
		dirX = dirX/dirLen
		dirY = dirY/dirLen
		var lineX = dirX*50
		var lineY = dirY*50
		ctx.beginPath();
		ctx.moveTo(this.x+lineX, this.y+lineY)
		ctx.lineTo(this.x,this.y)
		ctx.stroke()
		// ctx.fillStyle = this.c
		// console.log(this.x)
		// ctx.fillRect(this.x, this.y, this.w, this.h)
	}

	function Aimer(x, y, r){
		this.x = x
		this.y = y
		this.r = r
		this.c = "red"
		this.draw = function(){
			ctx.beginPath()
			ctx.fillStyle = this.c
			ctx.arc(this.x, this.y, this.r, 0, Math.PI*2, false)
			ctx.fill()
		}
	}
	aim = new Aimer(0,0,5)
	function draw(){
		ctx.save()
		ctx.clearRect(0, 0, W, H);
		paintCanvas()
		// me.draw()
		for(var i=0; i<players.length; i++){
			players[i].draw()
		}
		if(aim.x && aim.y){
			aim.draw()
		}
		update()
		ctx.restore()
	}

	function trackPosition(e) {
		aim.x = e.pageX
		aim.y = e.pageY
	}

	function update(){
		
		/* // testing bullet draw
		var tlX = 100 - 50
		var tlY = 100 - 50
		var tdirLen = Math.sqrt(tlX * tlX + tlY * tlY)
		tlX = tlX/tdirLen
		tlY = tlY/tdirLen
		var tlineX = tlX*50
		var tlineY = tlY*50
		ctx.beginPath();
		ctx.moveTo(50+tlineX, 50+tlineY)
		ctx.lineTo(50,50)
		ctx.stroke()
		*/
		
		if(bullets.length>0){
			for(var i=0;i<bullets.length;i++){ // combine this and draw maybe it's pretty much the same thing
				b = bullets[i]
				var test_dirY = b.ty - b.y
				var test_dirX = b.tx - b.x 
				var test_dirLen = Math.sqrt(test_dirX * test_dirX + test_dirY * test_dirY) // distance between points aka hypotenuse
				b.x = b.x+((test_dirX/test_dirLen)*b.vx)
				b.y = b.y+((test_dirY/test_dirLen)*b.vy)
				b.tx = b.tx+((test_dirX/test_dirLen)*b.vx)
				b.ty = b.ty+((test_dirY/test_dirLen)*b.vy)
				b.draw()
				for(var j=0;j<players.length;j++){
					p = players[j]
					if(b.x>=p.x-p.r && b.x<=p.x+p.r && b.y>=p.y-p.r && b.y<=p.y+p.r){
						console.log("I've been shot!!!")
					}
				}
				if(b.x>=W || b.x<=0 || b.y>=H || b.y<=0){
					bullets.splice(i,1)
				}
			}
		}
		// check for any collisions
		
		
		if(map[87] && map[68]){ // up right
			me.y-=me.v
			me.x+=me.v
		} else if(map[87] && map[65]){ // up left
			me.y-=me.v
			me.x-=me.v
		} else if(map[83] && map[68]){ // down right
			me.y+=me.v
			me.x+=me.v
		} else if(map[83] && map[65]){ // down left
			me.y+=me.v
			me.x-=me.v
		} else if(map[87]){ // up
			me.y-=me.v
		} else if(map[83]){ // down
			me.y+=me.v
		} else if(map[68]){ // right
			me.x+=me.v
		} else if(map[65]){ // left
			me.x-=me.v
		}

		// else{
		// 	switch(e.keyCode){
		// 		case 87: me.y-=me.v // up
		// 		break
		// 		case 83: me.y+=me.v // down
		// 		break
		// 		case 68: me.x+=me.v // right
		// 		break
		// 		case 65: me.x-=me.v // left
		// 		default:
		// 	}
		// }

	}

	function collides(p, b){
		// if(p.x + )
	}

	function clicked(e){
		var mx = e.pageX,
			my = e.pageY;
		me.shoot(mx, my)
	}
	
	function keyed(e){
		if(allowed.indexOf(e.keyCode)!== -1){
			map[e.keyCode] = e.type =='keydown'
		}
	}

	function animLoop(){
		init = requestAnimFrame(animLoop)
		draw()
	}
	animLoop()
}

