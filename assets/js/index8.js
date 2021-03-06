// P5 — Feedback
// https://editor.p5js.org/allison.parrish/sketches/SkyDuiiWx

// P5 — Audio spectrum analysis from mic
// https://p5js.org/examples/sound-frequency-spectrum.html

// P5 — Glitch example
// https://editor.p5js.org/jeremydouglass/sketches/L13wuQ2hg

// 1680 x 1050 (real 3360 x 2100) macbook display with highest resolution
// 1680 x 945  (real 3360 x 1890) is 16/9 ratio


// Keyboard
// ↑ add line
// ↓ remove line
// ← or 'g' 'glitch2' effect
// → 'skeleton' effect (code vacum)
// 'r' reset background faster
// 'f' or noise (uses mic) 'brilla' effect


// --------------------------------------------------------------
// Vars
// --------------------------------------------------------------

let auroraSystem;
let canvas;
let palette;
let pgEffects;
let lastImage;
let raw, data, currentDataPoint, dataStats;
let mic, fft, audioStats;
let skeleton = false;
let glitch2 = false;
let reset = false;
let params = {
  "click left/right": "add/remove lines",
  "linesNum": 0,
  // "effects": [],
  "frameRate": 0,
};

// --------------------------------------------------------------
// P5 loop structure
// --------------------------------------------------------------

function preload () {
  raw = loadJSON("./assets/data/TA114xx-genova.json");
}

function setup() {
  data = raw["juice"];
  dataStats = getStats(data);
  console.log(dataStats);
  palette = {
    "violet":     color(110, 14, 255),
    "green":      color(95, 255, 154),
    "acid":       color(0, 255, 0),
    "pea":        color(67, 255, 117),
    "greyolet":   color(95, 96, 181),
    "cyan":       color(55, 252, 222),
    "chillgreen": color(60, 228, 152),
    "pink":       color(247, 105, 247),    
  };
  
  var cont = document.getElementById("p5-canvas-container");
  canvas = createCanvas(cont.clientWidth, cont.clientHeight);
  canvas.parent(cont);
  frameRate(30);

  auroraSystem = new AuroraSystem();
  for (var i = 0; i < params.linesNum; i++) {
    auroraSystem.addRandomLine();
  }
  pgEffects = createGraphics(width, height);
  // console.log(data);

  // p5_sound
  mic = new p5.AudioIn();
  mic.start();
  fft = new p5.FFT();
  fft.setInput(mic);
  audioStats = new AudioStats(fft);
}

function draw() {

  audioStats.update();
  if (audioStats.detect("treble", 1.1)) {
    console.log("DETECTED");
    if (auroraSystem.lines.length > 0) {
      random(auroraSystem.lines).addEffect("brilla", 1, {"displace": 25, "fadeLine": true}); 
    }
  }

  currentDataPoint = data[floor(frameCount/5) % data.length];
  background(0);
  if (skeleton) {
    codeBg();
  }
  if (lastImage) {
    if (!skeleton) {
      var grow = reset ? 5 : 3;
      image(lastImage, -grow, -grow, width + grow * 2, height + grow * 2);
    }
  }
  pgEffects.clear();
  var tint = getBgTint();
  
  // V1
  // var bgc = changeBrightness(tint, 70);
  // fill(red(bgc), green(bgc), blue(bgc), 5);
  
  // V2
  var op = reset ? 15 : 4;
  var lg = reset ? 110 : 50;
  var bgc = changeBrightness(tint, lg);
  fill(red(bgc), green(bgc), blue(bgc), op);

  noStroke();
  rect(0,0, width,height);
  auroraSystem.run();
  if (!skeleton) {
    lastImage = get();
  }
  if (glitch2) {
    image(glitchEffect2(lastImage), 0,0);
  }
  image(pgEffects, 0, 0);
  // if (lastImage) { showParams(); }
}

// --------------------------------------------------------------
// Background & data
// --------------------------------------------------------------

function codeBg () {
  fill(255);
  noStroke();
  textFont("Menlo");

  // var times = noise(frameCount * 0.01) * 1000;
  var times = Easy.easeInQuad(currentDataPoint["TA11415"] / dataStats["TA11415"].max) * 1000;

  for (let i = 0; i < times; i++) {
    const size = floor(random() * 10) + 12;
    const x = random() * width;
    const y = random() * height;
    const opacity = random() * 255;
    const str = JSON.stringify(currentDataPoint);
    const maxLength = 4;
    const start = floor(random() * (str.length - maxLength));
    const end = start + floor(random() * maxLength);
    textSize(size);
    text(str.substring(start, end), x, y, width);
  }
}

function getBgTint() {
  var bgColors = [palette.violet, palette.green, palette.acid, palette.pea, palette.greyolet, palette.cyan, palette.chillgreen, palette.pink, palette.violet];
  var every = 500;
  var amt = (frameCount % every) / every;
  return interpolateNColors(bgColors, amt);
}

function glitchEffect2 (image) {
  image.loadPixels();
  let pxls = new Uint8Array(image.pixels);
  image.updatePixels();
  let start = floor(random(0, pxls.length * 0.8));
  let length = floor(random(0, pxls.length - start));
  let section = pxls.slice(start, start + length);
  section.reverse();
  pxls.set(section, start);
  let newImage = createImage(image.width, image.height);
  newImage.loadPixels();
  newImage.pixels.set(pxls, 0);
  newImage.updatePixels();
  if (random() < 0.1) {
    newImage.filter(THRESHOLD, 0.8); // BELLO
  } else {
    newImage.filter(POSTERIZE, 20);
    newImage.filter(THRESHOLD, 0.5);
  }
  return newImage;
}

// function glitchEffect (image) {
//   var glitchlen = int(random(4,2400))*4;
//   let channelshift = int(random(0,4));
//   image.loadPixels();
//   // let start = random(0, image.pixels.length);
//   let start = image.pixels.length * 0.5
//   for(let i = start; i < image.pixels.length - glitchlen; i = i + glitchlen) {
//     for(let p = channelshift; p < glitchlen; p += 4){
//       image.pixels[i+p] = image.pixels[i];
//       image.pixels[i+p+1] = image.pixels[i+1];
//       image.pixels[i+p+2] = image.pixels[i+2];
//       //image.pixels[i+p+3] = image.pixels[i+3];
//     }
//   }
//   image.updatePixels();
//   return image;
// }

// --------------------------------------------------------------
// Audio
// --------------------------------------------------------------


// --------------------------------------------------------------
// Data
// --------------------------------------------------------------

function getStats (data) {
  var stats = {};
  data.forEach(d => {
    Object.keys(d).forEach(k => {
      if (!stats.hasOwnProperty(k)) {
        stats[k] = {"min": 99999999999, "max": -99999999999};
      }
      if (d[k] < stats[k].min) {
        stats[k].min = d[k];
      }
      if (d[k] > stats[k].max) {
        stats[k].max = d[k];
      }
    });
  });
  return stats;
}

function getDataDesc (key) {
  var texts = {
    "TA114422": "Corso Firenze - Genova; Tipo zona: Urbana; Tipo postazione: Fondo;Biossido Azoto - monocanale continuo, convertitore catalittico   chemiluminescenza (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114431": "Corso Firenze - Genova; Tipo zona: Urbana; Tipo postazione: Fondo;Biossido Di Zolfo - continuo, fluorescenza (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114440": "Corso Firenze - Genova; Tipo zona: Urbana; Tipo postazione: Fondo;Monossido Carbonio - continuo, fotometrico ir (mg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114450": "Corso Firenze - Genova; Tipo zona: Urbana; Tipo postazione: Fondo;Pm10 - camp. continuo, raggi beta (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114458": "Corso Firenze - Genova; Tipo zona: Urbana; Tipo postazione: Fondo;Pm2,5 - camp. continuo, raggi beta (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114620": "Multedo - Pegli - Genova; Tipo zona: Urbana; Tipo postazione: Industria;Biossido Azoto - monocanale continuo, convertitore catalittico   chemiluminescenza (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114630": "Multedo - Pegli - Genova; Tipo zona: Urbana; Tipo postazione: Industria;Pm10 - camp. continuo, raggi beta (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114639": "Multedo Villa Chiesa - Genova; Tipo zona: Urbana; Tipo postazione: Industria;Benzene - gc/pid (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114652": "Multedo Villa Chiesa - Genova; Tipo zona: Urbana; Tipo postazione: Industria;Biossido Di Zolfo - continuo, fluorescenza (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA11415": "Corso Europa - Via S. Martino - Genova; Tipo zona: Urbana; Tipo postazione: Traffico;Benzene - gc/pid (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114224": "Corso Europa - Via S. Martino - Genova; Tipo zona: Urbana; Tipo postazione: Traffico;Biossido Azoto - monocanale continuo, convertitore catalittico   chemiluminescenza (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114240": "Corso Europa - Via S. Martino - Genova; Tipo zona: Urbana; Tipo postazione: Traffico;Monossido Carbonio - continuo, fotometrico ir (mg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114250": "Corso Europa - Via S. Martino - Genova; Tipo zona: Urbana; Tipo postazione: Traffico;Pm10 - camp. continuo, raggi beta (microg/m3);dati dal 01/01/2022 al 31/12/2022",
    "TA114431": "Corso Europa - Via S. Martino - Genova; Tipo zona: Urbana; Tipo postazione: Traffico;Pm2,5 - camp. continuo, raggi beta (microg/m3);dati dal 01/01/2022 al 31/12/2022",
  };
  return texts[key];
}

// --------------------------------------------------------------
// Class AudioStats
// --------------------------------------------------------------

function AudioStats (fft) {
  this.fft = fft;
  this.i = 0;
  this.past = [];
  this.pastItemsNum = 3;
  this.lastDetected = {};

  this.update = function () {
    let spectrum = this.fft.analyze();
    let item = {
      "bass":     floor(fft.getEnergy("bass")),
      "lowMid":   floor(fft.getEnergy("lowMid")),
      "mid":      floor(fft.getEnergy("mid")),
      "highMid":  floor(fft.getEnergy("highMid")),
      "treble":   floor(fft.getEnergy("treble")),
    };
    this.past.unshift(item);
    if (this.past.length > this.pastItemsNum) {
      this.past.pop();
    }
    this.i++;
  }

  this.ready = function () {
    return this.past.length >= this.pastItemsNum;
  }

  /**
   * looks if there has been an increase in energy compared to the stored past stats
   * @param freqRange — string "bass|lowMid|mid|highMid|treble"
   * @param increaseFactor — number
   * */
  this.detect = function (freqRange, increaseFactor = 1.5) {
    if (!this.ready()) { return false; }
    if (this.lastDetected.hasOwnProperty(freqRange) && this.lastDetected[freqRange] > this.i - this.pastItemsNum) { 
      return false; 
    }
    let detected = false;
    const now = this.past[0];
    const that = this;
    this.past.forEach((item, i) => {
      if (i === 0) { return; }
      if (now[freqRange] > item[freqRange] * increaseFactor) {
        detected = true;
        that.lastDetected[freqRange] = that.i;
      }
    });
    return detected;
  }

  // function updateAudioStats (spectrum) {
  //   const sum = spectrum.reduce((partialSum, a) => partialSum + a, 0);
  //   return sum;
  // }

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
  this.verticalIncrement = random() * 0.3 + 0.2;
  this.effects = [];
  this.color = palette.green;
  // this.color = palette.violet;

  this.addEffect = function (name, duration, options) {
    var effect = {
      "name": name,
      "duration": duration,
      "life": 1,
      "options": options,
    };
    this.effects.push(effect);
  }

  this.run = function () {
    this.update();
    this.display();
  }

  this.update = function () {

    // --- line

    this.life += this.lifeIncrement;
    if (this.life < this.transitionDuration) {
      this.intensity = map(this.life, 0, this.transitionDuration, 0, 1);
    } else if (this.dyeAt !== null && this.life > this.dyeAt - this.transitionDuration) {
      this.intensity = map(this.life, this.dyeAt - this.transitionDuration, this.dyeAt, 1, 0);
    }
    
    // Randomly up or down
    this.yDelta = (noise(this.randomOffset + this.life * this.coarse) - 0.5) * 5;

    // Fixed direction
    // this.yDelta = -noise(this.randomOffset + this.life * this.coarse) * 0.5 + 1;

    this.y += this.yDelta;
    if ((this.y < 0 || this.y > height) && this.dyeAt === null) {
      this.kill();
    }

    // --- effects

    for (var i = this.effects.length - 1; i >= 0; i--) {
      var eff = this.effects[i];
      var advancement = 1 / eff.duration / frameRate();
      eff.life -= advancement;
      if (eff.life < 0) {
        this.effects.splice(i, 1);
      }
    }
  }

  this.display = function () {

    var normOpacity = 1;
    this.effects.forEach(eff => {
      if (eff.name === "brilla" && eff.options && eff.options.fadeLine) {
        var effIntensity = (0.5 - abs(eff.life - 0.5)) * 2; // 0 > 1 > 0
        normOpacity = easeInExpo(1 - effIntensity);
      }
    });

    colorMode(RGB, 255);
    var dcolor = color(this.color, this.intensity * this.normOpacity * 255);
    if (skeleton) {
      dcolor = color(255, 10);
    }
    // var dweight = this.intensity * 3;
    var dweight = this.intensity * 4;

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
    for (x = width * xstart; x < width * xend; x++) {
      var pos = this.getXPoint(x);
      vertex(pos.x, pos.y);
    }
    endShape();

    this.effects.forEach(eff => {
      if (eff.name === "brilla") {
        pgEffects.fill(palette.acid);
        pgEffects.fill(255);
        pgEffects.noStroke();
        var effIntensity = (0.5 - abs(eff.life - 0.5)) * 2; // 0 > 1 > 0
        var prob = effIntensity * 0.7;
        for (x = width * xstart; x < width * xend; x++) {
          if (random() < prob) {
            var pos = this.getXPoint(x);
            if (eff.options && eff.options.displace) {
              pos.x += (random() - 0.5) * eff.options.displace * pow(effIntensity, 28);
              pos.y += (random() - 0.5) * eff.options.displace * pow(effIntensity, 28);
            }
            pgEffects.rect(pos.x, pos.y, 1.5,1.5);
            if (random() < 0.01) {
              // pgEffects.rect(pos.x, pos.y, 1,15);
              pgEffects.rect(pos.x, pos.y, 1.5, constrain(-this.yDelta * 30, -8, 8));
            }
          }
        }
      }
    });
  }

  this.getXPoint = function (x) {
    var noiseX = noise(this.randomOffset, x * this.coarse, this.life);
    var noiseY = noise(this.randomOffset + 1000, this.life, x * this.coarse + this.randomOffset);
    var incX = (noiseX - 0.5) * width * 0.7;
    var incY = (noiseY - 0.5) * width * this.verticalIncrement;
    return createVector(x + incX, this.y + incY);
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

  this.addRandomLine = function () {
    var y = height * 0.3 + random(height * 0.4);
    this.addLine(y);
  }

  this.addLine = function (y) {
    var al = new AuroraLine(y);
    this.lines.push(al);
  }

  this.killOldestLine = function () {
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
    // auroraSystem.addRandomLine();
    auroraSystem.addLine(mouseY);
  } else {
    auroraSystem.killOldestLine();
  }
}

function keyPressed () {
  console.log(keyCode);
  if (keyCode === LEFT_ARROW) { 
    glitch2 = true;
  }
  if (keyCode === UP_ARROW) { 
    auroraSystem.addLine(random() * height * 0.5 + height * 0.25); 
  }
  if (keyCode === DOWN_ARROW) { 
    auroraSystem.killOldestLine();
  }
  
  if (keyCode === RIGHT_ARROW) { skeleton = true; }
  if (keyCode === 70  /* f */) { 
    random(auroraSystem.lines).addEffect("brilla", 1, {"displace": 25, "fadeLine": true}); 
  }
  if (keyCode === 71  /* g */) { glitch2 = true; }
  if (keyCode === 82  /* r */) { reset = true; }
}

function keyReleased () {
  // console.log(keyCode);
  if (keyCode === LEFT_ARROW) { glitch2 = false; }
  if (keyCode === RIGHT_ARROW) { skeleton = false; }
  if (keyCode === 71  /* g */) { glitch2 = false; }
  if (keyCode === 82  /* r */) { reset = false; }
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
  params.frameRate = frameRate();
  var i = 0;
  for (prop in params) {
    var string = prop + ": " + params[prop];
    text(string, 30, 30 + i * lh);
    i++;
  }
}

function getRandomDataValue () {
  return Math.random();
}


function changeBrightness (c, brightness) {
  push();
  colorMode(HSB, 255);
  var h = hue(c);
  var s = saturation(c);
  var col = color(h, s, brightness);
  pop();
  return col;
}


/**
 * via https://gist.github.com/gre/1650294
 * 
 * Easing Functions - inspired from http://gizma.com/easing/
 * only considering the t value for the range [0, 1] => [0, 1]
 */
Easy = {
  // no easing, no acceleration
  linear: t => t,
  // accelerating from zero velocity
  easeInQuad: t => t*t,
  // decelerating to zero velocity
  easeOutQuad: t => t*(2-t),
  // acceleration until halfway, then deceleration
  easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
  // accelerating from zero velocity 
  easeInCubic: t => t*t*t,
  // decelerating to zero velocity 
  easeOutCubic: t => (--t)*t*t+1,
  // acceleration until halfway, then deceleration 
  easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
  // accelerating from zero velocity 
  easeInQuart: t => t*t*t*t,
  // decelerating to zero velocity 
  easeOutQuart: t => 1-(--t)*t*t*t,
  // acceleration until halfway, then deceleration
  easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
  // accelerating from zero velocity
  easeInQuint: t => t*t*t*t*t,
  // decelerating to zero velocity
  easeOutQuint: t => 1+(--t)*t*t*t*t,
  // acceleration until halfway, then deceleration 
  easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}

function easeInExpo (x) {
  return x === 0 ? 0 : Math.pow(2, 10 * x - 10);
}
function easeOutExpo (x) {
  return x === 1 ? 1 : 1 - pow(2, -10 * x);
}

// --------------------------------------------------------------
// JS Events
// --------------------------------------------------------------

