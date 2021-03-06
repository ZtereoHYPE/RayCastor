const level = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 3, 0, 0, 5, 1, 0, 1,
	1, 0, 0, 3, 0, 0, 0, 1, 0, 1,
	1, 0, 1, 0, 0, 0, 1, 4, 0, 1,
	1, 0, 2, 2, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 1,
	1, 0, 0, 0, 0, 0, 0, 3, 3, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
const colourMap = [
	{
		h: 0,
		s: 0,
		b: 0
	},
	{
		h: 0,
		s: 0,
		b: 256
	},
	{
		h: 0,
		s: 256,
		b: 256
	},
	{
		h: 37,
		s: 256,
		b: 256
	},
	{
		h: 80,
		s: 230,
		b: 256
	},
	{
		h: 167,
		s: 200,
		b: 256
	},
]
const mapSize = 10;
const tileSize = 50;
function tileAt(x, y) {
	return level[floor(y / tileSize) * mapSize + floor(x / tileSize)];
}

let playerPosition;
let playerDirection;
let playerSize = 20
const fov = 70;
const raySpacing = 0.1;
const maxRayLength = 550
const mapLocation = {
	x: 0,
	y: 0,
	size: 500
}
const screenLocation = {
	x: 500,
	y: 0
}


function drawMap() {
	fill('black')
	stroke('black')
	rect((mapLocation.x/(tileSize*mapSize))*mapLocation.size, (mapLocation.y/(tileSize*mapSize))*mapLocation.size, mapLocation.size, mapLocation.size)
	for (y = 0; y < 500; y += tileSize) {
		for (x = 0; x < 500; x += tileSize) {
			if (tileAt(x, y)) {
				let colour = colourMap[tileAt(x, y)]
				fill(color(colour.h, colour.s, colour.b));
				square(((mapLocation.x + x) / (mapSize * tileSize)) * mapLocation.size, ((mapLocation.y + y) / (mapSize * tileSize)) * mapLocation.size, mapLocation.size / mapSize);
			}
		}
	}
	fill('green')
	circle(((mapLocation.x + playerPosition.x) / (mapSize * tileSize)) * mapLocation.size, ((mapLocation.y + playerPosition.y) / (mapSize * tileSize)) * mapLocation.size, (playerSize/500)*mapLocation.size);
}

function raycast() {
	drawMap()
	for (let angle = -(fov / 2); angle <= fov / 2; angle += raySpacing) {
		let currentRayDirection = playerDirection.copy()
		currentRayDirection.rotate(radians(angle));

		let currentRayEnd = {
			x: currentRayDirection.x,
			y: currentRayDirection.y
		}

		let max = 0

		while (!tileAt(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y) != 0 && max < maxRayLength) {
			currentRayEnd.x += currentRayDirection.x;
			currentRayEnd.y += currentRayDirection.y;
			max++
		}
		
		draw3D(currentRayEnd, angle)
		
		stroke("lightblue");

		let offsets = {
			x: mapLocation.x + playerPosition.x,
			y: mapLocation.y + playerPosition.y
		};

		let totalSize = mapSize * tileSize;
		let size = mapLocation.size; // avoid repetitive method calls

		let x = offsets['x'] / totalSize
		let y = offsets['y'] / totalSize;

		let x1 = x * size;
		let y1 = y * size;
		let x2 = x1 + (currentRayEnd.x / totalSize) * size;
		let y2 = y1 + (currentRayEnd.y / totalSize) * size;

		line(x1, y1, x2, y2);
		noStroke()
	}
}

function draw3D(currentRayEnd, angle) {
	let rayLength = getRayLength(playerPosition, { x: currentRayEnd.x + playerPosition.x, y: currentRayEnd.y + playerPosition.y })
	if (tileAt(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y + 1) && tileAt(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y - 1)) {
		let colour = colourMap[tileAt(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y)]
		fill(color(colour.h, colour.s, colour.b - rayLength ** 2 / 1000));
	} else {
		let colour = colourMap[tileAt(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y)]
		fill(color(colour.h, colour.s, colour.b - 40 - rayLength ** 2 / 1000))
	}
	rect(250 + ((fov - angle) * 500) / fov, 250 - ((tileSize * windowHeight) / (rayLength * cos(radians(angle)))) / 2, 500 / (fov / raySpacing) + 1, (tileSize * windowHeight) / (rayLength * cos(radians(angle))))
}

function movePlayer() {
	/* 	
		NOTE: This system to not make the player enter the walls is not ideal:
		It currently allows player to pass slightly through a wall.
		The ideal fix would be to set a potential location and to check a bunch of points around the player to be checked each time for collision.
	*/

	// up
	if (keyIsDown(87)) {
		if (!tileAt(playerPosition.x, playerPosition.y - 2 - playerSize / 2)) {
			playerPosition.y -= 2
		}
	}

	// down
	if (keyIsDown(83)) {
		if (!tileAt(playerPosition.x, playerPosition.y + 2 + playerSize / 2)) {
			playerPosition.y += 2
		}
	}

	// left
	if (keyIsDown(65)) {
		if (!tileAt(playerPosition.x - 2 - playerSize / 2, playerPosition.y)) {
			playerPosition.x -= 2
		}
	}

	// right
	if (keyIsDown(68)) {
		if (!tileAt(playerPosition.x + 2 + playerSize / 2, playerPosition.y)) {
			playerPosition.x += 2
		}
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	colorMode(HSB, 255);
	playerPosition = createVector(330, 272);
	playerDirection = createVector(0, 1);
}

function draw() {
	playerDirection.x = mouseX - ((mapLocation.x + playerPosition.x) / (mapSize * tileSize)) * mapLocation.size;
	playerDirection.y = mouseY - ((mapLocation.y + playerPosition.y) / (mapSize * tileSize)) * mapLocation.size;
	playerDirection.normalize();
	background(0);
	movePlayer();
	noStroke()
	fill('#11dd44')
	rect(500, 250, 700, 250)
	fill('#1188dd')
	rect(500, 0, 700, 250)
	// drawMap();
	raycast();
}

function getRayLength(object1, object2) {
	let differenceX = object1.x - object2.x;
	let differenceY = object1.y - object2.y;
	return Math.sqrt(differenceX * differenceX + differenceY * differenceY);
}