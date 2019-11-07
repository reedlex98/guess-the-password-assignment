document.addEventListener('DOMContentLoaded', () => {
  let wordCount = 10;
  let guessCount = 4;
  let password = '';

  const start = d3.select("#start");

  const toggleClasses = (element, ...classes) => {
    classes.forEach(className => element.classed(className, !element.classed(className)))
  }

  const shuffle = (array) => {
    const arrayCopy = array.slice();
    for (let idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      const idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      [arrayCopy[idx1], arrayCopy[idx2]] = [arrayCopy[idx2], arrayCopy[idx1]] 
    }
    return arrayCopy;
  }

  const getRandomValues = (array, numberOfVals = wordCount) => shuffle(array).slice(0, numberOfVals)
  
  const setGuessCount = (newCount) => {
    guessCount = newCount;
    d3.select("#guesses-remaining")
      .text(`Guesses remaining: ${guessCount}.`)
  }

  const compareWords = (word1, word2) => {
    if (word1.length !== word2.length) {
      throw 'Words must have the same length';
    }
    let count = 0;
    for (let i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }

  const updateGame = () => {
    if (d3.event.target.tagName === 'LI' && !d3.event.target.classList.contains('disabled')) {
      // grab guessed word, check it against password, update view
      const guess = d3.event.target.innerText;
      const similarityScore = compareWords(guess, password);
      d3.event.target.classList.add('disabled');
      d3.event.target.innerText = `${guess} --> Matching Letters: ${similarityScore}`;
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        toggleClasses(d3.select("#winner"), 'hide', 'show');
        d3.select("#word-list").on('click', null);
      } else if (guessCount === 0) {
        toggleClasses(d3.select("#loser"), 'hide', 'show');
        d3.select("#word-list").on('click', null);
      }
    }
  }

  const startGame = () => {
    // get random words and append them to the DOM
    const wordList = d3.select("#word-list");
    // 'words' variable is from words.js
    const randomWords = getRandomValues(words); // eslint-disable-line no-undef
    randomWords.forEach((word) => {
      const li = wordList.append('li');
      li.text(word);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    wordList.on('click', updateGame);
  }

  start.on('click', () => {
    toggleClasses(d3.select('#start-screen'), 'hide', 'show');
    toggleClasses(d3.select('#game-screen'), 'hide', 'show');
    startGame();
  });

});
