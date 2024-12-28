import { ref, set, onValue } from 'firebase/database';

// Inicialización de Firebase
const database = firebase.database();
const gameRef = database.ref('game');
const boardRef = ref(database, 'game/board');
const currentPlayerRef = ref(database, 'game/currentPlayer');
const playersRef = ref(database, 'game/players');

// Variables del juego
let currentPlayer = 'X'; // Jugador que comienza
let gameOver = false; // Bandera para saber si el juego terminó
let board = [ ['', '', ''], ['', '', ''], ['', '', ''] ]; // Tablero vacío

let player1 = 'Jugador 1'; // Nombre del jugador 1
let player2 = 'Jugador 2'; // Nombre del jugador 2

// Configuración inicial del juego en Firebase
function initializeGame() {
  gameRef.set({
    players: { player1: null, player2: null },
    currentPlayer: 'X', // Jugador inicial
    board: [ ['', '', ''], ['', '', ''], ['', '', ''] ] // Tablero vacío
  })
  .then(() => console.log("Datos iniciales del juego creados correctamente"))
  .catch((error) => console.error("Error al crear datos iniciales: ", error));
}

// Conectar con Firebase y escuchar los cambios en tiempo real
function setupFirebaseListeners() {
  // Escuchar cambios en el tablero
  onValue(boardRef, (snapshot) => {
    const boardData = snapshot.val();
    if (boardData) {
      board = boardData;
      updateBoard(); // Actualizar tablero visual
    }
  });

  // Escuchar cambios en el jugador actual
  onValue(currentPlayerRef, (snapshot) => {
    const currentPlayerData = snapshot.val();
    if (currentPlayerData) {
      currentPlayer = currentPlayerData;
      updateCurrentPlayer(); // Actualizar jugador actual en la interfaz
    }
  });

  // Escuchar cambios en los jugadores
  onValue(playersRef, (snapshot) => {
    const playersData = snapshot.val();
    if (playersData) {
      player1 = playersData.player1 || 'Jugador 1';
      player2 = playersData.player2 || 'Jugador 2';
    }
  });
}

// Configurar el tablero visual
function setupBoard() {
  const boardContainer = document.getElementById('board-container');
  boardContainer.innerHTML = ''; // Limpiar el contenedor del tablero

  // Crear celdas del tablero (3x3)
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i); // Añadir índice de la celda
    cell.addEventListener('click', () => handleCellClick(i)); // Escuchar clic en la celda
    boardContainer.appendChild(cell);
  }

  updateCurrentPlayer(); // Mostrar quién es el jugador actual
}

// Manejar el clic en una celda del tablero
function handleCellClick(index) {
  if (gameOver) return; // Si el juego terminó, no hacer nada
  const row = Math.floor(index / 3);
  const col = index % 3;

  // Verificar si la celda está vacía
  if (board[row][col] !== '') return;

  // Verificar si es el turno del jugador actual
  if ((currentPlayer === 'X' && player1 !== 'Jugador 1') || (currentPlayer === 'O' && player2 !== 'Jugador 2')) {
    alert("No es tu turno!");
    return;
  }

  // Colocar la marca del jugador en la celda
  board[row][col] = currentPlayer;
  set(boardRef, board); // Actualizar el tablero en Firebase
  checkWinner(); // Verificar si hay un ganador
  switchPlayer(); // Cambiar al siguiente jugador
}

// Cambiar el turno al siguiente jugador
function switchPlayer() {
  currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
  set(currentPlayerRef, currentPlayer); // Actualizar el turno en Firebase
  updateCurrentPlayer(); // Actualizar la interfaz con el nuevo jugador
}

// Actualizar el tablero visual en la interfaz
function updateBoard() {
  const cells = document.querySelectorAll('.cell');
  console.log(board); // Verifica el estado del tablero
  for (let i = 0; i < 9; i++) {
    const row = Math.floor(i / 3);
    const col = i % 3;
    cells[i].textContent = board[row][col]; // Actualizar el contenido de la celda
  }
}


// Actualizar el texto del jugador actual
function updateCurrentPlayer() {
  const currentPlayerText = currentPlayer === 'X' ? player1 : player2;
  document.getElementById('currentPlayer').textContent = `Turno de: ${currentPlayerText}`;
}

// Verificar si hay un ganador
function checkWinner() {
  // Comprobar filas, columnas y diagonales
  for (let i = 0; i < 3; i++) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][0] !== '') {
      gameOver = true;
      setTimeout(() => alert(`${board[i][0]} ganó!`), 100);
      return;
    }
    if (board[0][i] === board[1][i] && board[1][i] === board[2][i] && board[0][i] !== '') {
      gameOver = true;
      setTimeout(() => alert(`${board[0][i]} ganó!`), 100);
      return;
    }
  }

  // Comprobar diagonales
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[0][0] !== '') {
    gameOver = true;
    setTimeout(() => alert(`${board[0][0]} ganó!`), 100);
    return;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[0][2] !== '') {
    gameOver = true;
    setTimeout(() => alert(`${board[0][2]} ganó!`), 100);
    return;
  }

  // Comprobar empate
  if (board.flat().every(cell => cell !== '')) {
    gameOver = true;
    setTimeout(() => alert('¡Es un empate!'), 100);
  }
}

// Reiniciar el juego
function resetGame() {
  board = [ ['', '', ''], ['', '', ''], ['', '', ''] ]; // Reiniciar el tablero
  currentPlayer = 'X'; // Reiniciar el jugador
  gameOver = false; // Reiniciar la bandera de fin de juego
  set(boardRef, board); // Actualizar el tablero en Firebase
  set(currentPlayerRef, currentPlayer); // Reiniciar el turno en Firebase
  updateBoard(); // Actualizar el tablero visual
  updateCurrentPlayer(); // Actualizar el jugador actual
}

// Evento para el botón de reiniciar el juego
document.getElementById('reset-button').addEventListener('click', resetGame);

// Iniciar el juego
function startGame() {
  initializeGame(); // Crear datos iniciales en Firebase
  setupFirebaseListeners(); // Configurar los listeners de Firebase
  setupBoard(); // Configurar el tablero visual
}

startGame();
