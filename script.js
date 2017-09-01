/*** DEFINE ***/

var CONTAINER_ID = "container";
var COLOR_TABLE = ["red", "blue"];

var SLEEP_MOVE_MIN = 0;
var SLEEP_MOVE_MAX = 500;

var SLEEP_COLOR_MIN = 0;
var SLEEP_COLOR_MAX = 2000;

var CELL_WIDTH = 100;

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

function sort(){
  var nRows = Math.floor(AREA_HEIGHT/CELL_WIDTH);
  var nCols = Math.floor(AREA_WIDTH /CELL_WIDTH);
  for (i=0; i<DOTS.length; i++){
    var col = (i % nCols);
    var row = Math.floor(i/nRows);
    DOTS[i].centerin(row*CELL_WIDTH, col*CELL_WIDTH, CELL_WIDTH);
  }
}

/*** SETUP ***/

init_container();
add_dot();
window.onresize = init_area;
