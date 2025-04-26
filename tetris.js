document.addEventListener('DOMContentLoaded', () => {
    const tetrisToggle = document.getElementById('tetris-toggle');
    const terminalView = document.getElementById('terminal-view');
    const tetrisView = document.getElementById('tetris-view');
    
    let tetrisActive = false;
    let tetrisGame = null;
    
    tetrisToggle.addEventListener('click', () => {
      if (tetrisActive) {
        // Switch back to terminal
        tetrisView.style.display = 'none';
        terminalView.style.display = 'block';
        tetrisToggle.textContent = 'Play Tetris';
        document.body.classList.remove('tetris-active');
        
        // Stop the game if it's running
        if (tetrisGame) {
          tetrisGame.stop();
        }
      } else {
        // Switch to Tetris
        terminalView.style.display = 'none';
        tetrisView.style.display = 'flex';
        tetrisToggle.textContent = 'Show Terminal';
        document.body.classList.add('tetris-active');
        
        // Initialize or restart the game
        if (!tetrisGame) {
          tetrisGame = new TetrisGame();
        } else {
          tetrisGame.start();
        }
      }
      
      tetrisActive = !tetrisActive;
    });
    
    // Tetris Game Implementation
    class TetrisGame {
      constructor() {
        this.board = document.querySelector('.tetris-board');
        this.nextPieceDisplay = document.querySelector('.tetris-next-piece');
        this.scoreElement = document.getElementById('tetris-score-value');
        this.levelElement = document.getElementById('tetris-level-value');
        this.linesElement = document.getElementById('tetris-lines-value');
        
        this.boardWidth = 10;
        this.boardHeight = 20;
        this.grid = [];
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.paused = false;
        this.gameInterval = null;
        this.currentPiece = null;
        this.nextPiece = null;
        this.speed = 500; // Initial speed in ms
        
        this.pieces = [
          { type: 'i', color: 'piece-i', shape: [[1, 1, 1, 1]], rotations: 2 },
          { type: 'j', color: 'piece-j', shape: [[1, 0, 0], [1, 1, 1]], rotations: 4 },
          { type: 'l', color: 'piece-l', shape: [[0, 0, 1], [1, 1, 1]], rotations: 4 },
          { type: 'o', color: 'piece-o', shape: [[1, 1], [1, 1]], rotations: 1 },
          { type: 's', color: 'piece-s', shape: [[0, 1, 1], [1, 1, 0]], rotations: 2 },
          { type: 't', color: 'piece-t', shape: [[0, 1, 0], [1, 1, 1]], rotations: 4 },
          { type: 'z', color: 'piece-z', shape: [[1, 1, 0], [0, 1, 1]], rotations: 2 }
        ];
        
        this.initializeBoard();
        this.setupEventListeners();
        this.start();
      }
      
      initializeBoard() {
        // Clear the board
        this.board.innerHTML = '';
        this.nextPieceDisplay.innerHTML = '';
        
        // Create grid cells
        this.grid = Array(this.boardHeight).fill().map(() => Array(this.boardWidth).fill(0));
        
        for (let y = 0; y < this.boardHeight; y++) {
          for (let x = 0; x < this.boardWidth; x++) {
            const cell = document.createElement('div');
            cell.className = 'tetris-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            this.board.appendChild(cell);
          }
        }
        
        // Create next piece display cells
        for (let y = 0; y < 4; y++) {
          for (let x = 0; x < 4; x++) {
            const cell = document.createElement('div');
            cell.className = 'tetris-cell';
            cell.dataset.x = x;
            cell.dataset.y = y;
            this.nextPieceDisplay.appendChild(cell);
          }
        }
      }
      
      setupEventListeners() {
        // Use keydown event with preventDefault to stop page scrolling
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
      }
      
      handleKeyPress(e) {
        if (this.gameOver || this.paused || !tetrisActive) return;
        
        // Handle arrow keys and prevent default scrolling behavior when tetris is active
        switch(e.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'ArrowDown':
          case 'ArrowUp':
          case ' ': // Space key
            e.preventDefault(); // Prevent scrolling
            break;
        }
        
        switch(e.key) {
          case 'ArrowLeft':
            this.movePieceLeft();
            break;
          case 'ArrowRight':
            this.movePieceRight();
            break;
          case 'ArrowDown':
            this.movePieceDown();
            break;
          case 'ArrowUp':
            this.rotatePiece();
            break;
          case ' ':
            this.hardDrop();
            break;
          case 'p':
            this.togglePause();
            break;
        }
      }
      
      start() {
        this.gameOver = false;
        this.paused = false;
        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.updateScore();
        
        this.initializeBoard();
        this.generateNewPiece();
        this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
      }
      
      stop() {
        clearInterval(this.gameInterval);
        this.gameOver = true;
      }
      
      togglePause() {
        if (this.paused) {
          this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
        } else {
          clearInterval(this.gameInterval);
        }
        this.paused = !this.paused;
      }
      
      gameLoop() {
        if (!this.movePieceDown()) {
          this.placePiece();
          const linesCleared = this.checkLines();
          if (linesCleared > 0) {
            this.updateScore(linesCleared);
          }
          if (!this.generateNewPiece()) {
            this.stop();
            alert('Game Over! Your score: ' + this.score);
          }
        }
      }
      
      generateNewPiece() {
        // Get a random piece
        const randomPiece = this.pieces[Math.floor(Math.random() * this.pieces.length)];
        
        if (!this.nextPiece) {
          this.nextPiece = this.clonePiece(randomPiece);
        }
        
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.clonePiece(randomPiece);
        
        // Starting position
        this.currentPiece.x = Math.floor((this.boardWidth - this.currentPiece.shape[0].length) / 2);
        this.currentPiece.y = 0;
        this.currentPiece.rotation = 0;
        
        this.drawNextPiece();
        
        // Check if the new piece can be placed
        if (!this.isValidMove(this.currentPiece.x, this.currentPiece.y, this.currentPiece.shape)) {
          return false;
        }
        
        this.drawPiece();
        return true;
      }
      
      clonePiece(piece) {
        return {
          type: piece.type,
          color: piece.color,
          shape: JSON.parse(JSON.stringify(piece.shape)),
          rotations: piece.rotations,
          x: 0,
          y: 0,
          rotation: 0
        };
      }
      
      drawPiece() {
        this.clearPiece();
        
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
          for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
            if (this.currentPiece.shape[y][x]) {
              const boardX = this.currentPiece.x + x;
              const boardY = this.currentPiece.y + y;
              
              if (boardY >= 0) { // Only draw if it's on the board
                const cell = this.board.querySelector(`.tetris-cell[data-x="${boardX}"][data-y="${boardY}"]`);
                if (cell) {
                  cell.classList.add('filled', this.currentPiece.color);
                }
              }
            }
          }
        }
      }
      
      clearPiece() {
        const cells = this.board.querySelectorAll('.tetris-cell.filled:not(.placed)');
        cells.forEach(cell => {
          cell.classList.remove('filled', 'piece-i', 'piece-j', 'piece-l', 'piece-o', 'piece-s', 'piece-t', 'piece-z');
        });
      }
      
      drawNextPiece() {
        // Clear next piece display
        const cells = this.nextPieceDisplay.querySelectorAll('.tetris-cell');
        cells.forEach(cell => {
          cell.classList.remove('filled', 'piece-i', 'piece-j', 'piece-l', 'piece-o', 'piece-s', 'piece-t', 'piece-z');
        });
        
        // Draw the next piece centered
        const piece = this.nextPiece;
        const offsetX = Math.floor((4 - piece.shape[0].length) / 2);
        const offsetY = Math.floor((4 - piece.shape.length) / 2);
        
        for (let y = 0; y < piece.shape.length; y++) {
          for (let x = 0; x < piece.shape[y].length; x++) {
            if (piece.shape[y][x]) {
              const displayX = offsetX + x;
              const displayY = offsetY + y;
              const cell = this.nextPieceDisplay.querySelector(`.tetris-cell[data-x="${displayX}"][data-y="${displayY}"]`);
              if (cell) {
                cell.classList.add('filled', piece.color);
              }
            }
          }
        }
      }
      
      isValidMove(newX, newY, shape) {
        for (let y = 0; y < shape.length; y++) {
          for (let x = 0; x < shape[y].length; x++) {
            if (shape[y][x]) {
              const boardX = newX + x;
              const boardY = newY + y;
              
              // Check if out of bounds
              if (boardX < 0 || boardX >= this.boardWidth || boardY >= this.boardHeight) {
                return false;
              }
              
              // Check if cell is already occupied (only if the piece is on the board)
              if (boardY >= 0 && this.grid[boardY][boardX]) {
                return false;
              }
            }
          }
        }
        return true;
      }
      
      movePieceLeft() {
        if (this.isValidMove(this.currentPiece.x - 1, this.currentPiece.y, this.currentPiece.shape)) {
          this.currentPiece.x--;
          this.drawPiece();
          return true;
        }
        return false;
      }
      
      movePieceRight() {
        if (this.isValidMove(this.currentPiece.x + 1, this.currentPiece.y, this.currentPiece.shape)) {
          this.currentPiece.x++;
          this.drawPiece();
          return true;
        }
        return false;
      }
      
      movePieceDown() {
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y + 1, this.currentPiece.shape)) {
          this.currentPiece.y++;
          this.drawPiece();
          return true;
        }
        return false;
      }
      
      hardDrop() {
        while (this.movePieceDown()) {
          // Keep moving down until it can't move anymore
        }
        this.placePiece();
        const linesCleared = this.checkLines();
        if (linesCleared > 0) {
          this.updateScore(linesCleared);
        }
        if (!this.generateNewPiece()) {
          this.stop();
          alert('Game Over! Your score: ' + this.score);
        }
      }
      
      rotatePiece() {
        if (this.currentPiece.rotations === 1) return; // Don't rotate O piece
        
        const rotatedShape = this.getRotatedShape(this.currentPiece.shape);
        
        // Try rotation with wall kicks
        const kicks = [-1, 1, -2, 2]; // Left, right, two left, two right
        
        if (this.isValidMove(this.currentPiece.x, this.currentPiece.y, rotatedShape)) {
          this.currentPiece.shape = rotatedShape;
          this.drawPiece();
          return true;
        }
        
        // Try wall kicks
        for (const kick of kicks) {
          if (this.isValidMove(this.currentPiece.x + kick, this.currentPiece.y, rotatedShape)) {
            this.currentPiece.x += kick;
            this.currentPiece.shape = rotatedShape;
            this.drawPiece();
            return true;
          }
        }
        
        return false;
      }
      
      getRotatedShape(shape) {
        const rows = shape.length;
        const cols = shape[0].length;
        const rotated = Array(cols).fill().map(() => Array(rows).fill(0));
        
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            rotated[c][rows - 1 - r] = shape[r][c];
          }
        }
        
        return rotated;
      }
      
      placePiece() {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
          for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
            if (this.currentPiece.shape[y][x]) {
              const boardX = this.currentPiece.x + x;
              const boardY = this.currentPiece.y + y;
              
              if (boardY >= 0) { // Only place if it's on the board
                // Update the grid
                this.grid[boardY][boardX] = this.currentPiece.color;
                
                // Update the visual
                const cell = this.board.querySelector(`.tetris-cell[data-x="${boardX}"][data-y="${boardY}"]`);
                if (cell) {
                  cell.classList.add('placed');
                }
              }
            }
          }
        }
      }
      
      checkLines() {
        let linesCleared = 0;
        
        for (let y = this.boardHeight - 1; y >= 0; y--) {
          if (this.grid[y].every(cell => cell !== 0)) {
            // Line is complete
            this.clearLine(y);
            this.moveDownLines(y);
            y++; // Check the same row again after moving lines down
            linesCleared++;
          }
        }
        
        return linesCleared;
      }
      
      clearLine(y) {
        for (let x = 0; x < this.boardWidth; x++) {
          this.grid[y][x] = 0;
          const cell = this.board.querySelector(`.tetris-cell[data-x="${x}"][data-y="${y}"]`);
          if (cell) {
            cell.classList.remove('filled', 'placed', 'piece-i', 'piece-j', 'piece-l', 'piece-o', 'piece-s', 'piece-t', 'piece-z');
          }
        }
      }
      
      moveDownLines(clearedY) {
        for (let y = clearedY; y > 0; y--) {
          for (let x = 0; x < this.boardWidth; x++) {
            this.grid[y][x] = this.grid[y-1][x];
            
            const targetCell = this.board.querySelector(`.tetris-cell[data-x="${x}"][data-y="${y}"]`);
            const sourceCell = this.board.querySelector(`.tetris-cell[data-x="${x}"][data-y="${y-1}"]`);
            
            if (targetCell && sourceCell) {
              // Copy classes from source to target
              if (sourceCell.classList.contains('filled')) {
                targetCell.classList.add('filled');
                targetCell.classList.add('placed');
                
                // Copy piece type
                ['piece-i', 'piece-j', 'piece-l', 'piece-o', 'piece-s', 'piece-t', 'piece-z'].forEach(pieceClass => {
                  if (sourceCell.classList.contains(pieceClass)) {
                    targetCell.classList.add(pieceClass);
                  }
                });
              } else {
                targetCell.classList.remove('filled', 'placed', 'piece-i', 'piece-j', 'piece-l', 'piece-o', 'piece-s', 'piece-t', 'piece-z');
              }
              
              // Clear the top row
              sourceCell.classList.remove('filled', 'placed', 'piece-i', 'piece-j', 'piece-l', 'piece-o', 'piece-s', 'piece-t', 'piece-z');
            }
          }
        }
        
        // Clear the top row in the grid
        for (let x = 0; x < this.boardWidth; x++) {
          this.grid[0][x] = 0;
        }
      }
      
      updateScore(linesCleared = 0) {
        if (linesCleared > 0) {
          // Scoring system
          const points = [40, 100, 300, 1200]; // Points for 1, 2, 3, 4 lines
          this.score += points[linesCleared - 1] * this.level;
          
          this.lines += linesCleared;
          
          // Level up every 10 lines
          const newLevel = Math.floor(this.lines / 10) + 1;
          if (newLevel > this.level) {
            this.level = newLevel;
            this.speed = Math.max(100, 500 - (this.level - 1) * 50); // Spee
            this.level = newLevel;
          this.speed = Math.max(100, 500 - (this.level - 1) * 50); // Speed increases with level
          
          // Update game speed
          clearInterval(this.gameInterval);
          this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
        }
      }
      
      // Update display
      this.scoreElement.textContent = this.score;
      this.levelElement.textContent = this.level;
      this.linesElement.textContent = this.lines;
    }
  }
  
  // Initialize the game when switching to Tetris view for the first time
  tetrisToggle.dispatchEvent(new Event('click'));
});
