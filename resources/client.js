/*** Components ***/

// Physics

function Physics(x, y) {
	this.x = 0;
	this.y = 0;
}

// Sprite

function Sprite(url, w, h) {
	this.data = new Image();
	this.data.src = url;
	this.canvas = document.createElement("canvas");
	this.canvas.width = 1;
	this.canvas.height = 1;
	this.w = w;
	this.h = h;
	this.globalCompositeOperation = "source-in";
	this.ctx = this.canvas.getContext("2d");
	var c = this.ctx;
	this.data.onload = function() {
		c.canvas.width  = w || this.width;
		c.canvas.height = h || this.height;
		c.drawImage(this, 0, 0, w || this.width, h || this.height);
		c.globalCompositeOperation = "source-atop";
		c.save();
	};
}

Sprite.prototype.setColor = function (r,g,b,a) {
	this.ctx.restore();
	this.ctx.save();
	this.ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a + ")";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};

Sprite.prototype.draw = function (l, x, y) {l.drawImage(this.canvas, x, y);};

/* Systems */

function PhysicSystem() {}
function SpriteSystem() {}

/* Initalization and Main */

function initLayer(id) {
	var canvas = document.getElementById(id);
	if (!canvas) {
		console.warn("No layer with id: `" + id + "` found.");
	} else {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		var cx = canvas.getContext("2d");
		cx.clear = function() {this.clearRect(0,0,window.innerWidth, window.innerHeight)};
		return cx;
	}
}

var sprite = new Sprite("resources/circle.svg", 300, 300);
var layer = [
	initLayer("layer0"),
	initLayer("layer1")
	]

window.addEventListener("resize", function(){ 
	for (var i = 0; i < layer.length; ++i) {
		layer[i].canvas.width = window.innerWidth;
		layer[i].canvas.height = window.innerHeight;
	}
});

function update(du) {
	layer[0].clear();
	sprite.draw(layer[0], 0, 0);
}

function main(timestamp) {
	var time = performance.now();
	update(time - this.oldtime);
	this.oldtime = time;
	requestAnimationFrame(main);
}
main.oldtime = performance.now();
requestAnimationFrame(main);
