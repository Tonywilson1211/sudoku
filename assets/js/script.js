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
    boxes.forEach(function(box, index) {
        var tiles = box.querySelectorAll('.tile')
        var point = index * 9
        tiles.forEach(function(tile, n) {
            var number = boards[diffIndex][0][point+n]
            tile.innerHTML = number
        })
    })
}

populateTiles(0)
///////////////////////////////////////////


//Changing the difficulty text
var diff = document.querySelector('#diff')

var diffIndex = 0
var difficulties = ['Easy', 'Medium', 'Hard']

diff.addEventListener('click', function() {
    diffIndex = diffIndex+1 % 3
    var difficultyText = difficulties[diffIndex]
    diff.innerHTML = difficultyText
    populateTiles(diffIndex)
})
///////////////////////////////////////////


//Number buttons
var digits = document.querySelectorAll('#digits > .digit-btn:nth-child(n+2)')
var chosen = null

function deselect() {
    digits.forEach(function(other_digit) {
        other_digit.style.background = '#721200'
    })
}

digits.forEach(function(digit) {
    digit.addEventListener('click', function() {
        chosen = this.innerHTML
        deselect()
        this.style.background = 'green'
    })
})
////////////////////////////////////////////


//Tiles click
var tiles = document.querySelectorAll('.tile')
tiles.forEach(function(tile) {
    tile.addEventListener('click', function() {
        if (chosen != null) {
            this.innerHTML = chosen
            chosen = null
            deselect()
        }
    })
})

