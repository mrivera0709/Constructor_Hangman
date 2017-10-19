var Letter = function(ltr) 
  {
// Store letter
  this.letter = ltr;
// Determines if letter should be shown
  this.appear = false;

  this.letterRender = function() 
    {
    if(this.letter == ' ')
      {
      this.appear = true;
      return '  ';
      }
    
    if(this.appear === false)
      {return ' _ ';} 
    
    else
      {return this.letter;}
  };
};

module.exports = Letter;