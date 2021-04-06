// numbers[row][column] = val, where then number is 2^{val}
var numbers = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

const numSquares = 4;

// Client when playing the game 2048 itself
class gameClient{
  constructor(freeplay = false){
    // In freeplay, we don't transition to the finishedClient
    this.freeplay = freeplay
  }
  update(){
    // Update the score
    document.getElementById("score").innerHTML = "Score: " + this.getSum();

    // Don't interrupt animations
    if(!handlingAnimation){
      render();
    }

    // If every move results in other being changed, then the player loses
    if(!this.hasMoves()){
      currentClient = new finishedClient(false)
      return
    }
  }

  // Returns the sum of the elements in numbers
  getSum(){
    let s = 0;
    for(let i = 0; i < numSquares; ++i){
      for(let c = 0; c < numSquares; ++c){
        // 1 << numbers[i][c], because the numbers displayed on the screen are actually 2 ^ {element}, not the element itself
        s += numbers[i][c] != 0 ? 1 << numbers[i][c] : 0
      }
    }
    return s;
  }

  // Returns if the player can make any more moves
  hasMoves(){
    // Moves in each of the directions
    for(let direction of ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]){
      let tma = []
      let tca = []
      // Moves with a copy of the numbers, stores the movements & creations in tma & tca
      move(direction, tma, tca, JSON.parse(JSON.stringify(numbers)))

      // If every element in tma isn't actually a move(for example (1,2) -> (1,2); nothing changes)
      let didChange = tma.every(e => e[1] == e[3] && e[2] == e[4])

      // If the current move did actually change something, then the user still has possible moves
      if(!didChange){
        return true
        break
      }
    }
    // None of the moves were meaningful, so the user has no more moves
    return false
  }

  // Handles key events for the game
  keydown(e){
    // Don't move if currently animating
    if(handlingAnimation){
      return;
    }
    // [0,0] is for invalid key presses
    let [mr, mc] = getIntervalFromDirection(e.code)
    if(mr == 0 && mc == 0){
      return
    }

    // We move in the direction, we store animation stuff in the two arrays
    var movingArray = []
    var creationArray = []
    move(e.code, movingArray, creationArray, numbers)

    // If nothing move and nothing is created, then we can't update
    if(movingArray.every(element => element[1] == element[3] && element[2] == element[4]) && creationArray.length == 0){
      return;
    }

    // Create a new element
    let [r, c] = randomEmpty()
    numbers[r][c] = Math.floor(Math.random() * 2) + 1
    creationArray.push([numbers[r][c], r, c])

    // Check to see if there are any other possible moves
    if(!this.hasMoves()){
      currentClient = new finishedClient(false)
      return
    }

    // Check to see if there's a 2048
    for(let i = 0; i < numSquares; ++i){
      for(let c = 0; c < numSquares; ++c){
        // If there is, then if we're in freeplay mode, we just continue;
        // Otherwise, we give them the "win" screen
        if(numbers[i][c] == 11 && !this.freeplay){
          currentClient = new finishedClient(true)
          return
        }
      }
    }

    // we start animating
    var [moveEncoded, creationEncoded] = encode(movingArray, creationArray)
    render_animation(moveEncoded, creationEncoded)
  }
}

// Client after the 2048 is finished; either player won or lost
class finishedClient{
  constructor(didWin){
    this.win = didWin;
  }

  update(){
    // We first render the board in the background
    render()

    // Draw the border
    drawImageP(10, 10, 80, 80, "textBox", 0.6)

    // We change the text based on if the player won
    let text = "You Lost!"
    let contText = "Press any key to restart"
    if(this.win){
      text = "You Won!"
      contText = "Press any key to continue playing"
    }

    // Put the text on the screen
    fillTextP(text, 10, 50, 50, "black")
    fillTextP("Press any key to continue", 5, 50, 70, "black")
  }

  keydown(e){
    // Press any key to continue; we only restart if the player lost
    if(!this.win){
      numbers = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    }
    currentClient = new gameClient(this.win);
  }
}

// Using extrapolation to deal with the current client
var currentClient = new gameClient();

// MAIN FUNCTION
window.onload = function() {
  initialize();

  document.addEventListener("keydown", keyDown)

  setTimeout(update, 50)
}

// consistent updating - tick + render
function update(){
  // Is called every 50 milliseconds
  currentClient.update()
  setTimeout(update, 50)
}

// rendering
function render(){
  render_grid(numbers)
}

// Given the "arrow" of the input, returns [row, column], the direction in the "step" of the arrow
function getIntervalFromDirection(direction){
  // is in form (rowInterval, columnInterval)
  switch(direction){
    case "ArrowRight":
      return [0, 1]
      break
    case "ArrowLeft":
      return [0, -1]
      break
    case "ArrowDown":
      return [1, 0]
      break
    case "ArrowUp":
      return [-1, 0]
      break
    default:
      return [0, 0]
  }
}

// We either move from the bottom right and progress to the top left or vice versa; given the input direction, this function returns which of the two it is
function getStartingConsider(direction){
  if(direction == "ArrowRight" || direction == "ArrowDown"){
    // If we move right or down, then processing occurs starting at bot right
    return [numSquares - 1, numSquares - 1, -1, -1]
  }else{
    // Otherwise, processing starts at top left
    return [0, 0, 1, 1]
  }
}

// Given the "arrow" of the input, we move the entire board in the direction
// movingArray: the array of starting & ending points for each element - function alters this for render_animation
// creationArray: the array for which elements are newly created - function alters this for render_animation
function move(direction, movingArray, creationArray, numbers){
  var [rowInterval, colInterval] = getIntervalFromDirection(direction)

  var [startingRow, startingCol, rowMove, colMove] = getStartingConsider(direction)

  // We move from the bot-right to top-left or vice versa, depending on direction
  for(var sr = startingRow; numSquares > sr && sr >= 0; sr += rowMove){
    for(var sc = startingCol; numSquares > sc && sc >= 0; sc += rowMove){
      // If there's an element, we keep track of the "current" coordinates
      if(numbers[sr][sc] == 0){
        continue
      }
      var c = sc
      var r = sr
      while(true){
        // The coordinates in the next step
        var nc = c + colInterval
        var nr = r + rowInterval
        // If out of bounds, then element goes to (r, c)
        if(!(0 <= nc && nc < numSquares && 0 <= nr && nr < numSquares)){
          [numbers[r][c], numbers[sr][sc]] = [numbers[sr][sc], numbers[r][c]]
          movingArray.push([numbers[r][c], sr, sc, r, c])
          break
        }
        // If the new coordinates "hit" another element
        if(numbers[nr][nc] != 0){
          // If type is equal, combine
          if(numbers[nr][nc] == numbers[sr][sc]){
            movingArray.push([numbers[sr][sc], sr, sc, nr, nc])
            numbers[nr][nc]++
            numbers[sr][sc] = 0
            creationArray.push([numbers[nr][nc], nr, nc])
            break;
          }else{
            // If type is unequal, we stop right before it
            [numbers[r][c], numbers[sr][sc]] = [numbers[sr][sc], numbers[r][c]]
            movingArray.push([numbers[r][c], sr, sc, r, c])
            break
          }
        }
        // Update the current coordinates
        [c, r] = [nc, nr]
      }
    }
  }
}

// Handles when a key is pressed down
function keyDown(e){
  currentClient.keydown(e);
}

// returns a random empty coordinate
function randomEmpty(){
  // All of the possible coordinates
  possibles = []
  for(let r = 0; r < numSquares; ++r){
    for(let c = 0; c < numSquares; ++c){
      if(numbers[r][c] == 0){
        possibles.push([r, c])
      }
    }
  }

  // return a random one
  return possibles[Math.floor(Math.random() * possibles.length)]
}
