let currentPlayer = 'X'; // El jugador que va a iniciar
let gameOver = false; // Flag para verificar si el juego terminó
let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

function setup() {
  const boardContainer = document.getElementById('board-container');

  // Limpiar el contenedor del tablero
  boardContainer.innerHTML = '';

  // Crear 9 celdas del tablero (3x3)
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i); // Añadir índice de la celda
    cell.addEventListener('click', () => handleClick(i));
    boardContainer.appendChild(cell);
  }

  // Actualizar el texto del jugador actual
  updateCurrentPlayer();
}

function handleClick(index) {
  if (gameOver) return; // Si el juego terminó, no hacer nada

  const row = Math.floor(index / 3); // Calcular la fila
  const col = index % 3; // Calcular la columna

  // Si la celda está vacía, colocar el símbolo del jugador
  if (board[row][col] === '') {
    board[row][col] = currentPlayer; // Coloca la marca del jugador
    updateBoard(); // Actualizar el tablero visual
    checkWinner(); // Verificar si alguien ganó después de colocar la marca
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X'; // Cambiar de jugador
    updateCurrentPlayer(); // Actualizar el texto del jugador actual
  }
}

function updateBoard() {
  const cells = document.querySelectorAll('.cell');

  // Limpiar el contenido de cada celda antes de colocar una imagen
  cells.forEach(cell => {
    cell.innerHTML = '';
  });

  // Llenar las celdas con las imágenes correspondientes
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    const cell = cells[i];

    if (board[row][col] === 'X') {
      const img = document.createElement('img');
      img.src = 'img/perrito.png'; // Ruta de la imagen del perrito
      img.alt = 'Cara de perrito';
      img.classList.add('icon');
      cell.appendChild(img);
    } else if (board[row][col] === 'O') {
      const img = document.createElement('img');
      img.src = 'img/gatica.png'; // Ruta de la imagen de la gatica
      img.alt = 'Cara de gatica';
      img.classList.add('icon');
      cell.appendChild(img);
    }
  }
}


function updateCurrentPlayer() {
  document.getElementById('currentPlayer').textContent = currentPlayer;
}

function checkWinner() {
  // Revisa filas, columnas y diagonales para ver si hay un ganador
  for (let i = 0; i < 3; i++) {
    // Filas
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
      gameOver = true;
      setTimeout(() => alert(`${board[i][0]} ganó!`), 100); // Añadir un retraso para que se vea la jugada
      return;
    }
    // Columnas
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
      gameOver = true;
      setTimeout(() => alert(`${board[0][i]} ganó!`), 100); // Añadir un retraso para que se vea la jugada
      return;
    }
  }

  // Diagonales
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
    gameOver = true;
    setTimeout(() => alert(`${board[0][0]} ganó!`), 100); // Añadir un retraso para que se vea la jugada
    return;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
    gameOver = true;
    setTimeout(() => alert(`${board[0][2]} ganó!`), 100); // Añadir un retraso para que se vea la jugada
    return;
  }

  // Verificar empate
  if (board.flat().every(cell => cell !== '')) {
    gameOver = true;
    setTimeout(() => alert('¡Es un empate!'), 100); // Añadir un retraso para que se vea la jugada
  }
}

// Reiniciar el juego
document.getElementById('reset-button').addEventListener('click', () => {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ];
  currentPlayer = 'X';
  gameOver = false;
  updateBoard(); // Actualizar tablero
  updateCurrentPlayer(); // Mostrar jugador actual
});

// Iniciar el juego
setup();
