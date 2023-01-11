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
        var tile = document.querySelector(`.tile#t${n}`)
        var number = boards[diffIndex][0][n]
        tile.innerHTML = number
    })
}

populateTiles(0)
///////////////////////////////////////////


//Changing the difficulty text
var diff = document.querySelector('#diff')

var diffIndex = 0
var difficulties = ['Easy', 'Medium', 'Hard']

function switchDifficulty () {
    diffIndex = (diffIndex+1) % 3
    var difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
    memory = []
    future = []
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
        chosen = this.innerHTML
        this.style.background = 'green'
    })
})

digits.forEach(function(digit) {
    digit.addEventListener('click', function() {
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
    });
});




////////////////////////////////////////////


//Tiles click

var memory = []

var tiles = document.querySelectorAll('.tile')
tiles.forEach(function(tile) {
    tile.addEventListener('click', function() {
        if (chosen != null) {
            var prev = tile.innerHTML
            var id = tile.id
            memory.push({id, prev, chosen})

            this.innerHTML = chosen
            future = []
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

        var target = document.querySelector(`.tile#${id}`)
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

        var target = document.querySelector(`.tile#${id}`)
        target.innerHTML = chosen
    }

})


//Timer
var timer = document.querySelector('#timer')
var time = document.querySelector('#timer > span')
var seconds = 0
var minutes = 0
var timing

function time_fn() {
    if (timing) {
        seconds++
        if (seconds == 60) {
            seconds = 0
            minutes += 1
        }

        time.innerHTML = `${minutes}:${String(seconds).padStart(2, '0')}`
        
        setTimeout(time_fn, 1000)
    }
}

function timer_increment() {
    timing = true
    time_fn()
}

timer_increment()


//Pause 
timer.addEventListener('click', function() {
    if (timing) {
        timing = false
        time.style.display = 'none'
    } else {
        timer_increment()
        time.style.display = 'unset'
    }
})

