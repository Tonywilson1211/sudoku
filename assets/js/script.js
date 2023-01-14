console.clear()

// let $ = document.querySelector.bind(document)
// let $$ = document.querySelectorAll.bind(document)

let boards = [
    [
      "6      7     85 2      1   362    81  96     71  9 4 5 2   651   78    345       ",
      "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
    ],
    [
      "  9       4    6 758 31    15  4 36       4 8    9       75    3       1  2  3   ",
      "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
    ],
    [
      " 1 5       97 42    5    7 5   3   7 6  2 41   8  5   1 4      2 3     9 7    8  ",
      "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
    ]
]


//Looping through the board numbers
let boxes = document.querySelectorAll('.box')

function populateTiles(diffIndex) {
    let tiles = document.querySelectorAll('.tile')
    tiles.forEach(function(_, n) {
        let tile = document.querySelector(`.tile#t${n} > span`)
        let number = boards[diffIndex][0][n]
        tile.innerHTML = number
        if (number != ' '){
            tile.classList.add('preset')
            
        } else {
            tile.classList.remove('preset')
            
        } 
    })
}

populateTiles(0)


           
///////////////////////////////////////////




//Changing the difficulty text
let diff = document.querySelector('#diff')
let diffIndex = 0
let difficulties = ['Easy', 'Medium', 'Hard']
let newGame = document.querySelector('#new-game')
let difficultyText

function switchDifficulty () {
    diffIndex = (diffIndex+1) % 3
    difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
    memory = []
    future = []
}

diff.addEventListener('click', function() {
    if (confirm('This action will start a new game with a different difficulty')) {
        switchDifficulty()
        errorReset()
        timerReset()
        newGame()
        endGame()
    } else {
        switchDifficulty()
    } 
})

newGame.addEventListener('click', function() {
    if (confirm('This action will restart the game')) {
        populateTiles(diffIndex)
        errorReset()
        timerReset()
        newGame()
        endGame()
    } else {
        populateTiles(diffIndex)
    } 
})

//Errors
function errorReset() {
    errors = 0;
    document.querySelector("#error > span").innerHTML = errors;
}


//Number buttons
let digits = document.querySelectorAll('#digits > .digit-btn:nth-child(n+2)')
let chosen = null
let reset = null



digits.forEach(function(digit) {
    
    digit.addEventListener('click', function() {
        
        if (noting == false) {
            if (reset == this) {
                this.style.background = '#721200'
                chosen = null
                reset = null
            } else {
                if (reset) {
                    reset.style.background = '#721200'
                }
                chosen = this.innerHTML
                
                this.style.background = 'green'
                reset = this
            }
        } else {
            if (reset == this) {
                this.style.background = '#721200'
                reset = null
                chosen = null
            } else {
                if (reset) {
                    reset.style.background = '#721200'
                }
                chosen = this.innerHTML
                this.style.background = 'skyblue'
                reset = this
            }
        }
        
    })});





////////////////////////////////////////////


//Tiles click

let memory = []
let errors = 0
let errorCounter = document.querySelector('#error > span')


let tiles = document.querySelectorAll('.tile')



tiles.forEach(function(tile) {
    tile.addEventListener('click', function(event) {
         if (!this.querySelector('span').classList.contains('preset')) {
            if (!noting) {
                if (chosen != null) {
                    let prev = this.querySelector('span').innerHTML
                    let id = this.id
                    memory.push({id, prev, chosen})
        
                    this.querySelector('span').innerHTML = chosen
                    endGame()
                    future = []
    
                    let span2 = this.querySelector('span:nth-child(2)')
                    span2.innerHTML = ''
    
                    let index = parseInt(this.id.substring(1))
                    let expected = boards[diffIndex][1][index]
                    
                    if (chosen != expected) {
                        this.classList.add('incorrect')
                        errors += 1 
                        errorCounter.innerHTML = errors
                    }
                    
                }
            } else {
                let span2 = this.querySelector('span:nth-child(2)')
                let existing = span2.querySelector(`.n${chosen}`)
    
                if (!existing) {
                    let div = document.createElement('div') 
                    div.className = `note n${chosen}`
                    div.innerHTML = chosen
                    span2.appendChild(div)
    
                    let numbers = [1,2,3,4,5,6,7,8,9]
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
        }
        
        
    })
})



///////////////////////////////////////////


//Undo button

let future = []

let undo = document.querySelector('#undo')
undo.addEventListener('click', function(){
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

let redo = document.querySelector('#redo')
redo.addEventListener('click', function(){
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

/////////////////////////////////////////

//Timer

let timer = document.querySelector('#timer')
let time = document.querySelector('#timer > span')
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

function timerReset() {
    seconds = -1;
    minutes = 0;
    time.innerHTML = `0:00`;
}
    


timer.addEventListener("click", function () {
    
    if (timing) {
        clearInterval(timing);
        timing = null;
        time.innerHTML = "||";
        
    } else {
        timer_increment();
    }

    
});




    

// call the function whenever the condition time.innerHTML == '| |' is met




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

// notes
let noting = false
let notes = document.querySelector('#notes')

notes.addEventListener('click', function(){
    if (noting == false) {
        noting = true
        notes.classList.add('active')
    } else {
        noting = false 
        notes.classList.remove('active')
        if (reset) {
            reset.style.background = '#721200'
            reset = null
        }
    }
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

//Completed Game Conditions

function endGame() {
    let allFilled = true
    let allCorrect = true
    tiles.forEach(function(tile) {
        let index = parseInt(tile.id.substring(1))
        let expected = boards[diffIndex][1][index]
        let value = tile.querySelector('span').innerHTML

        if (value === ' ') {
            allFilled = false;
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
    