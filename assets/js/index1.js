// Cool Beans

// This is a template for creating a looping animation in p5.js (JavaScript).
// When you press the 'F' key, this program will export a series of images into
// your default Downloads folder. These can then be made into an animated gif.
// This code is known to work with p5.js version 0.6.0
// Prof. Golan Levin, 28 January 2018

// INSTRUCTIONS FOR EXPORTING FRAMES (from which to make a GIF):
// 1. Run a local server, using instructions from here:
//    https://github.com/processing/p5.js/wiki/Local-server
// 2. Set the bEnableExport variable to true.
// 3. Set the myNickname variable to your name.
// 4. Run the program from Chrome, press 'f'.
//    Look in your 'Downloads' folder for the generated frames.
// 5. Note: Retina screens may export frames at twice the resolution.

//===================================================
// User-modifiable global variables.
var myNickname = "lampsauce";
var nFramesInLoop = 240; //120;
var bEnableExport = true;
var e = new p5.Ease();

// Other global variables you don't need to touch.
var nElapsedFrames;
var bRecording;
var theCanvas;

//===================================================
function setup() {
  theCanvas = createCanvas(1280, 720);
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  theCanvas.position(x, y);
  bRecording = false;
  nElapsedFrames = 0;
}

//===================================================
function keyTyped() {
  if (bEnableExport) {
    if (key === "f" || key === "F") {
      bRecording = true;
      frameRate(2); // while we're exporting
      nElapsedFrames = 0;
    }
  }
}

//===================================================
function draw() {
  // Compute a percentage (0...1) representing where we are in the loop.
  var percentCompleteFraction = 0;
  if (bRecording) {
    percentCompleteFraction = float(nElapsedFrames) / float(nFramesInLoop);
  } else {
    percentCompleteFraction =
      float(frameCount % nFramesInLoop) / float(nFramesInLoop);
  }

  // Render the design, based on that percentage.
  // This function renderMyDesign() is the one for you to change.
  renderMyDesign(percentCompleteFraction);

  // If we're recording the output, save the frame to a file.
  // Note that the output images may be 2x large if you have a Retina mac.
  // You can compile these frames into an animated GIF using a tool like:
  if (bRecording && bEnableExport) {
    var frameOutputFilename =
      myNickname + "_frame_" + nf(nElapsedFrames, 4) + ".png";
    print("Saving output image: " + frameOutputFilename);
    saveCanvas(theCanvas, frameOutputFilename, "png");
    nElapsedFrames++;

    if (nElapsedFrames >= nFramesInLoop) {
      bRecording = false;
      frameRate(60);
    }
  }
}

// --------------------------------------------------
// AP TEST
// --------------------------------------------------
function renderMyDesignAp(percent) {
  background("#1E1E1F");
  fill(255);
  rect(frameCount%width, 10, 10, 10);
}


//===================================================
function renderMyDesign(percent) {
  //
  // THIS IS WHERE YOUR ART GOES.
  // This is an example of a function that renders a temporally looping design.
  // It takes a "percent", between 0 and 1, indicating where we are in the loop.
  // Use, modify, or delete whatever you prefer from this example.
  // This example uses several different graphical techniques.
  // Remember to SKETCH FIRST!

  //----------------------
  // here, I set the background and some other graphical properties
  background("#1E1E1F");
  // background(0);
  // background(255);


  //----------------------
  // Here's a linearly-moving square
  noStroke();
  var squareSize = 20;
  var topY = 0 - squareSize - 2;
  var botY = height + 2;
  var sPercent = (percent + 0.5) % 1.0; // shifted by a half-loop
  var yPosition = map(sPercent, 0, 1, topY, botY);
  fill(255);
  ellipse(230, yPosition, 20, 20);

  //----------------------
  // Here's a sigmoidally-moving pink square!
  // This uses the "Double-Exponential Sigmoid" easing function
  // ripped from From: https://idmnyu.github.io/p5.js-func/
  // Really, you should just include this library!!
  var eased = e.doubleExponentialSigmoid(percent, 0.7);
  eased = (eased + 0.5) % 1.0; // shifted by a half-loop, for fun
  var yPosition2 = map(eased, 0, 1, topY, botY);
  fill(255);
  ellipse(260, yPosition2, 20, 20);

  var xpos = map(e.hermite2(sin(percent * TWO_PI)), -1, 1, width + squareSize, width - 100);
  var xpos1 = map(e.hermite(sin(percent * TWO_PI)), -1, 1, width + squareSize, width - 100);
  ellipse(xpos, height / 2 + 80, 10, 10);
  ellipse(xpos1, height / 2 + 120, 10, 10);

  var px = width / 3;
  var py = (height * 2) / 3;
  // var px = mouseX,
  //   py = mouseY;

  // Yellow Horizontal Planes in TOP LEFT
  var mag = 25 // magnitude
  var space = sin(e.cubicBezier(percent) * TWO_PI) * mag + mag;
  drawPlane(100, 100, px, py, 0, 200, 100, "#ebba505f", false, 10);
  drawPlane(100, 100 + space, px, py, 0, 200, 200, "#ebba505f", false, 10);
  drawPlane(100, 100 + space * 2, px, py, 0, 400, 100, "#ebba505f", false, 10);

  // Red Vertical Planes in MID RIGHT
  mag = 30
  space = cos((percent) * TWO_PI) * mag + mag;
  drawPlane(width - 400, 140 + space * 4, px, py, 1, 200, 200, "#E95A535f", true, 50);
  drawPlane(width - 400 + space, 140 + space * 2, px, py, 1, 300, 150, "#E95A53", true, 10);
  drawPlane(width - 400 + space * 2, 140, px, py, 1, 400, 100, "#E95A53", true, 1);

  // Purple Horizontal Planes in MID RIGHT
  mag = 80;
  space = sin((1 - percent) * TWO_PI) * mag + mag;
  drawPlane(width - 400, 200 - space * 2, px, py, 0, 200, 100, "#4a48a8", true, 3);
  drawPlane(width - 400, 220 - space, px, py, 0, 200, 100, "#4a48a85f", false, 10);
  drawPlane(width - 400, 240 - space / 2, px, py, 0, 400, 100, "#4a48a8", true, 10);

  // Vertical Planes in MID LEFT
  mag = 20;
  space = sin((1 - percent) * TWO_PI) * mag + mag;
  drawPlane(300, 140 + space * 4, px, py, 1, 200, 200, "#E95A53", true, 10);
  drawPlane(300 + space, 140 + space * 2, px, py, 1, 300, 150, "#ebba50", true, 10);
  drawPlane(100 + space * 2, 140 + space, px, py, 1, 300, 100, "#4a48a85f", false, 10);
  drawPlane(300 + space * 2, 140, px, py, 1, 400, 100, "#E95A533f", false, 10);

  // Horizontal Planes in BOTTOM
  space = sin(percent * TWO_PI) * mag + mag;
  drawPlane(300 - space * 2, height - 140, px, py, 0, 400, 100, "#E95A53", true, 10);
  drawPlane(200 + space * 2, height - 170, px, py, 0, 200, 50, "#4a48a8", true, 3);

  drawPlane(width - 300 - space * 2, height - 170, px, py, 0, 100, 20, "#ebba508f", false, 3);
  drawPlane(width - 300 - space * 4, height - 120, px, py, 0, 100 + space * 4, 20, "#ebba508f", false, 3);

  // Thin Vertical Frames in LOWER RIGHT
  space = sin(e.doubleCubicOgeeSimplified(percent) * TWO_PI) * mag + mag;
  drawPlane(1000, height - 150 - space, px, py, 1, 100 - space, 80, "#E95A53", true, 3);
  drawPlane(900 + space * 2, height - 150, px, py, 1, 100, 100, "#E95A53", true, 3);
  drawPlane(1050 + space, height - 150, px, py, 1, 100, 10 + space, "#4a48a8", true, 7);
  drawPlane(800, 200, px, py, 1, 400, 100 + space, "#ebba50", true, 3);

  // Yellow Horizontal Planes in MID RIGHT
  // space = sin((percent) * TWO_PI) * mag + mag;
  // drawPlane(width - 200, 300, px, py, 0, 300, 50, "#ebba505f", false, 10);
  // drawPlane(width - 200, 310 + space, px, py, 0, 300, 50, "#ebba505f", false, 10);
  // drawPlane(width - 200, 320 + space * 2, px, py, 0, 300, 50, "#ebba505f", false, 10);

  space = sin(e.cubicBezier(percent) * TWO_PI) * mag + mag;
  for (let i = 0; i < 30; i++) {
    drawPlane(width / 2 + 500, 50 + i * space / 3, px, py, 0, 10, 20, "#ebba50", true, 1);
    drawPlane(30 + i * space / 5, height - 100, px, py, 1, 10, 10, "#E95A53", false, 0);
  }

  mag = 270;
  space = abs(sin((percent) * PI) + 0.1) * mag;

  // Yellow Arcs
  var r = 300;
  push();
  translate(800, 200);
  rotate(radians(space) / 2);

  noFill();
  stroke("#ebba508f");
  strokeWeight(40);
  arc(0, 0, r, r, 0, radians(space));

  strokeWeight(20);
  arc(0, 0, r, r, 0, radians(space));

  stroke("#ebba508f");
  strokeWeight(20);
  arc(0, 0, r / 3 * 2, r / 3 * 2, radians(space) / 2, 0);

  stroke("#ebba50");
  strokeWeight(10);
  arc(0, 0, r / 2, r / 2, radians(space) + PI, -PI);
  pop();

  // Purple Arcs
  push();
  translate(400, 400);
  rotate(radians(space) / 4);

  noFill();
  stroke('#4a48a88F');
  strokeWeight(40);
  arc(0, 0, 200, 200, -PI, radians(space) / 4);
  strokeWeight(20);
  arc(0, 0, 200, 200, -PI, radians(space) / 4);
  strokeWeight(10);
  arc(0, 0, 200, 200, -PI, radians(space) / 4);


  stroke('#4a48a8');
  arc(0, 0, 100, 100, 0, TWO_PI);

  pop();

  // Red Arcs
  // push();
  // translate(width - 200, height - 300);
  // rotate(map(percent, 0, 1, 0, TWO_PI));

  // noFill();
  // stroke('#E95A538F');
  // strokeWeight(20);
  // arc(0, 0, 100, 100, 0, radians(space));
  // strokeWeight(10);
  // arc(0, 0, 100, 100, 0, radians(space));

  // pop();

}

function drawPlane(x, y, px, py, axis, length, width, c, str, sw) {
  if (str) {
    stroke(c);
    strokeWeight(sw);
    noFill();
  } else {
    noStroke();
    fill(c);
  }

  let slope1 = (y - py) / (x - px);
  if (axis == 0) {
    let slope2 = (y - py) / (x + length - px);
    beginShape();
    vertex(x, y);
    vertex(x + length, y);
    vertex(x + length + width * (1 / slope2), y + width);
    vertex(x + width * (1 / slope1), y + width);
    endShape(CLOSE);
  }
  if (axis == 1) {
    let slope2 = (y + length - py) / (x - px);
    beginShape();
    vertex(x, y);
    vertex(x, y + length);
    vertex(x - width, y + length - width * slope2);
    vertex(x - width, y - width * slope1);
    endShape(CLOSE);
  }
}
