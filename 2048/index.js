// numbers[row][column] = val, where then number is 2^{val}
var numbers = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

const numSquares = 4;

class gameClient{
  constructor(freeplay = false){
    this.freeplay = freeplay
  }
  update(){
    document.getElementById("score").innerHTML = "Score: " + this.getSum();
    if(!handlingAnimation){
      render();
    }
    if(!this.hasMoves()){
      currentClient = new finishedClient(false)
      return
    }
  }
  getSum(){
    let s = 0;
    for(let i = 0; i < numSquares; ++i){
      for(let c = 0; c < numSquares; ++c){
        s += numbers[i][c] != 0 ? 1 << numbers[i][c] : 0
      }
    }
    return s;
  }
  hasMoves(){
    for(let direction of ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"]){
      let tma = []
      let tca = []
      move(direction, tma, tca, JSON.parse(JSON.stringify(numbers)))
      if(!tma.every(e => e[1] == e[3] && e[2] == e[4])){
        return true
        break
      }
    }
    return false
  }
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

class finishedClient{
  constructor(didWin){
    this.win = didWin;
  }

  update(){
    render()
    drawImageP(10, 10, 80, 80, "textBox", 0.6)

    let text = "You Lost!"
    let contText = "Press any key to restart"
    if(this.win){
      text = "You Won!"
      contText = "Press any key to continue playing"
    }

    fillTextP(text, 10, 50, 50, "black")
    fillTextP("Press any key to continue", 5, 50, 70, "black")
  }

  keydown(e){
    if(!this.win){
      numbers = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]
    }
    currentClient = new gameClient(this.win);
  }
}

var currentClient = new gameClient();

window.onload = function() {
  initialize();

  document.addEventListener("keydown", keyDown)

  setTimeout(update, 50)
}

function update(){
  currentClient.update()
  setTimeout(update, 50)
}

function render(){
  render_grid(numbers)
}

function getIntervalFromDirection(direction){
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

function getStartingConsider(direction){
  if(direction == "ArrowRight" || direction == "ArrowDown"){
    return [numSquares - 1, numSquares - 1, -1, -1]
  }else{
    return [0, 0, 1, 1]
  }
}

function move(direction, movingArray, creationArray, numbers){
  var [rowInterval, colInterval] = getIntervalFromDirection(direction)

  var [startingRow, startingCol, rowMove, colMove] = getStartingConsider(direction)

  for(var sr = startingRow; numSquares > sr && sr >= 0; sr += rowMove){
    for(var sc = startingCol; numSquares > sc && sc >= 0; sc += rowMove){
      if(numbers[sr][sc] == 0){
        continue
      }
      var c = sc
      var r = sr
      while(true){
        var nc = c + colInterval
        var nr = r + rowInterval
        if(!(0 <= nc && nc < numSquares && 0 <= nr && nr < numSquares)){
          [numbers[r][c], numbers[sr][sc]] = [numbers[sr][sc], numbers[r][c]]
          movingArray.push([numbers[r][c], sr, sc, r, c])
          break
        }
        if(numbers[nr][nc] != 0){
          if(numbers[nr][nc] == numbers[sr][sc]){
            movingArray.push([numbers[sr][sc], sr, sc, nr, nc])
            numbers[nr][nc]++
            numbers[sr][sc] = 0
            creationArray.push([numbers[nr][nc], nr, nc])
            break;
          }else{
            [numbers[r][c], numbers[sr][sc]] = [numbers[sr][sc], numbers[r][c]]
            movingArray.push([numbers[r][c], sr, sc, r, c])
            break
          }
        }
        [c, r] = [nc, nr]
      }
    }
  }
  return true
}

function keyDown(e){
  currentClient.keydown(e);
}

function randomEmpty(){
  possibles = []
  for(let r = 0; r < numSquares; ++r){
    for(let c = 0; c < numSquares; ++c){
      if(numbers[r][c] == 0){
        possibles.push([r, c])
      }
    }
  }
  return possibles[Math.floor(Math.random() * possibles.length)]
}
