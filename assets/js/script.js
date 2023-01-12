console.clear()

// var $ = document.querySelector.bind(document)
// var $$ = document.querySelectorAll.bind(document)

var boards = [
    [
      "6      7      5 2      1   362    81  96     71  9 4 5 2   651   78    345       ",
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
var boxes = document.querySelectorAll('.box')

function populateTiles(diffIndex) {
    var tiles = document.querySelectorAll('.tile')
    tiles.forEach(function(_, n) {
        var tile = document.querySelector(`.tile#t${n} > span`)
        var number = boards[diffIndex][0][n]
        tile.innerHTML = number
        if (number != ' '){
            tile.classList.add('preset')
        }
    })
}

populateTiles(0)
///////////////////////////////////////////


//Changing the difficulty text
var diff = document.querySelector('#diff')

var diffIndex = 0
var difficulties = ['Easy', 'Medium', 'Hard']

function switchDifficulty () {

    clearInterval(timing[diffIndex])

    diffIndex = (diffIndex+1) % 3
    var difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
    memory = []
    future = []
    errorCounter.innerHTML = 0 
    document.querySelectorAll('.tile.incorrect').forEach(function(tile){ 
        tile.classList.remove('incorrect')
    })

    seconds = 0
    minutes = 0

    timer_increment()
    
}

diff.addEventListener('click', function() {
    if (memory.length && confirm('This action will start a new game, are you sure?')) {
        switchDifficulty()
    } else {
        switchDifficulty()
    } 
    
})
///////////////////////////////////////////


//Number buttons
var digits = document.querySelectorAll('#digits > .digit-btn:nth-child(n+2)')
var chosen = null
var reset = null



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
                this.style.background = 'blue'
                reset = this
            }
        }
        
    });
});




////////////////////////////////////////////


//Tiles click

var memory = []
let errors = 0
let errorCounter = document.querySelector('#error > span')


var tiles = document.querySelectorAll('.tile')
tiles.forEach(function(tile) {
    tile.addEventListener('click', function() {
        if (!this.querySelector('span').classList.contains('preset')) {
            if (!noting) {
                if (chosen != null) {
                    var prev = this.querySelector('span').innerHTML
                    var id = this.id
                    memory.push({id, prev, chosen})
        
                    this.querySelector('span').innerHTML = chosen
                    future = []
    
                    let span2 = this.querySelector('span:nth-child(2)')
                    span2.innerHTML = ''
    
                    let index = parseInt(this.id.substring(1))
                    let expected = boards[diffIndex][1][index]
    
                    if (chosen != expected) {
                        this.classList.add('incorrect')
                        errors += 1 
                        errorCounter.innerHTML = errors
                    } else {
                        this.classList.remove('incorrect')
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

var future = []

var undo = document.querySelector('#undo')
undo.addEventListener('click', function(){
    var prev_action = memory.splice(-1)[0]

    if (prev_action) {
        future.push(prev_action)
        var {id, prev} = prev_action

        var target = document.querySelector(`.tile#${id} > span`)
        target.innerHTML = prev
    } else {
        alert('No undo state')
    }
})

var redo = document.querySelector('#redo')
redo.addEventListener('click', function(){
    var prev_action = future.splice(-1)[0]

    if (prev_action) {
        memory.push(prev_action)
        var {id, chosen} = prev_action

        var target = document.querySelector(`.tile#${id} > span`)
        target.innerHTML = chosen
    }

})


//Timer
var timer = document.querySelector('#timer')
var time = document.querySelector('#timer > span')
var seconds = 0
var minutes = 0
var timing = {0:null, 1:null, 2:null}


function timer_increment() {

    timing[diffIndex] = setInterval(function () {
        seconds++
        if (seconds == 60) {
            seconds = 0
            minutes += 1
        }

        time.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`
    }, 1000)
    
}

timer_increment()


//Pause 
timer.addEventListener('click', function() {
    if (timing[diffIndex]) {
        timing[diffIndex] = false
        time.style.display = 'none'
    } else {
        timer_increment()
        time.style.display = 'unset'
    }
})

///////////////////////////////////////////

//Music

let audio = new Audio('/assets/audio/audio.mp3')
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
var noting = false
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
    let answers = boards[diffIndex][1].split('')
    answers.forEach(function(answer, n){
        let solve = document.querySelector(`#t${n} > span`) 
        solve.innerHTML = answer
    })
})
