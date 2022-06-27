
// --------------------------------------------------------------
// Vars
// --------------------------------------------------------------

// let field;
let auroralines = [];
var canvas;
let pgGrid;

let params = {
  "starDensity": 0.2,     // 
  "linesNum": 4,    // 
};

// --------------------------------------------------------------
// P5 loop structure
// --------------------------------------------------------------

function setup() {
  var cont = document.getElementById("p5-canvas-container");
  canvas = createCanvas(cont.clientWidth, cont.clientHeight);
  canvas.parent(cont);

  pgGrid = createGraphics(cont.clientWidth, cont.clientHeight);

  for (var i = 0; i < params.linesNum; i++) {
    var x = random(width);
    var noiseY = random(10);
    var al = new AuroraLine(x, noiseY);
    auroralines.push(al);
  }
}

function draw() {
  pgGrid.fill(0, 30);
  pgGrid.noStroke();
  pgGrid.rect(0,0, width,height);
  showParams();

  auroralines.forEach((al) => {
    al.run(pgGrid);
  });

  // pgGrid.filter(BLUR, 3);
  image(pgGrid, 0, 0);

  loadPixels();
  pgGrid.loadPixels();
  console.log(pgGrid.pixels)
  debugger;

  for (x = 0; x < 50; x++) {
    for (y = 0; y < 50; y++) {
      var r = 1;
      var distance = null;
      var maxDistance = 20;

      while (r < maxDistance && distance === null) {
        for (pgx = x-r; pgx < x+r; pgx+=10) {
          for (pgy = y-r; pgy < y+r; pgy+=10) {
            var pgRgba = getRetinaPixel(pgx, pgy, pgGrid.pixels);
            // if (pgy % 150 === 0) { console.log(pgRgba); }
            if (pgRgba[1] > 200) {
              distance = r;
            }
          }
        }
        r += 1;
      }
      

      var c = color(255,0,0);
      if (distance !== null) {
        c = color(map(distance, 0, maxDistance, 10, 200));
      }

      setRetinaPixel(x, y, c, pixels);
      
    }
  }

  updatePixels();
  pgGrid.loadPixels();

}

// --------------------------------------------------------------
// Class AuroraLine
// --------------------------------------------------------------

function AuroraLine (x, noiseY) {
  this.x = x;
  this.angle = random(-30, 30);
  this.noiseY = noiseY;
  this.coarse = 0.003;
  this.timeIncrement = 0.003;

  this.run = function(pg) {
    this.update();
    this.display(pg);
  };

  this.update = function(){
    this.noiseY += this.timeIncrement;
  }

  this.display = function(pg) {
    pg.stroke(0, 200, 0, 100);
    pg.strokeWeight(5);
    pg.noFill();
    var xoff = 0;
    pg.beginShape();
    for (var y = 0; y <= height; y++) {
      var x = (noise(xoff, this.noiseY) - 0.5) * width/3 + this.x;

      var xAngle = (y - height/2) / height * 2
      // console.log(xAngle)

      xoff += this.coarse;
      pg.vertex(x, y);
    }
    pg.endShape();
  }
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

var cont = document.getElementById("p5-canvas-container");
$(cont).click(function () {
  $(this).toggleClass("blurred");
});

// --------------------------------------------------------------
// Class Field
// --------------------------------------------------------------

// function Field (x) {
//   // params.fieldSize = 20;
//   this.rows = floor(height/params.fieldSize);
//   this.cols = floor(width/params.fieldSize);
//   this.flowField = [];
//   this.noiseZ = 0;
//   this.timeIncrement = 0.005;
//   this.coarse = 0.03;
//   this.magnitude = 1;
//   this.showVectors = true;

//   this.run = function () {
//     this.update();
//     if (this.showVectors) {
//       this.display();
//     }
//   }

//   this.update = function () {
//     this.noiseZ += this.timeIncrement;
//     let yoff = 0;
//     stroke(50, 50);
//     strokeWeight(1);
//     for (let i = 0; i < this.rows; i++) {
//       let xoff = 0;
//       for (let j = 0; j < this.cols; j++) {
//         let index = j + i * this.cols;
//         let flow = noise(xoff, yoff, this.noiseZ) * TWO_PI * 2;
//         xoff += this.coarse;
//         let v = p5.Vector.fromAngle(flow/4);
//         v.setMag(this.magnitude);
//         this.flowField[index] = v;
//       }
//       yoff += this.coarse;
//     }
//   }

//   this.display = function () {
//     for (let i = 0; i < this.rows; i++) {
//       for (let j = 0; j < this.cols; j++) {
//         let index = j + i * this.cols;
//         var v = this.flowField[index];
//         push();
//         translate(j * params.fieldSize, i * params.fieldSize);
//         rotate(v.heading());
//         line(0, 0, params.fieldSize, 0);
//         pop();
//       }
//     }
//   }
// }

// --------------------------------------------------------------
// Class Particle
// --------------------------------------------------------------

// function Particle() {
//   this.pos = createVector(random(width), random(height));
//   this.vel = createVector(0, 0);
//   this.acc = createVector(0, 0);
//   this.prevPos = createVector(0, 0);//this.pos;

//   this.update = function() {
//     this.vel.add(this.acc);
//     this.vel.limit(20);
//     this.prevPos.x = this.pos.x;
//     this.prevPos.y = this.pos.y;
//     this.pos.add(this.vel);
//     this.acc.mult(0);

//     this.pos.x = (this.pos.x + width) % width;
//     this.pos.y = (this.pos.y + height) % height;
//     if(abs(this.pos.x-this.prevPos.x) > width/2 || abs(this.pos.y-this.prevPos.y) > height/2) {
//       this.prevPos.x = this.pos.x;
//       this.prevPos.y = this.pos.y;
//     }
//   }

//   this.applyForce = function (force) {
//     this.acc.add(force);
//   }

//   this.follow = function (vectors) {
//     let x = floor(this.pos.x / params.fieldSize);
//     let y = floor(this.pos.y / params.fieldSize);
//     let cols = floor(width/params.fieldSize);
//     let index = x + y * cols;
//     let force = vectors[index];
//     this.applyForce(force);
//   }

//   this.display = function() {
//     strokeWeight(2);
//     stroke(255,0,0);
//     line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
//   }
// }
