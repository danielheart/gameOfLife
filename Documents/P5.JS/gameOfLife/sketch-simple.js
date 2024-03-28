let cols, rows
let grid
const resolution = 1
let cellsGrid
let fps = 60
let addDot = true
function preload() {
   loadStrings('data.txt', pickStrings)
}
function pickStrings(rawData) {
   let infoIndex = 0
   for (let item of rawData) {
      if (item.startsWith('!')) {
         infoIndex++
      } else {
         rawData.splice(0, infoIndex)
         break // 停止遍历
      }
   }
   console.log(rawData)
   cellsGrid = rawData.map((line) =>
      line.split('').map((char) => (char === 'O' ? 1 : 0)),
   )
   console.log(cellsGrid)
}
function setup() {
   createCanvas(windowWidth, windowHeight)
   cols = floor(width / resolution)
   rows = floor(height / resolution)
   grid = createEmptyGrid(cols, rows)
   //createCells(cellsGrid)
   background(27)
   //noLoop()
   frameRate(fps)
   fill(50)
   noStroke()
}
function draw() {
   background(30)
   // 绘制细胞
   for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
         const x = i * resolution
         const y = j * resolution

         if (grid[i][j] === 1) {
            rect(x, y, resolution, resolution)
         }
      }
   }
   // 显示帧率
   fps = floor(frameRate())
   text(fps+', '+String(addDot), 20, 20)

   //更新细胞状态
   const next = createEmptyGrid(cols, rows)
   for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
         const state = grid[i][j]
         const neighbors = countNeighbors(grid, i, j)
         if (state === 0 && neighbors === 3) {
            next[i][j] = 1
         } else if (state === 1 && (neighbors < 2 || neighbors > 3)) {
            next[i][j] = 0
         } else {
            next[i][j] = state
         }
      }
   }
   grid = next
   if (addDot) fluctuate()
}
function keyPressed() {
   if (key >= '0' && key <= '9') {
      fps = int(key) * 7
   }

   if (keyCode === DOWN_ARROW) {
      fps = fps > 1 ? fps - 1 : 0
   } else if (keyCode === UP_ARROW) {
      fps = fps < 60 ? fps + 1 : 60
   }
   if(key == 'f') addDot = !addDot
   console.log(fps)
   frameRate(fps)
}
function createRandomGrid(cols, rows) {
   const grid = new Array(cols)
   for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows)
      for (let j = 0; j < rows; j++) {
         //grid[i][j] = floor(random(1.05))
         grid[i][j] = 0
      }
   }
   return grid
}
function fluctuate() {
   for (let i = 0; i < 2000; i++) {
      const x = floor(random(cols))
      const y = floor(random(rows))
      grid[x][y] = 1
   }
   for (let i = 0; i < 2000; i++) {
      const x = floor(random(cols))
      const y = floor(random(rows))
      grid[x][y] = 0
   }
}
function createCells() {
   const row = cellsGrid.length
   const col = cellsGrid[0].length
   for (let i = 0; i < col; i++)
      for (let j = 0; j < row; j++) {
         const idx = i + floor(cols / 2) - floor(col / 2)
         const idy = j + floor(rows / 2) - floor(row / 2)
         if (cellsGrid[j][i] === 1) grid[idx][idy] = 1
      }
}

function countNeighbors(grid, x, y) {
   let sum = 0
   for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
         const col = (x + i + cols) % cols
         const row = (y + j + rows) % rows
         sum += grid[col][row]
      }
   }
   sum -= grid[x][y]
   return sum
}

function createEmptyGrid(cols, rows) {
   const grid = new Array(cols)
   for (let i = 0; i < cols; i++) {
      grid[i] = new Array(rows).fill(0)
   }
   return grid
}
