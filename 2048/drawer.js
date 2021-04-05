// GLOBAL VARIABLES --------------------------------------------

var canvas
var ctx
var length

const lineWidthP = 4;
const lineColor = "#8a6d5c";
const cellMarginFromLineCenter = 1;

const numberImagePrefix = "img"

const startSizeAnimationRatio = 0.8
const animationMovingFrames = 5
const animationCreationFrames = 5
const animationDelta = 15

const numberWidth = (100 - lineWidthP) / numSquares - 2 * cellMarginFromLineCenter;
const cellInterval = (100 - lineWidthP) / numSquares

var imagePaths = {
  border: "border",
  textBox: "finishedBox"
}
// Elements should be put in as a string, just to stay consistent
var images = {};

var handlingAnimation = false


// EXTERNAL FUNCTIONS --------------------------------------------

// initialize variables and stuff
function initialize() {
  console.log("hi")
  canvas = document.getElementById("mainCanvas");
  ctx = canvas.getContext("2d");

  length = Math.min(window.innerWidth, window.innerHeight) * 0.8;
  canvas.width = length;
  canvas.height = length;

  for (let i = 2; i <= 2048; i <<= 1) {
    var image = document.createElement("img")
    image.src = "./images/tiles/" + i + ".png"
    imagePaths["" + i] = numberImagePrefix + i
    image.id = numberImagePrefix + i
    document.getElementById("images").appendChild(image)
  }

  for (var key in imagePaths) {
    images[key] = document.getElementById(imagePaths[key]);
  }
}

// Rendering the array
function render_grid(numbers){
  drawBackground();
  for(let y = 0; y < numbers.length; ++y){
    for(let x = 0; x < numbers.length; ++x){
      if(numbers[y][x] == 0){
        continue;
      }
      drawCell(x, y, 1 << numbers[y][x]);
    }
  }
}

// movingPieces = [[number, start Cell Row, start Cell Column, end Cell Row, end Coll Column]]
// createdPieces = [[number, cell row, cell column]]
function encode(movingPieces, createdPieces){
  movingParts = []
  for(let piece of movingPieces){
    let [sx, sy] = getPCoordFromCell(piece[2], piece[1], 1)
    let [ex, ey] = getPCoordFromCell(piece[4], piece[3], 1)
    movingParts.push([piece[0], sx, sy, ex, ey])
  }
  createdParts = []
  for(let piece of createdPieces){
    createdParts.push([piece[0], piece[2], piece[1]]);
  }
  return [movingParts, createdParts]
}

function render_animation(movingParts, creationParts){
  handlingAnimation = true;
  render_moving(movingParts, 0, creationParts)
}

// HIGHER LEVEL RENDERING FUNCTIONS --------------------------------------

// parts = [[number, startx, starty, endx, endy]]
function render_moving(parts, currentFrame, creation_parts){
  if(currentFrame > animationMovingFrames){
    completed = []
    for(let part of parts){
      completed.push([part[0], part[3], part[4]])
    }
    setTimeout(render_creation, animationDelta, creation_parts, completed, 0)
    return
  }
  drawBackground()
  for(let part of parts){
    ratio = currentFrame / animationMovingFrames
    let [number, startx, starty, endx, endy] = part
    drawImageP(ratio * (endx - startx) + startx, ratio * (endy - starty) + starty, numberWidth, numberWidth, 1 << number)
  }
  setTimeout(render_moving, animationDelta, parts, ++currentFrame, creation_parts)
}

// parts = [[number, x, y]]; fullParts = [[number, x, y]]
function render_creation(parts, fullParts, currentFrame){
  if(currentFrame > animationCreationFrames){
    handlingAnimation = false;
    return
  }
  drawBackground()
  for(let part of fullParts){
    [number, x, y] = part
    drawImageP(x, y, numberWidth, numberWidth, 1 << number)
  }
  for(let part of parts){
    let ratio = currentFrame / animationCreationFrames;
    let [number, x, y] = part;
    drawCellScaled(x, y, 1 << number, ratio);
  }
  setTimeout(render_creation, animationDelta, parts, fullParts, ++currentFrame)
}

// DRAWING FUNCTIONS --------------------------------------------

// Draw the lines of the thingymabober
function drawLines() {
  var width = 100 - lineWidthP;
  var increase = width / numSquares;

  for (var i = 1, x = increase; i < numSquares; i++, x += increase) {
    fillRectP(x, 0, lineWidthP, length, lineColor);
    fillRectP(0, x, length, lineWidthP, lineColor);
  }
}

// Draw an image at some place, image is just id
function drawImage(x, y, width, height, image, opacity) {
  ctx.globalAlpha = opacity;
  ctx.drawImage(images[image], x, y, width, height);
  ctx.globalAlpha = 1
}

// drawImage but for the resizables, image is just id
function drawImageP(x, y, width, height, image, opacity = 1) {
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
  ratio = length * 0.01
  fillRect(x * ratio, y * ratio, width * ratio, height * ratio, color)
}

function drawCell(x, y, value){
  drawCellScaled(x, y, value, 1)
}

function drawCellScaled(x, y, value, scale){
  [x, y] = getPCoordFromCell(x, y, scale)

  drawImageP(x, y, numberWidth * scale, numberWidth * scale, value)
}

function getPCoordFromCell(x, y, scale){
  x = x * cellInterval + lineWidthP / 2 + cellMarginFromLineCenter + (numberWidth - numberWidth * scale) / 2
  y = y * cellInterval + lineWidthP / 2 + cellMarginFromLineCenter + (numberWidth - numberWidth * scale) / 2
  return [x, y]
}

// Draws the background
function drawBackground(){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawImageP(0, 0, 100, 100, "border")
  drawLines();
}

function fillTextP(text, size, centerX, centerY, color, opacity = 1){
  ratio = length * 0.01

  ctx.fillStyle = color
  ctx.font = size * ratio + "px Arial bold"
  ctx.textAlign = "center";

  ctx.globalAlpha = opacity
  ctx.fillText(text, centerX * ratio, centerY * ratio)
  ctx.globalAlpha = 1
}
