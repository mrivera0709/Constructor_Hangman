// Set up node apps
var inquirer = require('inquirer');
var isLetter = require('is-letter');
var Word = require('./word.js');
var Game = require('./game.js');

var hangManDisplay = Game.newWord.hangman;

//set the maxListener
require('events').EventEmitter.prototype._maxListeners = 100;


var hangman = 
  {
  wordBank: Game.newWord.wordList,
  guessesRemaining: 10,
  //empty array to hold letters guessed by user. And checks if the user guessed the letter already
  guessedLetters: [],
  //index to display graphic
  display: 0,
  currentWord: null,

// ==================================================================================
// START GAME ///////////////////////////////////////////////////////////////////////
// ==================================================================================
  //Begin by asking the player if they are ready to play
  startGame: function() 
    {
    console.log(" ");
    console.log("====================================================");
    console.log("/// CONSTRUCTOR HANGMAN ////////////////////////////");
    console.log("====================================================");
    console.log(" ");
    var that = this;
    // CReates an empty array to store Guessed Letters
    if(this.guessedLetters.length > 0)
      {this.guessedLetters = [];}
    
    // Ask player if they are ready to begin
    inquirer.prompt(
      [{
      name: "play",
      type: "confirm",
      message: "   Are ready to guess the word?"
      }])
    
    //If yes, start a new game
    .then(function(answer) 
        {
        if(answer.play)
          {that.newGame();} 
        else{console.log("   Nevermind then...");}
        })
    },

// ==================================================================================
// NEW GAME /////////////////////////////////////////////////////////////////////////
// ==================================================================================
  //Start a new game
  newGame: function() 
    {
    if(this.guessesRemaining === 10) 
      {
      console.log(" ");
      console.log("============================");
      console.log("   The game begins in 3....2....1.....GO!!!");
      console.log("============================");
      // Generate a random word from the work bank
      var randNum = Math.floor(Math.random()*this.wordBank.length);
      this.currentWord = new Word(this.wordBank[randNum]);
      this.currentWord.getLets();
      // Displays blank letters
      console.log(this.currentWord.wordRender());
      this.keepPromptingUser();
      }
    else
      {
      this.resetGuessesRemaining();
      this.newGame();
      }
    },
// ==================================================================================
// RESET GUESSES/////////////////////////////////////////////////////////////////////
// ==================================================================================
  resetGuessesRemaining: function() 
    {this.guessesRemaining = 10;},

// ==================================================================================
// KEEP PROMPTING ///////////////////////////////////////////////////////////////////
// ==================================================================================
  keepPromptingUser : function()
    {
    var that = this;
    // Request a guess from the player
    console.log(" ");
    inquirer.prompt([
      {
      name: "chosenLtr",
      type: "input",
      message: " Choose a letter:",
      validate: function(value) 
        {
        if(isLetter(value))
          {return true;} 
        else
          {return false;}
        }
      }])

    .then(function(ltr) 
      {
      // Convert letter to Capital
      var letterReturned = (ltr.chosenLtr).toUpperCase();
      // Checks if letter guessed already and adds to list if it wasnt
      var guessedAlready = false;   
      for(var i = 0; i<that.guessedLetters.length; i++)
        {
        if(letterReturned === that.guessedLetters[i])
          {guessedAlready = true;}
        }

      //if the letter wasn't guessed already, run through entire function, else reprompt user
      if(guessedAlready === false)
        {
        that.guessedLetters.push(letterReturned);

        var found = that.currentWord.checkIfLetterFound(letterReturned);
        
        // If no match found, Notify of incorrect guess and decrease guesses remaining
        if(found === 0)
          {
          console.log('\n========================');
          console.log('   Yea.... No thats wrong...');
          that.guessesRemaining--;
          that.display++;
          console.log(" ");
          console.log('   Guesses remaining: ' + that.guessesRemaining);
          console.log(hangManDisplay[(that.display)-1]);
          console.log(" ");
          console.log('\n==== PICK A LETTER =====');
          console.log(" ");
          console.log(that.currentWord.wordRender());
          console.log('\n========================');
          console.log(" ");
          console.log("   Letters guessed: " + that.guessedLetters);
          }
        
        else
          {
          console.log(" ");
          console.log('\n========================');
          console.log('   Wow....thats right!');
        
        // WINNING SCENARIO ========================================================
          // CHeck if the word has been completely guessed
          if(that.currentWord.didWeFindTheWord() === true)
            {
            console.log(" ");
            console.log(that.currentWord.wordRender());
            console.log(" ");
            console.log('   Awesome Sauce....You Won!!!');
            } 
        
        // DISPLAY PROGRESS =======================================================
          else
            {
            // display the user how many guesses remaining and the array
            console.log(" ");
            console.log('   Guesses remaining: ' + that.guessesRemaining);
            console.log('\n==== PICK A LETTER =====');
            console.log(" ");
            console.log(that.currentWord.wordRender());
            console.log('\n========================');
            console.log("   Letters guessed: " + that.guessedLetters);
            }
          }
        
        // LOOP BACK TO CONTINUE ====================================================
        // If guesses remain, continue asking for letters
        if(that.guessesRemaining > 0 && that.currentWord.wordFound === false) 
          {that.keepPromptingUser();}
        
        // GAME OVER SCENARIO =======================================================
        // If no guess remain, Game Over
        else if(that.guessesRemaining === 0)
          {
          console.log('   Game over!');
          console.log('   The word you were guessing was: ' + that.currentWord.word);
          }
        } 
      
      // REPEAT GUESS SCENARIO ======================================================
      else
        {
        console.log("   You've guessed that letter already. Try again.")
        that.keepPromptingUser();
        }
      });
    }
  }
  
  hangman.startGame();