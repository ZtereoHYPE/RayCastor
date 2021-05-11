const level = [
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 3, 0, 0, 5, 1, 0, 1,
	1, 0, 4, 4, 0, 0, 0, 1, 0, 1,
	1, 0, 1, 0, 0, 0, 1, 4, 0, 1,
	1, 0, 2, 2, 0, 0, 0, 0, 0, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 1,
	1, 0, 0, 1, 0, 0, 0, 3, 3, 1,
	1, 0, 0, 0, 0, 0, 0, 0, 3, 1,
	1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
const colourMap = {
	0: 'black',
	1: 'white',
	2: 'blue',
	3: 'red',
	4: 'yellow',
	5: 'lightGreen'
}
const mapSize = 10;
const tileSize = 50;
function tileAt(x, y) {
	return level[floor(y / tileSize) * mapSize + floor(x / tileSize)];
}
let playerPosition;
let playerDirection;
let playerSize = 20
const fov = 80;
const raySpacing = 5;

function drawMap() {
	background(0);
	noStroke()
	for (y = 0; y <= 500; y += tileSize) {
		for (x = 0; x <= 500; x += tileSize) {
			if (tileAt(x, y)) {
				fill(colourMap[tileAt(x, y)]);
				square(x, y, tileSize);
			}
		}
	}
}

function drawRaysAndPlayer() {
	fill("green");
	
	for (let angle = -(fov / 2); angle <= fov / 2; angle += raySpacing) {
		let currentRayDirection = playerDirection.copy()
		currentRayDirection.rotate(radians(angle));
		
		let currentRayEnd = {
			x: currentRayDirection.x,
			y: currentRayDirection.y
		}
		
		let max = 0
		// console.log(currentRayEnd)
		while (!tileAt(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y) != 0 && max < 1000) {
			currentRayEnd.x += currentRayDirection.x;
			currentRayEnd.y += currentRayDirection.y;
		}
		
		line(
			playerPosition.x,
			playerPosition.y,
			playerPosition.x + currentRayEnd.x,
			playerPosition.y + currentRayEnd.y
			);
			noStroke()
			circle(currentRayEnd.x + playerPosition.x, currentRayEnd.y + playerPosition.y, 6)
			stroke("lightblue");
		}
		circle(playerPosition.x, playerPosition.y, playerSize);
}

function movePlayer() {
	/* 	NOTE: This system to not make the player enter the walls is not ideal:
		It currently allows player to pass slightly through a wall.
		The ideal fix would be to set a potential location and to check a bunch of points around the player to be checked each time for collision.
	*/

	// up
	if (keyIsDown(87)) {
		if (!tileAt(playerPosition.x, playerPosition.y - 2 - playerSize/2)) {
			playerPosition.y -= 2
		}
	}

	// down
	if (keyIsDown(83)) {
		if (!tileAt(playerPosition.x, playerPosition.y + 2 + playerSize/2)) {
			playerPosition.y += 2
		}
	}

	// left
	if (keyIsDown(65)) {
		if (!tileAt(playerPosition.x - 2 - playerSize/2, playerPosition.y)) {
			playerPosition.x -= 2
		}
	}

	// right
	if (keyIsDown(68)) {
		if (!tileAt(playerPosition.x + 2 + playerSize/2, playerPosition.y)) {
			playerPosition.x += 2
		}
	}
}

function setup() {
	createCanvas(500, 500);
	playerPosition = createVector(330, 272);
	playerDirection = createVector(0, 1);
}

function draw() {
	playerDirection.x = mouseX - playerPosition.x;
	playerDirection.y = mouseY - playerPosition.y;
	playerDirection.normalize();
	drawMap();
	movePlayer();
	drawRaysAndPlayer();
}
