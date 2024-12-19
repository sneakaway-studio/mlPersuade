// TODO:
// review for reference errors, etc.
// code from script tags in html
// is currently unchanged

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
var vac = new Image();
vac.src = "images/vaccine.png";
var character = new Image();
character.src = "images/pixmom.png";
var rfk = new Image();
rfk.src = "images/rfk.png";
var fnews = new Image();
fnews.src = "images/fnews.png";
var herb = new Image();
herb.src = "images/herb.png";
var flogin = new Image();
flogin.src = "images/flogin.png";
var feed = new Image();
feed.src = "images/scroll.gif";
var cdc = new Image();
cdc.src = "images/cdc.png";
var void1 = new Image();
void1.src = "images/void.jpeg";
var docs = new Image();
docs.src = "images/doctors.png";
var sdist = new Image();
sdist.src = "images/sdist.png";
var meds = new Image();
meds.src = "images/meds.png";
var ajones = new Image();
ajones.src = "images/alexjones2.png";
var playOnce = 0;

const grid = 35;
const gridGap = 10;

// a simple sprite prototype function
function Sprite(props) {
	// shortcut for assigning all object properties to the sprite
	Object.assign(this, props);
}
Sprite.prototype.render = function () {
	context.fillStyle = this.color;

	// draw a rectangle sprite
	if (this.shape === "vac") {
		// by using a size less than the grid we can ensure there is a visual space
		// between each row
		//   console.log(this.size)
		context.drawImage(vac, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "character") {
		context.drawImage(character, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "rfk") {
		context.drawImage(rfk, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "fnews") {
		context.drawImage(fnews, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "herb") {
		context.drawImage(
			herb,
			this.x,
			this.y + gridGap / 2,
			this.size,
			grid - gridGap
		);
	} else if (this.shape == "cdc") {
		context.drawImage(cdc, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "docs") {
		context.drawImage(docs, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "sdist") {
		context.drawImage(sdist, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "meds") {
		context.drawImage(meds, this.x, this.y + gridGap / 2, this.size, grid - gridGap);
	} else if (this.shape == "ajones") {
		context.drawImage(
			ajones,
			this.x,
			this.y + gridGap / 2,
			this.size,
			grid - gridGap
		);
	}
	// draw a circle sprite. since size is the diameter we need to divide by 2
	// to get the radius. also the x/y position needs to be centered instead of
	// the top-left corner of the sprite
	else {
		context.beginPath();
		context.arc(
			this.x + this.size / 2,
			this.y + this.size / 2,
			this.size / 2 - gridGap / 2,
			0,
			2 * Math.PI
		);
		context.fill();
	}
};

const frogger = new Sprite({
	x: grid * 6, //288
	y: grid * 13, //624
	size: 40,
	shape: "character",
});
const scoredFroggers = [];

// a pattern describes each obstacle in the row
const patterns = [
	// end bank is safe

	// log
	{
		spacing: [0, 3, 0], // how many grid spaces between each obstacle
		color: "#c55843", // color of the obstacle
		size: grid * 2, // width (rect) / diameter (circle) of the obstacle
		shape: "herb", // shape of the obstacle (rect or circle)
		speed: 0.75, // how fast the obstacle moves and which direction
	},

	// turtle
	{
		spacing: [0, 2, 0, 2, 0, 2, 0, 4],
		color: "#de0004",
		size: grid,
		shape: "rfk",
		speed: -1,
	},
	{
		spacing: [2,0,2],
		color: "#c55843",
		size: grid,
		shape: "fnews",
		speed: 0.5,
	},

	// long log
	{
		spacing: [0, 0, 1],
		color: "#de0004",
		size: grid * 1.5,
		shape: "herb",
		speed: -1,
	},
	{
		spacing: [3, 0, 3, 0, 3],
		color: "#de0004",
		size: grid,
		shape: "ajones",
		speed: -1,
	},
	// log

	// turtle

	null,
	null,
	// beach is safe

	// truck
	{
		spacing: [3, 8],
		color: "#c2c4da",
		size: grid * 3,
		shape: "vac",
		speed: -1,
	},

	// fast car
	{
		spacing: [3, 3, 3, 3, 3],
		color: "#c2c4da",
		size: grid * 2,
		shape: "docs",
		speed: 1.8,
	},

	// car
	{
		spacing: [3, 3, 7],
		color: "#de3cdd",
		size: grid * 4,
		shape: "sdist",
		speed: -1.0,
	},

	// bulldozer
	{
		spacing: [3, 3, 7],
		color: "#0bcb00",
		size: grid * 3,
		shape: "cdc",
		speed: 0.9,
	},

	// car
	{
		spacing: [4],
		color: "#e5e401",
		size: grid,
		shape: "meds",
		speed: -0.5,
	},

	// start zone is safe
	null,
];

// rows holds all the sprites for that row
const rows = [];
for (let i = 0; i < patterns.length; i++) {
	rows[i] = [];

	let x = 0;
	let index = 0;
	const pattern = patterns[i];

	// skip empty patterns (safe zones)
	if (!pattern) {
		continue;
	}

	// allow there to be 1 extra pattern offscreen so the loop is seamless
	// (especially for the long log)
	let totalPatternWidth =
		pattern.spacing.reduce((acc, space) => acc + space, 0) * grid +
		pattern.spacing.length * pattern.size;
	let endX = 0;
	while (endX < canvas.width) {
		endX += totalPatternWidth;
	}
	endX += totalPatternWidth;

	// populate the row with sprites
	while (x < endX) {
		rows[i].push(
			new Sprite({
				x,
				y: grid * (i + 1),
				index,
				...pattern,
			})
		);

		// move the next sprite over according to the spacing
		const spacing = pattern.spacing;
		x += pattern.size + spacing[index] * grid;
		index = (index + 1) % spacing.length;
	}
}

// game loop
function loop() {
	requestAnimationFrame(loop);
	context.clearRect(0, 0, canvas.width, canvas.height);

	// draw the game background
	// water
	context.globalAlpha = 0.5;
	context.drawImage(void1, 0, 0, canvas.width, grid * 7);
	context.globalAlpha = 1.0;

	// end bank
	context.fillStyle = "#1ac300";
	context.fillRect(0, 0, canvas.width / 5, grid);
	context.fillRect((canvas.width / 5) * 2, 0, canvas.width / 5, grid);
	context.fillRect((canvas.width / 5) * 4, 0, canvas.width / 5, grid);
	// beach
	context.fillStyle = "#8500da";
	context.fillRect(0, 6 * grid, canvas.width, grid * 2);
	context.globalAlpha = 0.5;
	context.drawImage(feed, 0, 8 * grid, canvas.width, grid * 5);

	// start zone
	context.globalAlpha = 0.7;
	context.drawImage(flogin, 0, canvas.height - grid * 1, canvas.width, grid);
	context.globalAlpha = 1.0;
	context.font = "40px Krungthep Bold";
	context.fillStyle = "#5fa7ff";
	context.textAlign = "center";
	context.fillText("THE FEED", 3.6 * grid, grid * 11);
	context.fillStyle = "#ea1953";
	context.globalAlpha = 0.7;
	context.fillText("VOID", 3.8 * grid, grid * 3.3);
	context.fillText("of", 3.8 * grid, grid * 4.3);
	context.fillText("FAKE NEWS", 3.8 * grid, grid * 5.3);
	context.globalAlpha = 1.0;

	// update and draw obstacles
	for (let r = 0; r < rows.length; r++) {
		const row = rows[r];

		for (let i = 0; i < row.length; i++) {
			const sprite = row[i];
			sprite.x += sprite.speed;
			sprite.render();

			// loop sprite around the screen
			// sprite is moving to the left and goes offscreen
			if (sprite.speed < 0 && sprite.x < 0 - sprite.size) {
				// find the rightmost sprite
				let rightMostSprite = sprite;
				for (let j = 0; j < row.length; j++) {
					if (row[j].x > rightMostSprite.x) {
						rightMostSprite = row[j];
					}
				}

				// move the sprite to the next spot in the pattern so it continues
				const spacing = patterns[r].spacing;
				sprite.x =
					rightMostSprite.x +
					rightMostSprite.size +
					spacing[rightMostSprite.index] * grid;
				sprite.index = (rightMostSprite.index + 1) % spacing.length;
			}

			// sprite is moving to the right and goes offscreen
			if (sprite.speed > 0 && sprite.x > canvas.width) {
				// find the leftmost sprite
				let leftMostSprite = sprite;
				for (let j = 0; j < row.length; j++) {
					if (row[j].x < leftMostSprite.x) {
						leftMostSprite = row[j];
					}
				}

				// move the sprite to the next spot in the pattern so it continues
				const spacing = patterns[r].spacing;
				let index = leftMostSprite.index - 1;
				index = index >= 0 ? index : spacing.length - 1;
				sprite.x = leftMostSprite.x - spacing[index] * grid - sprite.size;
				sprite.index = index;
			}
		}
	}

	// draw frogger
	frogger.x += frogger.speed || 0;
	frogger.render();

	// draw scored froggers
	scoredFroggers.forEach((frog) => frog.render());

	// check for collision with all sprites in the same row as frogger
	const froggerRow = frogger.y / grid - 1;
	let collision = false;
	for (let i = 0; i < rows[froggerRow].length; i++) {
		let sprite = rows[froggerRow][i];

		// axis-aligned bounding box (AABB) collision check
		// treat any circles as rectangles for the purposes of collision
		if (
			frogger.x < sprite.x + sprite.size - gridGap &&
			frogger.x + grid - gridGap > sprite.x &&
			frogger.y < sprite.y + grid &&
			frogger.y + grid > sprite.y
		) {
			collision = true;

			// reset frogger if got hit by car
			if (froggerRow >= rows.length / 2) {
				frogger.x = grid * 6;
				frogger.y = grid * 13;
			}
			// move frogger along with obstacle
			else {
				frogger.speed = sprite.speed;
			}
		}
	}

	if (!collision) {
		// if fogger isn't colliding reset speed
		frogger.speed = 0;
		if (froggerRow == 6 && playOnce < 1) {
			window.top.postMessage("safe", "*");
			playOnce += 1;
		}
		// frogger got to end bank (goal every 3 cols)
		const col = ((frogger.x + grid / 2) / grid) | 0;
		if (
			froggerRow === 0 &&
			col % 3 === 0 &&
			// check to see if there isn't a scored frog already there
			!scoredFroggers.find((frog) => frog.x === col * grid)
		) {
			scoredFroggers.push(
				new Sprite({
					...frogger,
					x: col * grid,
					y: frogger.y + 5,
				})
			);
			playOnce = 0;
		}

		// reset frogger if not on obstacle in river
		if (froggerRow < rows.length / 2 - 2) {
			frogger.x = grid * 5;
			frogger.y = grid * 13;
		}
	}
}

// listen to keyboard events to move frogger
document.addEventListener("keydown", function (e) {
	// left arrow key
	if (e.which === 37) {
		frogger.x -= grid;
	}
	// right arrow key
	else if (e.which === 39) {
		frogger.x += grid;
	}

	// up arrow key
	else if (e.which === 38) {
		frogger.y -= grid;
	}
	// down arrow key
	else if (e.which === 40) {
		frogger.y += grid;
	}

	// clamp frogger position to stay on screen
	frogger.x = Math.min(Math.max(0, frogger.x), canvas.width - grid);
	frogger.y = Math.min(Math.max(grid, frogger.y), canvas.height - grid * 2);
});

//start the game
requestAnimationFrame(loop);
