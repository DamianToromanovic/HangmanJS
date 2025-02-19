import rs from "readline-sync";

import { words } from "./wordsAndHangman.js";

import { hangmanGraphics } from "./wordsAndHangman.js";

let word;
let wordArray;
let guessedLetters = [];
let incorrectGuesses = [];
let remainingTries = 6;

const generateNewWord = () => {
  word = words[Math.floor(Math.random() * words.length)];
  wordArray = word.split("");
};

const displayWord = () => {
  let display = "";
  for (let letter of wordArray) {
    display += guessedLetters.includes(letter) ? letter : "*";
  }
  console.log("Your word: ", display);
};

const checkChar = () => {
  let char;
  while (true) {
    char = rs
      .question("Type in a char (or type 'hint' for a hint): ")
      .toLowerCase();

    if (char === "hint") {
      if (remainingTries > 2) {
        hint();
      } else {
        console.log("You don't have enough tries left to get a hint.");
      }
    } else if (char.length !== 1 || !/^[a-z]$/.test(char)) {
      console.log("Invalid input! Please enter a single letter.");
    } else if (
      incorrectGuesses.includes(char) ||
      guessedLetters.includes(char)
    ) {
      console.log("Please concentrate, you already tried this char!");
    } else if (word.includes(char)) {
      console.clear();
      displayHangman();
      console.log("You were right!");
      guessedLetters.push(char);
      displayWord();
      console.log(`Remaining Tries: ${remainingTries}`);
      break;
    } else if (!word.includes(char) && remainingTries > 0) {
      console.clear();
      console.log("You were wrong!");
      incorrectGuesses.push(char);
      remainingTries--;
      displayHangman();
      displayWord();
      console.log(`Remaining Tries: ${remainingTries}`);
      break;
    }
  }
};

const questionLoop = () => {
  while (true)
    if (checkWin()) {
      console.log("Congratulations! You have won! The word was : " + word);
      endGameMenu();
    } else if (remainingTries === 0) {
      console.log(`Game over, the word was ${word}`);
      endGameMenu();
    } else if (remainingTries === 1) {
      console.log("Just one guess left!");
      checkChar();
    } else if (remainingTries > 0 && !checkWin()) {
      checkChar();
    }
};

const checkWin = () => {
  return wordArray.every((letter) => guessedLetters.includes(letter));
};

const menu = () => {
  console.clear();
  console.log("Welcome to Hangman!\n");
  displayWord();
  questionLoop();
};

const displayHangman = () => {
  console.log(hangmanGraphics[6 - remainingTries]);
};

const startMenu = () => {
  console.clear();
  console.log("\nWelcome to Hangman!");
  console.log("1. Start Game");
  console.log("2. Exit Game");
  console.log("3. Show Rules");

  const choice = rs.question("Choose an option (1, 2, or 3): ");

  if (choice === "1") {
    generateNewWord();
    menu();
  } else if (choice === "2") {
    console.log("Thanks for playing! Goodbye!");
    process.exit();
  } else if (choice === "3") {
    showRules();
  } else {
    console.log("Invalid choice, please try again.");
    startMenu();
  }
};

const showRules = () => {
  console.clear();
  console.log("Hangman Game Rules:");
  console.log("1. You need to guess a word by entering letters.");
  console.log("2. You have 6 tries to guess the word.");
  console.log("3. For each wrong letter, a part of the hangman is drawn.");
  console.log("4. The game ends when you guess the word or run out of tries.");
  console.log("\nPress any key to return to the main menu.");
  rs.question("");
  startMenu();
};

const hint = () => {
  remainingTries -= 2;
  for (let i = 0; i < wordArray.length; i++) {
    if (!guessedLetters.includes(wordArray[i])) {
      guessedLetters.push(wordArray[i]);
      break;
    }
  }
  console.clear();
  displayHangman();
  console.log("A hint has been given! 2 tries have been deducted.");
  displayWord();
  console.log(`Remaining Tries: ${remainingTries}`);
};

const endGameMenu = () => {
  console.log("Do you want to play again?");
  console.log("1. Yes");
  console.log("2. No, Exit Game");

  const choice = rs.question("Choose an option (1 or 2): ");
  if (choice === "1") {
    remainingTries = 6;
    generateNewWord();
    guessedLetters.splice(0, guessedLetters.length);
    incorrectGuesses.splice(0, incorrectGuesses.length);

    menu();
  } else if (choice === "2") {
    console.log("Thanks for playing! Goodbye!");
    process.exit();
  } else {
    console.log("Invalid choice. Please try again.");
    endGameMenu();
  }
};

startMenu();
