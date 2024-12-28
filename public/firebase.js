// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCb7bvHardr3x4Sqv9pSb8EYBWw7Tq0Q2Q",
  authDomain: "juego-de-triqui.firebaseapp.com",
  projectId: "juego-de-triqui",
  storageBucket: "juego-de-triqui.firebasestorage.app",
  messagingSenderId: "510617105718",
  appId: "1:510617105718:web:fe099bbcaf556c8656af97"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Generar ID única para el juego
function generateGameId() {
  return 'game_' + Math.random().toString(36).substr(2, 9);
}

// Exportar la función para usarla en el juego
export { generateGameId, database };