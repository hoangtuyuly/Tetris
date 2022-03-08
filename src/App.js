import './App.css';
import React, {useState, useCallback, useEffect} from 'react'
import Node from './Node';
import {randomBrick} from './brick.js'
import {GameScore} from './gameScore.js'
import {SetTimeOut} from './SetTimeOut.js'

const numRows = 20;
const numCollums = 10;

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = []
    for (let i = 0; i < numRows; i++) {
      const currentRow = []
      for (let j = 0; j < numCollums; j++) {
        const node = {
          type: false,
          status: 'clear',
          color: "#c3d4f9"
        }
      currentRow.push(node)
      }
    rows.push(currentRow)
    }
    return rows
  })

  const [gameOver, setGameOver, score, setScore, level, setLevel] = GameScore()
  const [player, setPlayer] = useState({
    position: {x: numCollums/2 - 2, y: 0},
    brick: null,
    collided: false,
    color: null
  })
  const [fullRows, setFullRows] = useState(0)
  const [time, setTime] = useState(null)

  const resetPlayer = useCallback(async() => {
    const tetromino = await randomBrick()
    setPlayer({
      position: {x: numCollums/2 - 2, y: 0},
      brick: tetromino.shape,
      collided: false,
      color: tetromino.color
    })
  }, [])

  const resetStage = () => {
    const newGrid = [...grid]
    grid.map((rows, i) => 
      rows.map((node, j) => (
        grid[i][j]['type'] = false,
        grid[i][j]['color'] = "#c3d4f9",
        grid[i][j]['status'] = 'clear'
      )))
    setGrid(newGrid)
  }


  const clearRow = () => {
    for (let i = 0; i < numRows; i++){
      let isFilled = true
      for (let j = 0; j <numCollums; j++) {
        if (grid[i][j]['status'] !== 'merged') {
          isFilled = false
        }
      }
      if (isFilled === true) {
        //clear fullRow
        for (let j = 0; j <numCollums; j++) {
          grid[i][j]['status'] = 'clear'
          grid[i][j]['type'] = false
          grid[i][j]['color'] = "#c3d4f9"
        }

        //move down all row above
        for (let x = i; x > 1; x--) {
          for (let y = 0; y < numCollums; y++) {
            grid[x][y]['status'] = grid[x-1][y]['status']
            grid[x][y]['type'] = grid[x-1][y]['type']
            grid[x][y]['color'] = grid[x-1][y]['color']

            //clear top row
            grid[0][y]['status'] = 'clear'
            grid[0][y]['type'] = false
            grid[0][y]['color'] = "#c3d4f9"
          }
        }

      setScore(state => state += 10)
      }
    }
  }

  useEffect(() => {
    //clear full rows
    setFullRows(0)

    //remove pre terminos
    const updateState = [...grid]
      grid.map((rows, i) => 
        rows.map((node, j) => {
          if (grid[i][j]['status'] === 'clear') {
            grid[i][j]['type'] = false
            grid[i][j]['color'] = "#c3d4f9"
          }
        }
      ))

    //draw on-moving terminos
    if (player.brick !== null) {
    player.brick.forEach((row, i) => {
      row.forEach((node, j) => {
        if (node !== 0) {
          const x_coor = j + player.position.x
          const y_coor = i + player.position.y
          grid[y_coor][x_coor]['type'] = true
          grid[y_coor][x_coor]['color'] = player.color
          if (player.collided === true) {
            grid[y_coor][x_coor]['status'] = 'merged'
          }
        }
      })
    })}

    if (player.collided === true) {
      resetPlayer()
      clearRow()
    }

    setGrid(updateState);


  }, [player.position,
      player.brick,
      player.collided])

  const start = async() => {
    resetStage()
    resetPlayer()
    setGameOver(false)
    setTime(1000)
    setFullRows(0);
    setScore(0);
  }

  const updatePos = ({x, y, collided}) => {
    setPlayer(state => ({
      ...state,
      position: {x: (state.position.x += x/2), y: (state.position.y += y/2)},
      collided,
    }))
  }


  const validMoveCheck = (tetromino, {x: moveX, y: moveY}) => {
    for (let i = 0; i < tetromino.brick.length; i++) {
      for (let j = 0; j < tetromino.brick[i].length; j++) {
        if (tetromino.brick[i][j] !== 0) {
          const y_coor = i + tetromino.position.y + moveY
          const x_coor = j + tetromino.position.x + moveX
          if (
            (y_coor < 0 || y_coor > numRows-1 || x_coor < 0 || x_coor > numCollums-1) 
            || (grid[y_coor][x_coor]['status'] !== 'clear')) 
          {
            return false
          }
        }
      }
    }
    return true
  }

  const movePlayer = (dir) => {
    if (player.brick) { 
      if (validMoveCheck(player, {x: dir, y: 0})) {
      updatePos({x: dir, y: 0})
      }}
  }

  const dropPlayer = () => {
    if (!gameOver && player.brick) { 
      if (validMoveCheck(player, {x: 0, y: 1})) {
        updatePos({x: 0, y: 1, collided: false})
      } else {
        if (player.position.y < 1) {
          console.log('Game Over')
          setGameOver(true)
        }
        updatePos({x: 0, y: 0, collided: true})
      }
    }
  }

  SetTimeOut(() => {
    dropPlayer();
  }, time)

  const rotate = async(matrix) => {
      const rotatedMatrix = await matrix[0].map((val, index) => 
        matrix.map(row => row[index]).reverse())
      return rotatedMatrix
  }

  const offsetReturn = (tetromino) => {
    let offset = 0
    if (validMoveCheck(tetromino, {x: 0, y: 0}) !== true) {
      console.log(offset)
      if (tetromino.position.x > numCollums/2) {
        offset = -1
      } else if (tetromino.position.x < numCollums/2) {
        offset = 1
      } 
    }
    return offset
  }

  const rotatePlayer = async() => {
    const playerCopi = await JSON.parse(JSON.stringify(player))
    const offset = offsetReturn(playerCopi)
    playerCopi.brick = await rotate(playerCopi.brick)

    if (validMoveCheck(playerCopi, {x: offset, y: 0})) {
    setPlayer(state=> ({
      ...state,
      brick: playerCopi.brick,
      position: {x: (state.position.x += offset), y: (state.position.y)},
    }))}
  } 

  const playerInput = ({keyCode}) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1)
      } else if (keyCode === 40) {
        dropPlayer()
      } else if (keyCode === 38) {
        rotatePlayer()
      }
    }
  }
    
  return (
    <div className="App"
      role="button"
      tabIndex="0"
      onKeyDown={e => playerInput(e)}>

      <div className="board"
      style = {{
        display: "grid",
        gridTemplateColumns: `repeat(${numCollums}, 30px)`
      }}
      >
        {grid.map((rows, i) => 
          rows.map((node, j) => {
            const {type, color} = node;
            return (
              <div className='node'>
                <Node 
                  type = {type}
                  color = {color}
                />
              </div>
            )
          })
        )}
      </div>

    <button onClick={() => {start()}}>Start</button>
    <div>SCORE: {score} </div>
    </div>
  );
}

export default App;
