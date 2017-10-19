// require letter objects
var Letter = require('./letter.js');

function Word(wrd) 
  {
  var that = this;
  this.word = wrd;
  this.letters = [];
  this.wordFound = false;

// ==================================================================================
// LETTERS ARRAY ////////////////////////////////////////////////////////////////////
// ==================================================================================
  // Converts word into an array of letters
  this.getLets = function() 
    {
    for(var i = 0; i<that.word.length; i++)
      {
      var newLetter = new Letter(that.word[i]);
      this.letters.push(newLetter);
      }
    };

// ==================================================================================
// WORD FOUND ///////////////////////////////////////////////////////////////////////
// ==================================================================================
  // Determine if the word was found
  this.didWeFindTheWord = function() 
    {
    if(this.letters.every(function(lttr)
      {
      return lttr.appear === true;
      }))
      {
      this.wordFound = true;
      return true;
      }
    };

// ==================================================================================
// LETTER GUESSED ///////////////////////////////////////////////////////////////////
// ==================================================================================
  // Determines if letter guessed matches a letter in the word
  this.checkIfLetterFound = function(guessedLetter) 
    {
    var whatToReturn = 0;
    this.letters.forEach(function(lttr)
      {
      if(lttr.letter === guessedLetter)
        {
        lttr.appear = true;
        whatToReturn++;
        }
      })
    return whatToReturn;
    };

// ==================================================================================
// WORD DISPLAY ///////////////////////////////////////////////////////////////////////
// ==================================================================================
  // Displays the completed word
  this.wordRender = function() 
    {
    var display = '';
    that.letters.forEach(function(lttr)
      {
      var currentLetter = lttr.letterRender();
      display+= currentLetter;
      });
    return display;
    };
  }

module.exports = Word;
