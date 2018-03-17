var myGamePiece;
var myObstacles = [];
var score = 0;

// this starts the game
function startGame() {
    myGameArea.start();
    createComponents();
}

// create the canvas
var myGameArea = {
	// creates an attribute of myGameArea (called canvas)
    canvas : document.createElement("canvas"),
    // creates a function that sets up the canvas
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        // context is used to draw on the canvas
        this.context = this.canvas.getContext("2d");
        // makes this the 1st thing to appear in the html body
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    	this.interval = setInterval(updateGameArea, 20);

    	// setup a key listener
    	window.addEventListener('keydown', function (e) {
    		myGameArea.key = e.keyCode;
    	})
    	window.addEventListener('keyup', function (e) {
    		myGameArea.key = false;
    	})

    	
    	// used to keep track of obstacles and the score
    	this.frameNo = 0;
    },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },

    stop : function() {
    	endGameMessage();
    	clearInterval(this.interval);
    }
}

// things drawn on the canvas
function component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y; 
    this.speedX = 0;
    this.speedY = 0;
    this.gravitySpeed = 2;
    this.jumpTimeRemaining = 0;

    // redraws the component
    this.update = function(){
    	context = myGameArea.context;
    	context.fillStyle = color;
    	context.fillRect(this.x, this.y, this.width, this.height);
    }

    this.newPosition = function() {
    	this.x += this.speedX;
    	this.y += this.speedY;

    	// add gravity
    	//if(this.y + this.height <= myGameArea.canvas.height)
    		if(this.jumpTimeRemaining == 0)
    			this.y += this.gravitySpeed;
    }

    this.crashWith = function(otherobj) {
    	// this object's coordinates
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);

        // other object's coordinates
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);

        // check if the 2 objects overlap
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false;
        }
        return crash;
    }

    // allows the user to move up for a period of time
    this.jump = function() {
		this.jumpTimeRemaining = 12;
		this.speedY = -3;}
    }

function createComponents() {
	myGamePiece = new component(30, 30, "rgb(230, 230, 65)", 100, 120);
}

function updateGameArea() {
	var x, height, gap, minHeight, maxHeight, minGap, maxGap;

	// check if the main character crashed with any obstacles
	if(crashed())
		return;
    
	myGameArea.clear();
	myGameArea.frameNo += 1;

	// creates 2 new walls with a gap in between them every 150 frames
	createWalls();

	// update score
	if(myGameArea.frameNo > 200 && (myGameArea.frameNo-50) % 150 == 0)
		score++;

	// move every obstacle one to the left each frame
	moveWalls();
	

	// keeps the main character in place
	if(myGamePiece.jumpTimeRemaining==0)
    	myGamePiece.speedY = 0; 

    // check key presses
	if(myGameArea.key) {
            // key 32 is the space bar
            if(myGameArea.key == 32 && myGamePiece.y > 0)
            	myGamePiece.jump();
            myGamePiece.gravity = 0;
        }

    // decrement the jumpTime every frame
    if(myGamePiece.jumpTimeRemaining != 0)
    	myGamePiece.jumpTimeRemaining--;

    myGamePiece.newPosition();
    myGamePiece.update();

    displayScore();
}

// check if the gamepiece hit a wall or the floor
function crashed() {
	for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            return true;
        }
    }

    if(myGamePiece.y + myGamePiece.height > myGameArea.canvas.height) {
    	myGameArea.stop();
    	return true;
    }

    return false;
}

// creates 2 new walls with a gap in between them every 150 frames
function createWalls() {
	if(myGameArea.frameNo % 150 == 0) {
		wallColor = "rgb(55, 180, 50)";
		x = myGameArea.canvas.width;
		minHeight = 20;
		maxHeight = 170;
		height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);
		gap = 100
		myObstacles.push(new component(50, height, wallColor, x, 0));
		myObstacles.push(new component(50, x - height - gap, wallColor, x, height + gap));
	}
}

// move all walls to the left
function moveWalls() {
	for(i=0; i<myObstacles.length; i += 1) {
		myObstacles[i].x += -2;
		myObstacles[i].update();
	}
}

// display the current score
function displayScore() {
	myGameArea.context.font = "20px" + " " + "Consolas";
    myGameArea.context.fillStyle = "black";
    myGameArea.context.fillText("Score: " + score, 350, 40)
}

// display "Game Over"
function endGameMessage() {
	myGameArea.context.font = "40px" + " " + "Consolas";
    myGameArea.context.fillStyle = "black";
    myGameArea.context.fillText("Game Over", 130, 140)
}

// unused
function randomColor() {
    var r = Math.floor(Math.random()*256);
    var g = Math.floor(Math.random()*256);
    var b = Math.floor(Math.random()*256);
    return "rgb("+r+","+g+","+b+")";
}
