/*** DEFINE ***/

var CONTAINER_ID = "container";
var COLOR_TABLE = ["white"];

var SLEEP_MOVE_MIN = 0;
var SLEEP_MOVE_MAX = 500;

var SLEEP_COLOR_MIN = 0;
var SLEEP_COLOR_MAX = 2000;

var CELL_WIDTH = 100;
var LETTER_CELL_WIDTH = 12;
var LETTER_CELL_MARGIN = 6;
var WORD_MARGIN = 30;

var ALPHABET = {}
ALPHABET["A"] = [false, true, true, false, true, false, false, true, true, true, true, true, true, false, false, true, true, false, false, true];
ALPHABET["B"] = [true, true, true, false, true, false, false, true, true, true, true, false, true, false, false, true, true, true, true, false];
ALPHABET["C"] = [false, true, true, true, true, false, false, false, true, false, false, false, true, false, false, false, false, true, true, true];
ALPHABET["D"] = [true, true, true, false, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, false];
ALPHABET["E"] = [true, true, true, true, true, false, false, false, true, true, true, false, true, false, false, false, true, true, true, true];
ALPHABET["F"] = [true, true, true, true, true, false, false, false, true, true, true, false, true, false, false, false, true, false, false, false];
ALPHABET["G"] = [false, true, true, true, true, false, false, false, true, false, true, true, true, false, false, true, false, true, true, true];
ALPHABET["H"] = [true, false, false, true, true, false, false, true, true, true, true, true, true, false, false, true, true, false, false, true];
ALPHABET["I"] = [false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false];
ALPHABET["J"] = [false, false, false, true, false, false, false, true, false, false, false, true, true, false, false, true, false, true, true, false];
ALPHABET["K"] = [true, false, false, true, true, false, true, false, true, true, false, false, true, false, true, false, true, false, false, true];
ALPHABET["L"] = [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, true, true, false];
ALPHABET["M"] = [true, false, false, true, true, true, true, true, true, false, false, true, true, false, false, true, true, false, false, true];
ALPHABET["N"] = [true, false, false, true, true, false, false, true, true, true, false, true, true, false, true, true, true, false, false, true];
ALPHABET["O"] = [false, true, true, false, true, false, false, true, true, false, false, true, true, false, false, true, false, true, true, false];
ALPHABET["P"] = [true, true, true, false, true, false, false, true, true, true, true, false, true, false, false, false, true, false, false, false];
ALPHABET["Q"] = [false, true, true, false, true, false, false, true, true, false, false, true, true, false, true, true, false, true, true, true];
ALPHABET["R"] = [true, true, true, false, true, false, false, true, true, true, true, false, true, false, true, false, true, false, false, true];
ALPHABET["S"] = [false, true, true, true, true, false, false, false, false, true, true, false, false, false, false, true, true, true, true, false];
ALPHABET["T"] = [true, true, true, false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false, false];
ALPHABET["U"] = [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true];
ALPHABET["V"] = [true, false, false, true, true, false, false, true, true, false, false, true, true, false, false, true, false, true, true, false];
ALPHABET["W"] = [true, false, false, true, true, false, false, true, true, false, false, true, true, true, true, true, false, true, true, false];
ALPHABET["X"] = [true, false, false, true, true, false, false, true, false, true, true, false, false, true, true, false, true, false, false, true];
ALPHABET["Y"] = [true, false, true, false, true, false, true, false, true, true, true, false, false, true, false, false, false, true, false, false];
ALPHABET["Z"] = [true, true, true, true, false, false, false, true, false, false, true, false, false, true, false, false, true, true, true, true];
ALPHABET["!"] = [false, true, false, false, false, true, false, false, false, true, false, false, false, false, false, false, false, true, false, false];
ALPHABET["."] = [false, false, false, false, false, false, false ,false, false, false, false, false, false, false, false, false, true, false, false, false];
ALPHABET["?"] = [false, true, true, true, false, false, false, true, false, false, true, false, false, false, false, false, false, false, true, false];

/*** GLOBAL VAR ***/

var DOTS = [];
var AREA_WIDTH = 0;
var AREA_HEIGHT = 0;
var CONTAINER = null;

/*** MISC MECHANICS ***/

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randint(min, max){
  // Returns an int randomly chosen from [|min, max|]
  return Math.floor((Math.random()*(max-min+1)) + min);
}

function randcolor(){
  return COLOR_TABLE[randint(0, COLOR_TABLE.length-1)]
}

function randtop(){
  return randint(0, AREA_HEIGHT);
}

function randleft(){
  return randint(0, AREA_WIDTH);
}

/*** CORE MECHANICS ***/

function init_container(){
  CONTAINER = document.getElementById(CONTAINER_ID);
  CONTAINER.innerHTML = "";
  init_area();
}

function init_area(){
  AREA_WIDTH  = CONTAINER.offsetWidth;
  AREA_HEIGHT = CONTAINER.offsetHeight;
}

function create_dot(size){
  element = document.createElement('div');
  element.className = "dot";
  element.style.width = size + "px";
  element.style.height= size + "px";
  element.style.top = randtop() + "px";
  element.style.left = randleft() + "px";
  element.style.backgroundColor = randcolor();
  return element;
}

class Dot{
  constructor(size){
    this.element = create_dot(size);
    CONTAINER.appendChild(this.element);
    this.run = false;
    this.start();
    this.index = DOTS.length;
  }

  start(){
    this.run = true;
    this.move_horizontal();
    this.move_vertical();
    this.change_color();
  }

  center(){
    this.goto(AREA_HEIGHT/2, AREA_WIDTH/2);
  }

  stop(){
    this.run = false;
  }

  delete(){
    if(this.index < DOTS.length-1){
      DOTS[this.index] = DOTS[DOTS.length - 1];
      DOTS[this.index] = this.index;
    }
    DOTS.pop();
    CONTAINER.removeChild(this.element);
  }

  async move_horizontal(){
    while(this.run){
      this.element.style.left = randleft() + 'px';
      await sleep(randint(SLEEP_MOVE_MIN, SLEEP_MOVE_MAX));
    }
  }

  async move_vertical(){
    while(this.run){
      this.element.style.top = randtop() + 'px';
      await sleep(randint(SLEEP_MOVE_MIN, SLEEP_MOVE_MAX));
    }
  }

  async change_color(){
    while(1){
      await sleep(randint(SLEEP_COLOR_MIN, SLEEP_COLOR_MAX));
      this.element.style.backgroundColor = randcolor();
    }
  }

  centerin(top, left, size){
    var dot_size = this.element.offsetWidth/2;
    this.goto(top+size/2-dot_size, left+size/2-dot_size);
  }

  goto(top, left){
    this.stop();
    this.element.style.top  = top  + "px";
    this.element.style.left = left + "px";
  }

  async centerin_wait(top, left, size){
    await sleep(randint(SLEEP_MOVE_MIN, SLEEP_COLOR_MAX));
    this.centerin(top, left, size);
  }

}

/*** BUTTONS LINKAGE ***/

function add_dot(){
  DOTS.push(new Dot(10));
}

function add_ten(){
  for(i=0;i<10;i++)
    add_dot();
}

function dots_exec(f){
  for (i=0; i<DOTS.length; i++){
    f(DOTS[i]);
  }
}

function dots_start(){
  dots_exec(function(dot){
    dot.start();
  });
}

function dots_stop(){
  dots_exec(function(dot){
    dot.stop();
  });
}

function dots_center(){
  dots_exec(function(dot){
    dot.center();
  });
}

function dots_delete(){
  DOTS[DOTS.length-1].delete();
}

function dots_clear(){
  for (i=DOTS.length-1; i>=0; i--){
    DOTS[i].delete();
  }
}

function sort(){
  var nRows = Math.floor(AREA_HEIGHT/CELL_WIDTH);
  var nCols = Math.floor(AREA_WIDTH /CELL_WIDTH);
  for (i=0; i<DOTS.length; i++){
    var col = (i % nCols);
    var row = Math.floor(i/nRows);
    DOTS[i].centerin(row*CELL_WIDTH, col*CELL_WIDTH, CELL_WIDTH);
  }
}

/*** LETTERS ***/

function get_required_dots(word){
  var count = 0;
  for (i=0; i<word.length; i++){
    if (word[i]!=" "){
      for (j=0; j<ALPHABET[word[i]].length; j++){
        if (ALPHABET[word[i]][j])
            count++;
      }
    }
  }
  return count;
}

function spawn_required_dots(word){
  while(DOTS.length < get_required_dots(word))
    add_dot();
}

function write_word(word){
  var index = 0;
  var letter_height = 5*LETTER_CELL_WIDTH;
  var letter_width  = 4*LETTER_CELL_WIDTH;
  var word_top = AREA_HEIGHT/2-letter_height/2;
  var word_left = AREA_WIDTH/2-(word.length*letter_width)/2;
  spawn_required_dots(word);
  for (i=0; i<word.length; i++){
    if (word[i]!=" "){
      for (j=0; j<ALPHABET[word[i]].length; j++){
        if (ALPHABET[word[i]][j]){
          var col = (j % 4);
          var row = Math.floor(j/4);
          var top = word_top + row*LETTER_CELL_WIDTH;
          DOTS[index].centerin_wait(word_top+row*LETTER_CELL_WIDTH, word_left+col*LETTER_CELL_WIDTH, LETTER_CELL_WIDTH);
          index++;
        }
      }
      word_left += letter_width + LETTER_CELL_MARGIN;
    } else {
      word_left += WORD_MARGIN;
    }
  }
  for (i=DOTS.length-1; i>=index; i--){
    DOTS[i].delete();
  }
  return true;
}

function parseWord(input){
  var tmp = input.toUpperCase();
  var buff = "";
  for (i=0; i<tmp.length; i++){
    var char = tmp[i];
    if ((char.charCodeAt(0) > 64 && char.charCodeAt(0) < 91) || char==" " || char=="." || char=="!" || char=="?"){
        buff+=char;
    }
  }
  return buff;
}

function writer(){
  var word = parseWord(document.getElementById("input").value);
  if (DOTS.length < get_required_dots(word)){
    spawn_required_dots(word);
  }
  dots_start();
  write_word(word);
}

/*** SETUP ***/

init_container();
window.onresize = init_area;
