let hexRadius;

let grid = [];

class Hex{
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.fill = 0;
		this.timelock = 0;

		this.centerX = this.x * hexRadius * 2 * sin(60) + this.y % 2 * hexRadius * sin(60);
		this.centerY = this.y * hexRadius * 1.5;

		this.render = true;
		this.adjacent = [];
	}

	draw() {
		push()

		fill(map(this.fill, 0, 100, 255, 100, true));
		stroke(50);
		strokeWeight(0.1);

		angleMode(DEGREES)

		translate(this.centerX, this.centerY)
	
		beginShape();

		for (let angle = 0; angle < 360; angle += 60) {
			vertex(hexRadius * sin(angle), hexRadius * cos(angle));
		}

		endShape(CLOSE);

		pop();
	}

	mouseOn() {
		return dist(mouseX, mouseY, this.centerX, this.centerY) < hexRadius * sin(60)
	}

	adjacentSetup() {
		try {
			this.adjacent.push(grid[this.x - 1 + this.y % 2][this.y - 1])
		}catch{}

		try {
			this.adjacent.push(grid[this.x + this.y % 2][this.y - 1])
		}catch{}

		try {
			this.adjacent.push(grid[this.x - 1][this.y])
		}catch{}

		try {
			this.adjacent.push(grid[this.x + 1][this.y])
		}catch{}

		try {
			this.adjacent.push(grid[this.x - 1 + this.y % 2][this.y + 1])
		}catch{}

		try {
			this.adjacent.push(grid[this.x + this.y % 2][this.y + 1])
		}catch{}
		
		this.adjacent = this.adjacent.filter(function( element ) {
			return element !== undefined;
		 });
	}

	update() {
		if (this.timelock > 0) {
			this.timelock--;
		}
	}
}

function preload() {
	// put preload code here
}

function setup() {
	createCanvas(windowWidth, windowHeight);

	frameRate(120)
	
	hexRadius = 0.005 * height;

	angleMode(DEGREES)

	for (let x = 0; x * hexRadius * 2 * sin(60) <= width + hexRadius * sin(60); x++){
		grid[x] = [];
		for (let y = 0; y * hexRadius * 1.5 <= height + hexRadius; y++){
			grid[x][y] = new Hex(x, y);
		}
	}

	grid.forEach(function (col) {
		col.forEach(function (hex) {
			hex.adjacentSetup();
		})
	})
}

function draw() {
	// put drawing code here
	grid.forEach(function (col) {
		col.forEach(function (hex) {
			if (mouseIsPressed === true) {
				if (hex.mouseOn()) {
					hex.fill = 80 + random(20);
					hex.render = true;

					hex.adjacent.forEach(function (hex) {
						if (hex.timelock == 0) {
							hex.fill = ((80 + random(20))*2 + hex.fill) / 3;
							hex.render = true;
							hex.timelock = 20;
						}
					})
				}
			}
			if (hex.render) {
				hex.draw();
				hex.render = false;
			}
			hex.update();
		})
	})

	if (frameRate() < 50) {
		console.log(frameRate() + " t: " + millis()/1000)
	}
}