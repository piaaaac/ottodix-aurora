
// --------------------------------------------------------------
// Vars
// --------------------------------------------------------------

// let field;
let auroraSystem;
let canvas;
let colors;
let params = {
  "click left/right": "add/remove lines",
  "linesNum": 2,
};

// --------------------------------------------------------------
// P5 loop structure
// --------------------------------------------------------------

function setup() {
  var cont = document.getElementById("p5-canvas-container");
  canvas = createCanvas(cont.clientWidth, cont.clientHeight);
  canvas.parent(cont);
  auroraSystem = new AuroraSystem();
  for (var i = 0; i < params.linesNum; i++) {
    auroraSystem.addRandomLine();
  }
  background(0, 12, 0);
  colors = [
    color(0, 255, 0),
    color(95, 96, 181),
    color(55, 252, 222),
    color(60, 228, 152),
    color(247, 105, 247),
  ];
}

function draw() {
  fill(0, 0, 0, 10);
  // fill(0, 0, 0, 255);
  noStroke();
  rect(0,0, width,height);
  auroraSystem.run();

  showParams();
}

// --------------------------------------------------------------
// Class AuroraLine
// --------------------------------------------------------------

function AuroraLine (y) {
  this.y = y;
  this.life = 0;
  this.randomOffset = random(100);
  this.lifeIncrement = 0.002;
  this.coarse = 0.002;
  this.transitionDuration = 0.5;
  this.dyeAt = null;
  this.intensity = 0;

  this.run = function () {
    this.update();
    this.display();
  }

  this.update = function () {
    this.life += this.lifeIncrement;
    if (this.life < this.transitionDuration) {
      this.intensity = map(this.life, 0, this.transitionDuration, 0, 1);
    } else if (this.dyeAt !== null && this.life > this.dyeAt - this.transitionDuration) {
      this.intensity = map(this.life, this.dyeAt - this.transitionDuration, this.dyeAt, 1, 0);
    }
    this.y += (noise(this.randomOffset + this.life * this.coarse) - 0.5) * 5;
  }

  this.display = function () {
    var dcolor = color(0, 255, 0, 200 * this.intensity);
    var dweight = this.intensity * 2;
    stroke(dcolor);
    strokeWeight(dweight);
    noFill();

    beginShape();
    for (x = 0; x < width; x++) {
      var noiseX = noise(this.randomOffset, x * this.coarse, this.life);
      var noiseY = noise(this.randomOffset + 1000, this.life, x * this.coarse + this.randomOffset);
      var incX = (noiseX - 0.5) * width * 0.7;
      var incY = (noiseY - 0.5) * width * 0.2;
      vertex(x + incX, this.y + incY);
    }
    endShape();
  }

  this.kill = function () {
    this.dyeAt = this.life + (this.intensity * this.transitionDuration);
  }

  this.isDead = function () {
    return (this.dyeAt !== null) && (this.life > this.dyeAt);
  }
}

// --------------------------------------------------------------
// Class AuroraSystem
// --------------------------------------------------------------

function AuroraSystem () {
  this.lines = [];

  this.addRandomLine = function (y) {
    var y = height * 0.3 + random(height * 0.4);
    var al = new AuroraLine(y);
    this.lines.push(al);
  }

  this.killRandomLine = function () {
    let index = floor(random(this.lines.length));
    this.lines[index].kill();
  }

  this.run = function () {
    for (var i = this.lines.length - 1; i >= 0; i--) {
      var al = this.lines[i];
      al.run();
      if (al.isDead()) {
        this.lines.splice(i, 1);
      }
    }
    params.linesNum = this.lines.length;
  }
}


// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

function mousePressed() {
  if (mouseX < width/2) {
    auroraSystem.addRandomLine();
  } else {
    auroraSystem.killRandomLine();
  }
}

/**
 * @param vars [] array of objects w/ keys {name, value}
 * 
 * */
function showParams () {
  var fs = 15;
  var lh = 25;
  fill(255);
  noStroke();
  textSize(fs);
  var i = 0;
  for (prop in params) {
    var string = prop + ": " + params[prop];
    text(string, 30, 30 + i * lh);
    i++;
  }
}

function setRetinaPixel (x, y, c, pixels) {
  let d = pixelDensity();
  for (let i = 0; i < d; i++) {
    for (let j = 0; j < d; j++) {
      // loop over
      index = 4 * ((y * d + j) * width * d + (x * d + i));
      pixels[index] = red(c);
      pixels[index+1] = green(c);
      pixels[index+2] = blue(c);
      pixels[index+3] = alpha(c);
    }
  }
}

function getRetinaPixel (x, y, pixels) {
  let d = pixelDensity();
  let index = (y * d) * width * d + (x * d);
  return [
    pixels[index],
    pixels[index+1],
    pixels[index+2],
    pixels[index+3],
  ];
}

// --------------------------------------------------------------
// Events
// --------------------------------------------------------------

// var cont = document.getElementById("p5-canvas-container");
// $(cont).click(function () {
//   $(this).toggleClass("blurred");
// });
