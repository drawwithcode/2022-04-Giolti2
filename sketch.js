let hexRadius;

let shakelock = 0;
let textonce = true;

let slider = document.getElementById("slider");

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

	sliderOn() {
		let sliderX = map(slider.value, 1, 100, width * 0.05, width * 0.95);
		
		return (Math.abs(this.centerX - sliderX) < 0.1 * width)
	}

	mouseOn(x, y) {
		return dist(x, y, this.centerX, this.centerY) < hexRadius * sin(60)
	}

	stroke() {
		this.fill = 80 + random(20);
		this.render = true;
		this.timelock = 20;

		this.adjacent.forEach(function (hex) {
			if (hex.timelock == 0) {
				hex.fill = ((80 + random(20))*2 + hex.fill) / 3;
				hex.render = true;
				hex.timelock = 20;
			}
		})
	}

	adjacentSetup(grid) {
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

	document.getElementById("box").style.height = (windowHeight - 0.15 * windowWidth) + "px"

	frameRate(120)
	
	hexRadius = 0.005 * max(width, height);

	angleMode(DEGREES)

	for (let x = 0; x * hexRadius * 2 * sin(60) <= width + hexRadius * sin(60); x++){
		grid[x] = [];
		for (let y = 0; y * hexRadius * 1.5 <= height + hexRadius; y++){
			grid[x][y] = new Hex(x, y);
		}
	}

	grid.forEach(function (col) {
		col.forEach(function (hex) {
			hex.adjacentSetup(grid);
		})
	})
}

function draw() {
	grid.forEach(function (col) {
		col.forEach(function (hex) {

			if (hex.sliderOn()) {
				let sliderX = map(slider.value, 0, 100, width * 0.05, width * 0.95, true);
				let newFill = map(Math.abs(hex.centerX - sliderX), width * 0.03, width * 0.1, 0, 100, true)

				if (newFill < hex.fill) {
					hex.fill = newFill;
					hex.render = true;
					hex.timelock = 20;
				}
			}

			if (mouseIsPressed === true) {
				if (hex.mouseOn(mouseX, mouseY)) {
					hex.stroke();
				}
			}

			if (touches.length > 0) {
				touches.forEach(function (touch) {
					if (hex.mouseOn(touch.x, touch.y)) {
						hex.stroke();
					}
				})
			}

			if (hex.render) {
				hex.draw();
				hex.render = false;
			}

			hex.update();
		})
	})

	if (shakelock > 0) {
		shakelock--;
	}

	if (textonce) {
		push()

		translate(width / 2, height / 2)
		
		textSize(16);
		textAlign(CENTER, CENTER);

		text('Draw with your fingers and erase with the slider', 0, 0,);
		text('Shake the device to scramble things a bit', 0, 20);
		
		pop()

		textonce = false;
	}
}

function deviceShaken() {
	if (shakelock == 0) {
		let newGrid = [];

		grid.forEach(function (col) {
			newGrid.push([])

			col.forEach(function (hex) {
				newGrid[hex.x].push(new Hex(hex.x, hex.y))
			})
		})

		newGrid.forEach(function (col) {
			col.forEach(function (hex) {
				hex.adjacentSetup(newGrid);
			})
		})

		grid.forEach(function (col) {
			col.forEach(function (hex) {
				let partFill = hex.fill / 7;
				if(hex.x == 30 && hex.y == 40)console.log(hex)
				
				newGrid[hex.x][hex.y].fill += random(0.5, 1.5) * partFill;

				hex.adjacent.forEach(function (hex) {
					newGrid[hex.x][hex.y].fill += random(0.5, 1.5) * partFill;
				})
			})
		})

		grid.forEach(function (col) {
			col.forEach(function (hex) {
				if (newGrid[hex.x][hex.y].fill != hex.fill) {
					newGrid[hex.x][hex.y].render = true;
				}
			})
		})
		
		grid = newGrid.slice();

		shakelock = 80;
	}
}