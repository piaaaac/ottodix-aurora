/*
Class BG
Interpolate colors
Effects
Class noise muccato to overlay and create 
  imperfection in the light 
  progression (eg Left to Right)
*/


// --------------------------------------------------------------
// Vars
// --------------------------------------------------------------

// let field;
let auroraSystem;
let canvas;
let colors;
let bg;
let params = {
  "click left/right": "add/remove lines",
  "linesNum": 2,
  "effects": [],
};

// --------------------------------------------------------------
// P5 loop structure
// --------------------------------------------------------------

function setup() {
  colors = [
    color(0, 255, 0),
    color(95, 96, 181),
    color(55, 252, 222),
    color(60, 228, 152),
    color(247, 105, 247),
  ];
  var cont = document.getElementById("p5-canvas-container");
  canvas = createCanvas(cont.clientWidth, cont.clientHeight);
  canvas.parent(cont);
  auroraSystem = new AuroraSystem();
  for (var i = 0; i < params.linesNum; i++) {
    auroraSystem.addRandomLine();
  }
  bg = new Background();
  background(0, 12, 0);
}

function draw() {
  fill(0, 0, 0, 10);
  // fill(0, 0, 0, 255);
  noStroke();
  rect(0,0, width,height);
  bg.run();
  auroraSystem.run();

  showParams();
}

// --------------------------------------------------------------
// Class Background
// --------------------------------------------------------------

function Background () {
  this.dots = [];
  this.size = 500;
  this.pg = createGraphics(this.size, this.size);

  this.init = function () {
    for (var i = 0; i < 3; i++) {
      var d = new Dot(size * 0.2, size * 0.1 * i, size * 0.4);
      this.dots.push(d);
    }
  }

  this.run = function () {
    this.dots.forEach(dot => {
      dot.update();
      dot.display(this.pg);
    });
    image(this.pg);
  }
}

function Dot (x, y, r) {
  this.pos = createVector(x, y);
  this.r = r; 
  this.colors = shuffle(colors);
  this.colors.push(color(this.colors[0]));
  this.life = random();
  this.lifeIncrement = 0.1;

  this.update = function () {
    this.life += this.lifeIncrement;
    if (this.life > 1) {
      this.life -= 1;
    }
  }

  this.display = function (pg) {
    pg.fill(interpolateNColors(colors, this.life));
    pg.noStroke();
    pg.circle(this.pos.x, this.pos.y, this.r);
  }
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
  
  // this.color = colors[floor(random(colors.length))];
  this.color = colors[0];

  // this.nodesNum = floor(random(7)) + 7;
  // this.nodes = [];


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
    var dcolor = color(this.color, 200 * this.intensity);
    var dweight = this.intensity * 3;
    stroke(dcolor);
    strokeWeight(dweight);
    noFill();

    var xstart = noise(this.randomOffset + 200 + this.life * 2 * this.coarse);
    var xend = noise(this.randomOffset + this.life * this.coarse);
    if (xstart > xend) {
      var tmp = xend;
      xend = xstart;
      xstart = tmp;
    }
    xstart /= 2;
    xend = xend/2 + 0.5;

    beginShape();
    // for (x = 0; x < width; x++) {
    for (x = width * xstart; x < width * xend; x++) {
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



  // VERSION with independent lines instead of begin/endShape()
  // 
  // this.display = function () {
  //   var dcolor = color(this.color, 200 * this.intensity);
  //   var dweight = this.intensity * 2;
  //   stroke(dcolor);
  //   strokeWeight(dweight);
  //   noFill();

  //   var from = this.getPoint(0);
  //   for (x = 1; x < width; x++) {
  //     var to = this.getPoint(x);
  //     line(from.x, from.y, to.x, to.y);
  //     from = to;
  //   }
  // }

  // this.getPoint = function (x) {
  //   var noiseX = noise(this.randomOffset, x * this.coarse, this.life);
  //   var noiseY = noise(this.randomOffset + 1000, this.life, x * this.coarse + this.randomOffset);
  //   var incX = (noiseX - 0.5) * width * 0.7;
  //   var incY = (noiseY - 0.5) * width * 0.2;
  //   return createVector(x + incX, this.y + incY);
  // }


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

  this.killOldestLine = function () {
    // let index = floor(random(this.lines.length));
    // let index = 0;
    // this.lines[index].kill();

    for (let i = 0; i < this.lines.length; i++) {
      if (this.lines[i].dyeAt === null) {
        this.lines[i].kill();
        return;
      }
    }
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
// Functions p5
// --------------------------------------------------------------

function mousePressed () {
  if (mouseX < width/2) {
    auroraSystem.addRandomLine();
  } else {
    auroraSystem.killOldestLine();
  }
}

function keyPressed () {
  console.log(keyCode);
  if (keyCode === LEFT_ARROW) { }
  if (keyCode === RIGHT_ARROW) { }
  if (keyCode === UP_ARROW) { }
  if (keyCode === DOWN_ARROW) { }
}

/**
 * @param colorsArray []
 * @param amt - normalized advancement 0-1
 * */
function interpolateNColors (colorsArray, amt) {
  const colorNum = colorsArray.length;
  const stepSize = 1 / (colorNum - 1);
  const step = floor(amt/stepSize);
  const posInStep = amt % stepSize;
  const newNorm = map(posInStep, 0,stepSize, 0,1);
  return lerpColor(colorsArray[step], colorsArray[step+1], newNorm);
}


// --------------------------------------------------------------
// Functions
// --------------------------------------------------------------

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












// int interpolateColors(int c1, int c2, float percent) {
//   int r = (int) (red(c1)*(1-percent) + red(c2)*percent);
//   int g = (int) (green(c1)*(1-percent) + green(c2)*percent);
//   int b = (int) (blue(c1)*(1-percent) + blue(c2)*percent);
//   int c = color(r, g, b);
//   return c;
// }


// int interpolateNColors(int[] colorsArray, float percent) {
//   int resultColor;

//   int colorNum = colorsArray.length;
//   float stepSize = 1.0 / (colorNum - 1);
//   int step = floor(percent/stepSize);
//   float posInStep = percent % stepSize;
//   float newPercent = map(posInStep, 0,stepSize, 0,1);
  
//   resultColor = interpolateColors(colorsArray[step], colorsArray[step+1], newPercent);
//   return resultColor;
// }


// void setup() {
//   size(500, 500);
//   background(255);
//   noStroke();
//   noLoop();
//   rectMode(CORNERS);  
// }



// void draw() {
// /*
//   int c1 = color(0, 167, 255);
//   int c2 = color(200, 0, 0);
//   int c3 = color(72, 255, 0);
//   int c4 = color(0, 0, 255);
//   int c5 = color(0, 255, 0);
//   int c6 = color(255, 0, 0);
// */
//   int c1 = color(255);
//   int c2 = color(0, 167, 255);
//   int c3 = color(200, 222, 0);
//   int c4 = color(200, 0, 0);
//   int c5 = color(255);
//   int[] colors = { c1,c2,c3,c4,c5 };
//   int n = colors.length;
  
//   float rectLength = width/n;
//   for(int i=0; i<n; i++){
//     fill(colors[i]);
//     rect(rectLength*i, 0, rectLength*(i+1), height/2);
//   }

//   for (int i=0; i<width; i++) {
//     float advancement = map(i, 0,width, 0,1);

//     //advancement = pow( advancement, 8 );
//     int c = interpolateNColors(colors, advancement);

//     fill(c);
//     rect(i, height/2, i+1, height);
//   }
// }
