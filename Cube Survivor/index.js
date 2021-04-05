var canvas;
var context;
var players = [];
var keydown = [];
var enemies = [];
var startime = new Date();
var timeperspawn = 1000;
var endtime;
var score = 0;
var wave = 1;
var kpwi = 10;
var maxmillispawn = 300;
var boss = false;
var theboss;
var bosshealth = 400;
var p1controls = [100, 104, 102, 101, 37, 38, 39, 40, 96];
var p2controls = [65, 87, 68, 83, 70, 84, 72, 71, 82];
var spcontrols = [37, 38, 39, 40, 65, 87, 68, 83, 69];
var bossbulletdamage = 5;
var p1oricolor = "green";
var p2oricolor = "blue";
var pause = false;
var pausestart = new Date();
var pauseend;

//onload

window.onload = function(){
swr();
}

function swr(){
	document.getElementById("1p").onclick = function(){
	removesetter();
	start(false);
}
document.getElementById("2p").onclick = function(){
	removesetter();
	start(true);
}
document.getElementById("pause").onclick = function(){
	if(pause){
	pause = false;
	document.getElementById("pause").value = "pause";
	}else{
	pause = true;
	document.getElementById("pause").value = "resume";
	}
}
}
function removesetter(){
	document.getElementById("playersel").innerHTML = "";
}

function start(two){
	canvas = document.getElementById("mainCanvas");
	context = canvas.getContext("2d");
	for(var i = 0; i < 256; i++){
		keydown.push(false);
	}
	init(two);
	setInterval(doit, 25);
}
//base Functions

function doit(){
	if(keydown[32]){
		pauseend = new Date();
		if(pauseend - pausestart >= 300){
		if(!pause){
			pause = true;
		}else if(pause){
			pause = false;
		}
		pausestart = new Date();
		}
	}
	if(!pause){
	if(!boss){
	for(var i = 0; i < enemies.length; i++){
		if(enemies[i].alive === false){
			enemies.splice(i, 1);
			score++;
			if(score >= kpwi){
				for(var i = 0; i < players.length; i++){
				wave += 1;
				maxmillispawn -= wave * 5;
				kpwi += 15;
				players[i].tpr -= 15;
				players[i].tps -= 8;
				players[i].health += 100;
				if(wave % 10 === 0){
					enemies = [];
					var randnum = Math.floor(Math.random() * 4);
					var height;
					var width
					if(randnum === Sides.left || randnum === Sides.right){
						height = 500;
						width = 30
					}
					if(randnum === Sides.up || randnum === Sides.down){
						height = 30;
						width = 500;
					}
					boss = true;
					theboss = new Boss(0, 50, 50, 500, 0, bosshealth, 100, 15, bossbulletdamage);
					players[i].bd += 60;
					bosshealth = (Math.floor(bosshealth * 1.5));
					bossbulletdamage = (Math.floor(bossbulletdamage * 1.5));
				}
				}
			}
		}
	}
	}else{
		if(!theboss.enemy.alive){
			for(var i = 0; i < players.length; i++){
			theboss = null;
			boss = false;
			players[i].tpr -= 50;
			if(players[i].tpr < 100){
				players[i].tpr = 100;
			}
			score += 30;
			}
		}
	}
	var arealive = false;
	for(var i = 0; i < players.length; i++){
		if(players[i].alive){
			arealive = true;
		}
	}
	if(arealive){
	endtime = new Date();
	if(!boss){
	if(endtime - startime > timeperspawn){
		enemies.push(new Enemy(Math.floor(Math.random() * 4), 20, 20, 100, 1000, 50));
		startime = new Date();
		timeperspawn -= 50;
		if(timeperspawn < maxmillispawn){
			timeperspawn = maxmillispawn;
		}
	}
	}
	tick();
	render();
	}else{
		document.getElementById("gg").innerHTML = "Game Over - Score:" + (score - 1);
	}
}
}
function addplayers(two){
	if(two){
	players.push(new Player(0, 0, 30, 30, 200, 100, 150, 400, 50, p1controls, 1000, p1oricolor));
	players.push(new Player(0,0,30,30,200,100,150,400,50,p2controls, 1000, p2oricolor));
	}else{
	players.push(new Player(0, 0, 30, 30, 200, 100, 150, 400, 50, spcontrols, 1000, p1oricolor));
	}
}

function init(two){
	addplayers(two);
	document.addEventListener('keydown', e => keydown[e.keyCode] = true);
	document.addEventListener('keyup', e => keydown[e.keyCode] = false);
}

function render(){
	drawRect(0,0,canvas.width, canvas.height, "yellow");
	for(var i = 0; i < players.length; i++){
		if(players[i].alive){
		players[i].render();
		}
	}
	if(!boss){
	for(var i = 0; i < enemies.length; i++){
		enemies[i].render();
	}
	}else{
		theboss.render();
	}
}

function tick(){
	for(var i = 1; i < players.length + 1; i++){
		var string = "" + i;
		document.getElementById("player" + i).innerHTML = "Player " + (i-1) + " - Reloads: " + players[i-1].reloads + " Health:" + players[i-1].health;
	}
	for(var i = 0; i < players.length; i++){
		if(players[i].alive){
		players[i].tick();
		}
	}
	
	document.getElementById("info").innerHTML = "Score: " + score + " - wave: " + wave;
	for(var i = 0; i < players.length; i++){
	if(players[i].tpr < 50){
		players[i].tpr = 50;
	}
	if(players[i].tps < 50){
		players[i].tps = 50;
	}
	}
	if(!boss){
	for(var i = 0; i < enemies.length; i++){
		enemies[i].tick();
	}
	}else{
		theboss.tick();
	}
}

//classes
function Player(x, y, width, height, health, damage, tps, tpr, bd, controls, tpl, oricolor){
	this.health = health;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.alive = true;
	this.color = "blue";
	this.controls = controls;
	this.colorstart = new Date();
	this.colorend;
	this.attack = damage;
	this.bullets = [];
	this.shootstart = new Date();
	this.shootend;
	this.tps = tps;
	this.tpr = tpr;
	this.reloads = 0;
	this.reloadstart = new Date();
	this.reloadend;
	this.bd = bd;
	this.missileloaded = false;
	this.launchstart = new Date();
	this.launchend;
	this.tpl = tpl;
	this.oricolor = oricolor;
	this.up = function(){
		if(this.y >= 0){
		this.y-=3;
		}
	}
	this.down = function(){
		if(this.y + this.height <= canvas.height){
		this.y+=3;
		}
	}
	this.left = function(){
		if(this.x >= 0){
		this.x-=3;
		}
	}
	this.right = function(){
		if(this.x + this.width <= canvas.width){
		this.x+=3;
		}
	}

	this.shoot = function(x, y, width, height, damage, direction){
		this.shootend = new Date();
		this.launchend = new Date();
		if(this.shootend - this.shootstart >= this.tps && this.reloads > 0){
		if(keydown[this.controls[8]] && this.launchend - this.launchstart > this.tpl){
			//if(1 === 1){
		this.bullets.push(new Missile(Team.player, x, y, width, height, bd, direction, width * 2, height * 2, 1000));
		}else{
		this.bullets.push(new Bullet(Team.player, x, y, width, height, bd, direction));
		this.shootstart = new Date();
		this.reloads--;
		}
		}
		
	}

	this.tick = function(){
		this.reloadend = new Date();
		if(this.reloadend - this.reloadstart >= this.tpr){
			this.reloads++;
			this.reloadstart = new Date();
		}
		if(keydown[this.controls[0]]){
			this.left();
		}
		if(keydown[this.controls[1]]){
			this.up();
		}
		if(keydown[this.controls[2]]){
			this.right();
		}
		if(keydown[this.controls[3]]){
			this.down();
		}
		if(keydown[this.controls[4]]){
			this.shoot(this.x, this.y + this.height / 2 - 15 / 2, 15, 15, 50, Sides.left);
		}
		if(keydown[this.controls[5]]){
			this.shoot(this.x + this.width / 2 - 15 / 2, this.y, 15, 15, 50, Sides.up);
		}
		if(keydown[this.controls[6]]){
			this.shoot(this.x + this.width, this.y + this.height / 2 - 15 / 2, 15, 15, 50, Sides.right);
		}
		if(keydown[this.controls[7]]){
			this.shoot(this.x + this.width / 2 - 15 / 2, this.y + this.height, 15, 15, 50, Sides.down);
		}
		for(var i = 0; i < enemies.length; i++){
			var enemy = enemies[i];
			var xin = false;
			var yin = false;
			if(this.x < enemy.x + enemy.width && this.x + this.width > enemy.x + enemy.width){
				xin = true;
			}else if(this.x + this.width > enemy.x&& this.x < enemy.x){
				xin = true;
			}
			if(this.y < enemy.y + enemy.height && this.y + this.height > enemy.y + enemy.height){
				yin = true;
			}else if(this.y + this.height > enemy.y && this.y < enemy.y){
				yin = true;
			}
			this.colorend = new Date();
			if(this.colorend - this.colorstart > 300){
				this.color = this.oricolor;
			}
			if(xin && yin){
				enemy.damage(this);
			}
		}

		for(var i = 0; i < this.bullets.length; i++){
			if(this.bullets[i].intact === false){
				this.bullets.splice(i, 1);
			}
		}
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].tick();
		}
	}
	this.render = function(){
		drawRect(this.x, this.y, this.width, this.height, this.color);
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].render();
		}
	}
}

function Boss(side, width, height, damage, tpd, health, tps, bs, bd){
	this.startshoot = new Date();
	this.tps = tps;
	this.endshoot;
	this.bullets = [];
	this.side = side;
	this.width = width;
	this.height = height;
	this.bd = bd;
	this.damage = damage;
	this.tpd = tpd;
	this.health = health;
	this.bulletsize = bs;
	this.enemy = new Enemy(this.side, this.width, this.height, this.damage, this.tpd, this.health);
	this.startspam = new Date();
	this.endspam;
	this.timeperspam = 3000;
	this.timeofspam = 4000;
	this.startpause = new Date();
	this.endpause;
	this.spam = true;
	// do the spamming using timeperspawn, timeofspam, startpause, endpause, startspam, endspam
	this.damage = function(player){
		enemy.damage(player);
	}

	this.tick = function(){
		if(pause){
			startshoot = new Date();
			startspam = new Date();
			startpause = new Date();
		}
		var enemy = this.enemy; 
		var player;
		this.endspam = new Date();
		if(this.endspam - this.startspam > this.timeofspam && this.spam){
			this.spam = false;
			this.startpause = new Date();
		}
		this.endpause = new Date();
		if(this.endpause - this.startpause > this.timeperspam && !this.spam){
			this.spam = true;
			this.startspam = new Date();
		}
		for(var i = 0; i < players.length; i++){
			if(players[i].alive){
				player = players[i];
			}
		}
		for(var i = 0; i < this.bullets.length; i++){
			if(this.bullets[i].intact === false){
				this.bullets.splice(i, 1);
			}
		}
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].tick();
		}
		if(player.x > enemy.x){
			enemy.x++;
		}else if(player.x < enemy.x){
			enemy.x--;
		}
		if(player.y > enemy.y){
			enemy.y++;
		}else if(player.y < enemy.y){
			enemy.y--;
		}
		
		this.endshoot = new Date();
		if(this.endshoot - this.startshoot >= tps){
			if(this.spam){
			var bullets = this.bullets;
			bullets.push(new Bullet(Team.enemy, enemy.x, enemy.y + Math.floor(Math.random() * enemy.height), bs, bs, this.bd, Sides.left));
			bullets.push(new Bullet(Team.enemy, enemy.x + enemy.width, enemy.y + Math.floor(Math.random() * enemy.height), bs, bs, this.bd, Sides.right));
			bullets.push(new Bullet(Team.enemy, enemy.x + Math.floor(Math.random() * enemy.width), enemy.y, bs, bs, this.bd, Sides.up));
			bullets.push(new Bullet(Team.enemy, enemy.x + Math.floor(Math.random() * enemy.width), enemy.y + enemy.height, bs, bs, this.bd, Sides.down));
			this.startshoot = new Date();
			}
		}
		for(var i = 0; i < players.length; i++){
		var xin = false;
		var byin = false;
		if(enemy.x < players[i].x + players[i].width && enemy.x + enemy.width > players[i].x + players[i].width){
			xin = true;
			}else if(enemy.x + enemy.width > players[i].x && enemy.x < players[i].x){
			xin = true;
			}
			if(enemy.y < players[i].y + players[i].height && enemy.y + enemy.height > players[i].y + players[i].height){
				byin = true;
			}else if(enemy.y + enemy.height > players[i].y && enemy.y < players[i].y){
				byin = true;
			}
			if(xin){
				if(byin){
				players[i].alive = false;
				console.log("xin and yin");
				}
			}
	}
	}

	this.render = function(){
		this.enemy.render();
		for(var i = 0; i < this.bullets.length; i++){
			this.bullets[i].render();
		}
	}
}

function Enemy(side, width, height, damage, tpd, health){
	this.x;
	this.y;
	this.health = health;
	this.side = side;
	this.width = width;
	this.height = height;
	this.direction = 0;
	this.attack = damage;
	this.canDamage = true;
	this.startime = new Date();
	this.endtime;
	this.alive = true;
	this.timeperdamage = tpd;
	if(this.side === Sides.left){
		this.x = 0;
		this.y = Math.floor(Math.random() * (canvas.height - this.height));
		this.direction = Sides.right;
	}else if(this.side === Sides.right){
		this.x = canvas.width;
		this.y = Math.floor(Math.random() * (canvas.height - this.height));
		this.direction = Sides.left;
	}else if(this.side === Sides.up){
		this.y = 0;
		this.x = Math.floor(Math.random() * (canvas.height - this.width));
		this.direction = Sides.down;
	}else if(this.side === Sides.down){
		this.y = canvas.height;
		this.x = Math.floor(Math.random() * (canvas.height - this.width));
		this.direction = Sides.up;
	}

	this.damage = function(player){
		this.endtime = new Date();
		if(this.endtime - this.startime >= this.timeperdamage){
		player.health -= this.attack;
		this.startime = new Date();
		player.color = "purple";
		player.colorstart = new Date();
		if(player.health <= 0){
			player.alive = false;
		}
		}
		this.health -= player.attack;
		if(this.health <= 0){
			this.alive = false;
		}
	}

	this.tick = function(){
		if(this.direction === Sides.left){
			this.x--;
			if(this.x - this.width < 0){
				this.alive = false;
			}
		}else if(this.direction === Sides.right){
			this.x++;
			if(this.x > canvas.width){
				this.alive = false;
			}
		}else if(this.direction === Sides.up){
			this.y--;
			if(this.y + this.height < 0){
				this.alive = false;
			}
		}else if(this.direction === Sides.down){
			this.y++;
			if(this.y > canvas.height){
				this.alive = false;
			}
		}
	}

	this.render = function(){
		drawRect(this.x, this.y, this.width, this.height, "red");
	}
}

function Bullet(team, x, y, width, height, damage, direction){
	this.team = team;
	this.width = width;
	this.height = height;
	this.damage = damage;
	this.intact = true;
	this.direction = direction;
	this.hitstart = new Date();
	this.hitend;
	this.x = x;
	this.y = y;
	this.up = function(){
		this.y -= 4;
	}
	this.down = function(){
		this.y += 4;
	}
	this.left = function(){
		this.x -= 4;
	}
	this.right = function(){
		this.x += 4;
	}
	this.tick = function(){
		if(this.direction === Sides.up){
			this.up();
		}else if(this.direction === Sides.down){
			this.down();
		}else if(this.direction === Sides.left){
			this.left();
		}else if(this.direction === Sides.right){
			this.right();
		}
		if(this.team === Team.enemy){
			for(var i = 0; i < players.length; i++){
			var xin = false;
			var yin = false;
			if(this.x < players[i].x + players[i].width && this.x + this.width > players[i].x){
				xin = true;
			}else if(this.x + this.width > players[i].x && this.x < players[i].x + players[i].width){
				xin = true;
			}
			if(this.y < players[i].y + players[i].height && this.y + this.height > players[i].y){
				yin = true;
			}else if(this.y + this.height > players[i].y && this.y < players[i].y + players[i].height){
				yin = true;
			}
			
			this.hitend = new Date();
				if(this.hitend - this.hitstart > 1000){
					players[i].color = players[i].oricolor;
					this.hitstart = new Date();
				}
			
			if(xin && yin){
				players[i].health -= this.damage;
				if(players[i].health <= 0){
					players[i].alive = false;
				}
				
				players[i].color = "purple";
				this.intact = false;
			}
			}
		}else if(this.team === Team.player){
			if(!boss){
			for(var i = 0; i < enemies.length; i++){
				var xin = false;
				var yin = false;
				var enemy = enemies[i];
				if(this.x < enemy.x + enemy.width && this.x + this.width > enemy.x + enemy.width){
					xin = true;
				}else if(this.x + this.width > enemy.x && this.x < enemy.x){
					xin = true;
				}
				if(this.y < enemy.y + enemy.height && this.y + this.height > enemy.y + enemy.height){
					yin = true;
				}else if(this.y + this.height > enemy.y && this.y < enemy.y){
					yin = true;
				}
				if(xin && yin){
					enemy.health -= this.damage;
					if(enemy.health <= 0){
						enemy.alive = false;
					}
					this.intact = false;
				}
			}
			}else{
				var xin = false;
				var yin = false;
				var enemy = theboss.enemy;
				if(this.x < enemy.x + enemy.width && this.x + this.width > enemy.x){
					xin = true;
				}else if(this.x + this.width > enemy.x && this.x < enemy.x + enemy.width){
					xin = true;
				}
				if(this.y < enemy.y + enemy.height && this.y + this.height > enemy.y){
					yin = true;
				}else if(this.y + this.height > enemy.y && this.y < enemy.y + enemy.height){
					yin = true;
				}
				if(xin && yin){
					enemy.health -= this.damage;
					if(enemy.health <= 0){
						enemy.alive = false;
					}
					this.intact = false;
				}
			}
		}
	}
	 this.render = function(){
		 if(this.team === Team.player){
		 drawRect(this.x, this.y, this.width, this.height, "black");
		 }else if(this.team === Team.enemy){
			drawRect(this.x, this.y, this.width, this.height, "brown");
		 }
	 }
}

//work in progress
function Missile(team, x, y, width, height, damage, direction, ewidth, eheight, explotime){
	this.bullet = new Bullet(team, x, y, width, height, damage, direction);
	this.intact = false;
	this.render = function(){
		drawRect(this.bullet.x, this.bullet.y, this.bullet.width, this.bullet.height, "lightblue");
	}
	this.startexplo = new Date();
	this.explotime = explotime;
	this.endexplo;
	this.exploding = false;
	this.tick = function(){
		if(!this.exploding){
		this.bullet.tick();
		}
		if(!this.bullet.intact || this.exploding){
			this.endexplo = new Date();
			if(this.endexplo - this.startexplo > this.explotime){
				this.intact = false;
			}else{
				this.bullet.width = ewidth;
				this.bullet.height = eheight;
			}
			this.bullet.intact = true;
			this.exploding = true;
		}
	}
}

//objects
var Sides = {
	left: 0,
	right: 1,
	up: 2,
	down: 3
};

var Team = {
	enemy: 0,
	player: 1
}

//graphics function
function drawRect(x, y, width, height, color){
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}