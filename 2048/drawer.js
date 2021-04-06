// GLOBAL VARIABLES --------------------------------------------

// Canvas & Drawing; length = canvas width
var canvas
var ctx
var length

// Line Width & Color; the margins of each tile from the lines
const lineWidthP = 4;
const lineColor = "#8a6d5c";
const cellMarginFromLineCenter = 1;

// The prefix used to represent each image
const numberImagePrefix = "img"

// Starting Size
const startSizeAnimationRatio = 0.8
// frames in moving, frames for the creation animation
const animationMovingFrames = 5
const animationCreationFrames = 5
// Milliseconds between animations
const animationDelta = 15

// The width of each tile
const numberWidth = (100 - lineWidthP) / numSquares - 2 * cellMarginFromLineCenter;
// The interval at which we place the tiles
const cellInterval = (100 - lineWidthP) / numSquares

// Preferred Name of Image: ID of image in our html
var imagePaths = {
  border: "border",
  textBox: "finishedBox"
}
// Elements should be put in as a string, just to stay consistent
var images = {};

// Whether or not we're currently in the middle of an animation
var handlingAnimation = false


// EXTERNAL FUNCTIONS --------------------------------------------

// initialize variables and stuff
function initialize() {
  console.log("hi")
  // Initialize canvas
  canvas = document.getElementById("mainCanvas");
  ctx = canvas.getContext("2d");

  // Make sure the canvas fits in the screen
  length = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  canvas.width = length;
  canvas.height = length;

  // Load the number tiles by putting them into the html
  for (let i = 2; i <= 2048; i <<= 1) {
    // We first add the number into our ImagePaths
    imagePaths["" + i] = numberImagePrefix + i

    // Then create the actual element
    var image = document.createElement("img")
    image.src = "./images/tiles/" + i + ".png"
    image.id = numberImagePrefix + i
    document.getElementById("images").appendChild(image)
  }

  // Load the images into js
  for (var key in imagePaths) {
    images[key] = document.getElementById(imagePaths[key]);
  }
}

// Rendering the array
function render_grid(numbers) {
  // Draw the background
  drawBackground();

  // Render the cell of each element in our numbers
  for (let y = 0; y < numbers.length; ++y) {
    for (let x = 0; x < numbers.length; ++x) {
      if (numbers[y][x] == 0) {
        continue;
      }
      drawCell(x, y, 1 << numbers[y][x]);
    }
  }
}

// movingPieces = [[number, start Cell Row, start Cell Column, end Cell Row, end Coll Column]]
// createdPieces = [[number, cell row, cell column]]
function encode(movingPieces, createdPieces) {
  // The encoded version of movingPieces
  // [[number, start percentage x, start percentage y, end perc x, end perc y]]
  movingParts = []
  for (let piece of movingPieces) {
    let [sx, sy] = getPCoordFromCell(piece[2], piece[1], 1)
    let [ex, ey] = getPCoordFromCell(piece[4], piece[3], 1)
    movingParts.push([piece[0], sx, sy, ex, ey])
  }

  // The encoded version of createdPieces
  // [[number, grid x, grid y]]
  createdParts = []
  for (let piece of createdPieces) {
    createdParts.push([piece[0], piece[2], piece[1]]);
  }

  // Then we return the two
  return [movingParts, createdParts]
}

function render_animation(movingParts, creationParts) {
  // We start by rendering the movement
  handlingAnimation = true;
  render_moving(movingParts, 0, creationParts)
}


// HIGHER LEVEL RENDERING FUNCTIONS --------------------------------------

// parts = [[number, startx, starty, endx, endy]]
function render_moving(parts, currentFrame, creation_parts) {
  // Once the animation completes, we go on to animate the creation of tiles
  if (currentFrame > animationMovingFrames) {
    completed = []
    for (let part of parts) {
      completed.push([part[0], part[3], part[4]])
    }
    setTimeout(render_creation, animationDelta, creation_parts, completed, 0)
    return
  }

  // If we need to draw, we start by drawing the background
  drawBackground()

  // For each part, we draw its position based on its final coords, start coords and the current frame in the animation
  for (let part of parts) {
    ratio = currentFrame / animationMovingFrames
    let [number, startx, starty, endx, endy] = part
    drawImageP(ratio * (endx - startx) + startx, ratio * (endy - starty) + starty, numberWidth, numberWidth, 1 << number)
  }

  // After some time, we go on to the next frame
  setTimeout(render_moving, animationDelta, parts, ++currentFrame, creation_parts)
}

// parts = [[number, cell x, cell y]]; fullParts = [[number, perc x, perc y]]
function render_creation(parts, fullParts, currentFrame) {
  // Once we're done with the creation animation
  if (currentFrame > animationCreationFrames) {
    handlingAnimation = false;
    return
  }

  // Start by drawing background
  drawBackground()

  // When drawing created tiles, we still need to keep the tiles already there
  for (let part of fullParts) {
    [number, x, y] = part
    drawImageP(x, y, numberWidth, numberWidth, 1 << number)
  }

  // For every created tile, we draw the tile where it's supposed to be, but smaller in terms of the current frame
  for (let part of parts) {
    let ratio = currentFrame / animationCreationFrames;
    let [number, x, y] = part;
    drawCellScaled(x, y, 1 << number, ratio);
  }

  // Wait a bit, and go to the next frame
  setTimeout(render_creation, animationDelta, parts, fullParts, ++currentFrame)
}


// DRAWING FUNCTIONS --------------------------------------------

// Draw the lines of the thingymabober
function drawLines() {
  // Width is the total amount we have to work with
  var width = 100 - lineWidthP;
  // Increase is the intervals at which we draw the lines
  var increase = width / numSquares;

  // At every interval, we draw the corresponding x and y line
  for (var i = 1, x = increase; i < numSquares; i++, x += increase) {
    fillRectP(x, 0, lineWidthP, length, lineColor);
    fillRectP(0, x, length, lineWidthP, lineColor);
  }
}

// Draw an image at some place, image is just id
function drawImage(x, y, width, height, image, opacity) {
  // We draw the image, making sure that we also reset the opacity if we want semi-tranparency
  ctx.globalAlpha = opacity;
  ctx.drawImage(images[image], x, y, width, height);
  ctx.globalAlpha = 1
}

// drawImage but for the resizables, image is just id
function drawImageP(x, y, width, height, image, opacity = 1) {
  // We convert the coordinates out of 100 into global coordinates based on canvas length
  ratio = length * 0.01
  drawImage(x * ratio, y * ratio, width * ratio, height * ratio, image, opacity)
}

// fill a rectangle with some color
function fillRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

// fillRect but inputs are in percentages; out of 100
function fillRectP(x, y, width, height, color) {
  // Convert coordinates out of 100 into a global coordinate based on length
  ratio = length * 0.01
  fillRect(x * ratio, y * ratio, width * ratio, height * ratio, color)
}

function drawCell(x, y, value) {
  drawCellScaled(x, y, value, 1)
}

function drawCellScaled(x, y, value, scale) {
  // We get the Percentage coordinate given the current "cell coordinates"
  [x, y] = getPCoordFromCell(x, y, scale)

  // Then simply draw the elements with the size scaled appropriately
  drawImageP(x, y, numberWidth * scale, numberWidth * scale, value)
}

function getPCoordFromCell(x, y, scale) {
  // spaghetti code for getting the coordinate out of 100 when given the cell coordinates
  x = x * cellInterval + lineWidthP / 2 + cellMarginFromLineCenter + (numberWidth - numberWidth * scale) / 2
  y = y * cellInterval + lineWidthP / 2 + cellMarginFromLineCenter + (numberWidth - numberWidth * scale) / 2
  return [x, y]
}

// Draws the background
function drawBackground() {
  // Draw the background of the game; an empty grid
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawImageP(0, 0, 100, 100, "border")
  drawLines();
}

function fillTextP(text, size, centerX, centerY, color, opacity = 1) {
  ratio = length * 0.01

  // Set the font that we will be using based on params
  ctx.fillStyle = color
  ctx.font = size * ratio + "px Arial bold"
  ctx.textAlign = "center";

  // If we require transparency, make sure to undo it after we draw the text
  ctx.globalAlpha = opacity
  ctx.fillText(text, centerX * ratio, centerY * ratio)
  ctx.globalAlpha = 1
}
