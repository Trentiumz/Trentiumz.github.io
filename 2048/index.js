// numbers[row][column] = val, where then number is 2^{val}
var numbers = [[0, 0, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]

const numSquares = 4;

// Bootleg enums
const directions = Object.freeze({
  "right": 0,
  "left": 1,
  "up": 2,
  "down": 3
})

window.onload = function() {
  initialize();

  document.addEventListener("keydown", keyDown)

  setTimeout(update, 50)
}

function update(){
  if(!handlingAnimation){
    render();
  }
  setTimeout(update, 50);
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

function move(direction, movingArray, creationArray){
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
  if(handlingAnimation){
    return;
  }
  [mr, mc] = getIntervalFromDirection(e.code)
  if(mr == 0 && mc == 0){
    return
  }

  var movingArray = []
  var creationArray = []
  move(e.code, movingArray, creationArray)
  if(movingArray.every(element => element[1] == element[3] && element[2] == element[4]) && creationArray.length == 0){
    return;
  }

  let [r, c] = randomEmpty()
  numbers[r][c] = 1
  creationArray.push([1, r, c])

  var [moveEncoded, creationEncoded] = encode(movingArray, creationArray)
  render_animation(moveEncoded, creationEncoded)
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
