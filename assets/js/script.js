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

function unselect() {
    digits.forEach(function(same_digit) {
        same_digit.addEventListener('click', function() {
            if (same_digit.style.background === 'green') {
                same_digit.style.background = '#721200';
            } else {
                same_digit.style.background = 'green'
            }
        });
    })
}

digits.forEach(function(digit) {
    digit.addEventListener('click', function() {
        chosen = this.innerHTML
        deselect()
        unselect()
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

///////////////////////////////////////////


//Undo and Redo click

var state;
var history_stack = [];
var future_stack = [];
var interval;

$(document).ready(function(){
  initState();
})

$("#undo div").on("click", function(e){
  var box = $(e.target);
  box.toggleClass("tile");
  setBox(e.target.id,box.hasClass("tile"));
})


function initState(){
  var boxes = {};
  for(var i = 1; i <= 24; i++){
    var box = "box"+i;
    boxes[box] = false;
  }
  state = Immutable.Map(boxes);
}


//actually creates an entirely new state
//because the state is immutable
function setBox(key,value){
  //new
  var newState = state.set(key,value);
  //save old
  history_stack.push(state);
  //set current
  state = newState;
}

function undo(){
  if(history_stack.length > 0){
    var prevState = history_stack.pop();
    future_stack.push(state);
    setState(prevState);
    return true;
  }else{
    return false;
  }
}

function redo(){
  if(future_stack.length > 0){
    var nextState = future_stack.pop();
    history_stack.push(state);
    setState(nextState);
    return true
  }else{
    return false;
  }
}


//actually creates an entirely new state
//because the state is immutable
function setState(newState){
  for(var i = 1; i <= 81; i++){
    var key = "box"+i;
    var value = newState.get(key);
    value ? $("#"+key).addClass("selected") : $("#"+key).removeClass("selected");
  }
  state = newState;
}


