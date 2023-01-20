// 3 premade board numbers to populate the board with. First line is unsolved, second line is filled in with all correct numbers.

let boards = [
    // Easy Board
      [
        "6      7     85 2      1   362    81  96     71  9 4 5 2   651   78    345       ",
        "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
      ],
    // Medium Board
      [
        "  9       4    6 758 31    15  4 36   6   4 8    9       75    3       1  2  3   ",
        "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
      ],
      // Hard Board
      [
        " 1 5       97 42    5    7 5   3   7 6  2 4    8  5   1 4      2 3     9 7    8  ",
        "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
      ]
  ]
  
  ////////////////////////////////////
  
  // When called, this Function allows for text and the corresponding board layout to change when user clicks on the difficulty button. 

  let diffIndex = 0
  let diff = document.querySelector('#diff')
  function switchDifficulty () {
    let difficulties = ['Easy', 'Medium', 'Hard']
    let difficultyText
    diffIndex = (diffIndex+1) % 3
    difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
    memory = []
    future = []
  }
  
  ////////////////////////////////////
  
  // Function populates the tiles in the board with the corresponding difficulty selection. 
 
  function populateTiles(diffIndex) {
    let tiles = document.querySelectorAll('.tile')
    tiles.forEach(function(_, n) {
        let tile = document.querySelector(`.tile#t${n} > span`)
        let number = boards[diffIndex][0][n]
        tile.innerHTML = number
        // Add any tiles with no value to a preset class. Class will be called upon in tile event listeners. 
        if (number != ' '){
            tile.classList.add('preset')
        } else {
            // When a new game begins the tile is checked again and preset removed if tile has no number.
            tile.classList.remove('preset')  
        } 
    })
  }
  
  populateTiles(0)
  
  ////////////////////////////////////
  
  // Listen events for difficulty button and new game button
  
  diff.addEventListener('click', function() {
    if (confirm('This action will start a new game with a different difficulty')) {
      switchDifficulty()
      timerReset()
      errorReset()
      endGame() 
      notesReset()
  }
  })

  let newGame = document.querySelector('#new-game')
  newGame.addEventListener('click', function() {
  if (confirm('This action will restart the game')) {
      populateTiles(diffIndex)
      timerReset() 
      errorReset()
      endGame() 
      notesReset()
      memory = []
      future = []
  }
  })
  
////////////////////////////////////
  
//Tile click event listeners.

let memory = []
let errors = 0
let errorCounter = document.querySelector('#error > span')
let tiles = document.querySelectorAll('.tile')


//tileClick function checks a series of conditions to prevent certain actions from taking place.
function tileClick(event) {
    let tile = event.currentTarget
    let span = tile.querySelector('span')
    let span2 = tile.querySelector('span:nth-child(2)')
    
    switch(true) {
        // If game is paused no values can be entered onto the board
        case isPaused:
            break
        // If a tile contains a 'preset' number then user cannot overwrite it or insert a note
        case span.classList.contains('preset'):
            break
        // If notes has been turned on then note function is triggered i.e allows notes to be entered onto board
        case noting:
            noteMode(span2)
            break
        // If user has no number selected this then prohibits the user from replacing a number on the board with an empty value
        case chosen === null:
            break
        // This prohibits duplicate entries into a tile. 
        case span.innerHTML === chosen:
            break
        // If all conditions are met, number is entered into the board and stored in game memory should undo/redo functions be used by user
        default:
            gameMemory(span, tile)   
    }
}



function tileValue() {
    let tile = tiles.querySelector('.tile')
    let span = tiles.querySelector('.tile span')
    if (span.innerHTML != ' ') {
        tile.classList.add('present')
        return true;
    } else {
        tile.classList.remove('present')  
        return false;
    } 
}

    


// noteMode function allows the user to enter notes onto the board to aid them to complete the game
function noteMode(span2) {
  let existing = span2.querySelector(`.n${chosen}`)
  // If a note is not already present in a tile then the number chosen by the user is entered into the board in note format.
  if (!existing) {
    let div = document.createElement('div')
    div.className = `note n${chosen}`
    div.innerHTML = chosen
    span2.appendChild(div)
    let numbers = [1,2,3,4,5,6,7,8,9]
    // If a note doesn't already exist then the number is entered into the board. If there number is already present, it is removed.
    numbers.forEach(function(n) {
      let note = span2.querySelector(`.note.n${n}`)
      if (note) {
        span2.appendChild(note)
      }
    })
    } else {
        existing.remove()
    } 
}




// gameMemory function records the number entered onto the board by the user for use with undo and redo functions.
function gameMemory(span, tile) {
  let prev = span.innerHTML
  let id = tile.id
  memory.push({id, prev, chosen})
  span.innerHTML = chosen
  // checks to see if end game conditions have been met
  endGame()
  let span2 = tile.querySelector('span:nth-child(2)')
  span2.innerHTML = ''
  let index = parseInt(tile.id.substring(1))
  let expected = boards[diffIndex][1][index]
  if (chosen != expected) {
    tile.classList.add('incorrect')
    errors += 1
    errorCounter.innerHTML = errors
  }
}

tiles.forEach(function(tile) {
  tile.addEventListener('click', tileClick)

})
  
///////////////////////////////////////////
  
  //Reset Notes when new game starts
  
  function notesReset() {
      tiles = document.querySelectorAll('.tile')
      tiles.forEach(function(note) {
          note = document.querySelector('.note')
          if (note) {
              note.remove()
          }
      })
  }
  
  
  ///////////////////////////////////////////
  
  //Undo button
  let future = []
  let undo = document.querySelector('#undo')
  
  undo.addEventListener('click', function(){
    if (isPaused) {
        return
    }
      let prev_action = memory.splice(-1)[0]
      if (prev_action) {
          future.push(prev_action)
          let {id, prev} = prev_action
          let target = document.querySelector(`.tile#${id} > span`)
          target.innerHTML = prev
      } else {
          alert('Nothing to Undo!')
      }
  })
  
  // Redo button
  let redo = document.querySelector('#redo')
  redo.addEventListener('click', function(){
      if (isPaused) {
          return
      }
      let prev_action = future.splice(-1)[0]
      if (prev_action) {
          memory.push(prev_action)
          let {id, chosen} = prev_action
          let target = document.querySelector(`.tile#${id} > span`)
          target.innerHTML = chosen
      } else {
          alert('Nothing to Redo!')
      }
  })
  
  ////////////////////////////////////////////
  
  // Timer
  let time = document.querySelector('#timer > span')
  let timer = document.querySelector('#timer')
  let seconds = 0
  let minutes = 0
  let timing = 0
  
  function timer_increment() {
      timing = setInterval(function () {
          seconds++
          if (seconds >= 60) {
              seconds = 0
              minutes += 1
          }
          time.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`
      }, 1000)
  }
  timer_increment()
  
  // Timer Reset
  function timerReset() {
      seconds = -1
      minutes = 0
      time.innerHTML = `0:00`
  }
  
  timer.addEventListener("click", function () {
      if (timing) {
          clearInterval(timing)
          timing = null
          time.innerHTML = "||"
      } else {
          timer_increment()
      }
  })
  
  // Pause
  let isPaused = false
  
  timer.addEventListener('click', function() {
      isPaused = !isPaused
      if(isPaused == true) {
          alert('The game is paused. You will not be able to place numbers on the board or use the undo/redo buttons')
      } if (isPaused == false){
          alert('The game is now unpaused')
      }
  })
  
  ///////////////////////////////////////////




  //////////////////////////////////////////
  
// Digit buttons 
let digits = document.querySelectorAll('#digits > .digit-btn:nth-child(n+2)')
let chosen = null
let reset = null
let noting = false

function handleDigitClick(event) {
    if (isPaused) return
    if (reset === event.currentTarget) {
        resetDigit()
    } else {
        resetDigit()
        chosen = event.currentTarget.innerHTML
        event.currentTarget.style.background = 'green'
        reset = event.currentTarget
    }
}

function resetDigit() {
    if (reset) {
        reset.style.background = '#721200'
        reset = null
        chosen = null
    }
}    


digits.forEach(digit => {
    digit.addEventListener('click', handleDigitClick)
})

let notes = document.querySelector('#notes')

notes.addEventListener('click', function(){
    noting = !noting
    notes.classList.toggle('active')
})

  
  ///////////////////////////////////////////
  
  //Auto Solve
  
  let autoSolve = document.querySelector('#auto-solve')
  
  autoSolve.addEventListener('click', function(){
      if (confirm('This action will reveal all answers and end the game')) {
              let answers = boards[diffIndex][1].split('')
              answers.forEach(function(answer, n){
                  let solve = document.querySelector(`#t${n} > span`) 
                  solve.innerHTML = answer
              } 
              ) 
              alert('Better luck next time. Click New Game or Difficulty buttons to have another go!')
  
      }})
  
  ///////////////////////////////////////////
  
  // How To Play Button 
  
  let playBtn = document.querySelector('#how-to-play')
  function howToPlayBtn() {
      playBtn.addEventListener('click', function() {
         if (confirm('You are about to leave this page so any progress you have made will be lost')) {
          location.assign("index.html")
         }
      })
  }
  howToPlayBtn()
  
  ///////////////////////////////////////////
  
  //Music
  
  let audio = new Audio('assets/audio/audio.mp3')
  audio.loop = true
  let playPauseBtn = document.querySelector('#audio-btn')
  let count = 0
  function playPause() {
      playPauseBtn.addEventListener('click', function() {
          if (count == 0) {
              count = 1        
              audio.play()
              playPauseBtn.innerHTML = 'Pause Music'
              
          } else {
              count = 0
              audio.pause()
              playPauseBtn.innerHTML = 'Play Music'
          } 
      })
  }
   
  playPause()
  
  ///////////////////////////////////////////
  
  //Errors
  function errorReset() {
    errors = 0
    document.querySelector("#error > span").innerHTML = errors
  }

  /*function errorCounter() {
    let errors = 0
   
    let expected = boards[diffIndex][1]
    let errorCounter = document.querySelector('#error > span')
    if (chosen != expected) {
        this.classList.add('incorrect')
        errors += 1 
        errorCounter.innerHTML = errors
    }
  } */
  
  ///////////////////////////////////////////
  
  //Completed Game Conditions
  
  function endGame() {
    let allFilled = true
    let allCorrect = true
    tiles.forEach(function(tile) {
        let index = parseInt(tile.id.substring(1))
        let expected = boards[diffIndex][1][index]
        let value = tile.querySelector('span').innerHTML
        if (value === ' ') {
            allFilled = false
        } else {
            if (value !== expected) {
                allCorrect = false
            }
        }
    })
    if (allFilled) {
        if (allCorrect) {
            alert(`Congratulations! You have completed this game of Sudoku!! You completed the ${diff.innerHTML} setting in ${time.innerHTML} with ${errors} errors.`)
            
        } else {
            alert(`Game Over. You have not been successful on this occasion. Try starting a new game or changing the difficulty level.`)
            
        }
    }
  }       
  
  ///////////////////////////////////////////