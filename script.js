var canvas = document.getElementById('renderCanvas');
var rawData = document.getElementById('rawData');
var colors = {
	x: 'rgba(0,0,0,0)',
	a: '#225378',
	b: '#1595A3',
	c: '#ACF0F2',
	d: '#F2FFE3',
	e: '#EB7F00',
	heat: 'red'
};
var defaultFont = 'Consolas';
var ctx = canvas.getContext('2d');
var weighting = true;

var fps = 0;
// Parameters
var Grid = {x: 24, y:12 , scale: 6};
// Entities on the board
var Entities = [];

var Game = {
	init: function () {
		// set canvas size according to grid size ans scale
		canvas.width = (Grid.x * 10 * Grid.scale) + Grid.scale;
		canvas.height = (Grid.y * Grid.scale * 10) + Grid.scale;
	},
	background: function() {
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,canvas.width,canvas.height);
		ctx.fillStyle = 'gray';
		// gridlines - verticle lines
		for(i = 0; i < canvas.width; i = i + (Grid.scale*10)){
			ctx.fillRect(i, 0, Grid.scale, canvas.height);	
		}
		// gridlines - horizontal lines
		for(i = 0; i < canvas.height; i = i + (Grid.scale*10)){
			ctx.fillRect(0, i, canvas.width, Grid.scale);
		}
	},
	draw: function () {
		requestAnimationFrame(Game.draw);
		Game.update();	
		Game.background();
		for (var i = Entities.length - 1; i >= 0; i--) {
			Entities[i].draw();
		};
	},
	// run updates on value changes etc. 
	update: function () {
		for (var i = Entities.length - 1; i >= 0; i--) {
			Entities[i].update();
		};
	},
	Entity: function (xInput,yInput,weightInput,idInput) {
		var width = canvas.width;
		var height = canvas.height;
		this.weight = weightInput;
		this.id = idInput;
		this.size = (canvas.width - ((Grid.x + 1) * Grid.scale)) / Grid.x;
		this.p = {x: xInput, y: yInput};
		this.x = Grid.scale + (this.size + Grid.scale) * this.p.x;
		this.y = height - this.size - Grid.scale - (this.size * this.p.y) - (Grid.scale * this.p.y);
		
		var innerSize = this.size * 0.75;
		var innerColour = 'pink';
		this.color = 'rgba(255, 000, 000,' + this.weight + ')';
		innerColour = colors[idInput];
	
		this.update = function () {
			this.x = Grid.scale + (this.size + Grid.scale) * this.p.x;
			this.y = height - this.size - Grid.scale - (this.size * this.p.y) - (Grid.scale * this.p.y);
			this.color = 'rgba(255, 000, 000,' + this.weight + ')';
		}

		this.draw = function(){
			//background
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.size, this.size);
			// inner box
			ctx.fillStyle = innerColour;
			// determine image use or not
			if(idInput == 'p'){
				xx = this.x + (this.size * 0.25)/2;
				yy = this.y + (this.size *0.25)/2;
				ctx.drawImage(img,xx,yy,innerSize,innerSize);
			} else {
				// default square
				ctx.fillRect(this.x + (this.size * 0.25)/2, this.y + (this.size *0.25)/2, innerSize, innerSize);
			}	

			if(weighting){
				// weighting value background
				ctx.fillStyle = 'white';
				ctx.fillRect(this.x + (this.size * 0.58), this.y + (this.size *0.14)/1.5, innerSize /2.2,innerSize /4);
				// weighting text
				ctx.fillStyle = 'black';
				ctx.font = innerSize /4 + "px " + defaultFont;
				ctx.fillText(weightInput,this.x + (this.size * 0.6), this.y + (this.size *0.25));
			}
		}
	},
	clear: function(){
		//Game.draw();
		Entities = [];
	},
	toggleWeighting: function(){
		if(weighting) weighting = false;
		else weighting = true;
	}
};

// Snake data to be rendered.
var parseRawData = function(){
	Game.clear();
	var data = rawData.value.split(";");
	for (var i = data.length - 1; i >= 0; i--) {
		var x = parseInt(data[i].substr(0,2));
		var y = parseInt(data[i].substr(2,2));
		var weight = parseFloat(data[i].substr(4,1) + "." + data[i].substr(5,1))
		var id = data[i].substr(6,1);
		console.log("x: " + x + " y: " + y + " weight: " + weight + " id: " + id);
		var block = new Game.Entity(x,y,weight,id);
		Entities.push(block);
	};
}

Game.init();

// Listening for keyboard events.
document.addEventListener("keydown",function(event) {
	if(event.keyCode == 40){
		console.log("TESt");
		Entities[0].p.y = Entities[0].p.y - 1;
		//Entities[0].update();
	} else if(event.keyCode == 38){
		Entities[0].p.y = Entities[0].p.y + 1;
		//Entities[0].update();
	} else if(event.keyCode == 39){
		Entities[0].p.x++;
		//Entities[0].update();
	} else if(event.keyCode == 37){
		Entities[0].p.x--;
		//Entities[0].update();
	} else if(event.keyCode == 32){
		Entities.push(new Game.Entity(Entities[0].p.x,Entities[0].p.y,0,'a'));
	} else if(event.keyCode == 109){
		Entities[0].weightInput+= -0.1;
	}
}, false);

Game.draw();