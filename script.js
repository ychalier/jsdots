/*** DEFINE ***/

var CONTAINER_ID = "container";
var COLOR_TABLE = ["white"];
var SLEEP_MOVE_MIN = 0;
var SLEEP_MOVE_MAX = 500;
var SLEEP_COLOR_MIN = 0;
var SLEEP_COLOR_MAX = 2000;

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
    this.goto = false;
    this.start();
  }

  start(){
    this.run = true;
    this.goto = false;
    this.move_horizontal();
    this.move_vertical();
    this.change_color();
  }

  center(){
    this.goto = true;
    this.run = false;
  }

  stop(){
    this.run = false;
  }

  async move_horizontal(){
    while(this.run && !this.goto){
      await sleep(randint(SLEEP_MOVE_MIN, SLEEP_MOVE_MAX));
      this.element.style.left = randleft() + 'px';
    }
    if(this.goto)
      this.element.style.left = AREA_WIDTH/2 + 'px';
  }

  async move_vertical(){
    while(this.run && !this.goto){
      await sleep(randint(SLEEP_MOVE_MIN, SLEEP_MOVE_MAX));
      this.element.style.top = randtop() + 'px';
    }
    if(this.goto)
      this.element.style.top = AREA_HEIGHT/2 + 'px';
  }

  async change_color(){
    while(1){
      await sleep(randint(SLEEP_COLOR_MIN, SLEEP_COLOR_MAX));
      this.element.style.backgroundColor = randcolor();
    }
  }

}

/*** BUTTONS LINKAGE ***/

function add_dot(){
  DOTS.push(new Dot(10));
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

/*** SETUP ***/

init_container();
add_dot();
window.onresize = init_area;
