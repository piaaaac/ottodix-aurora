
// --------------------------------------------------------------
// Vars
// --------------------------------------------------------------

let system;

// --------------------------------------------------------------
// P5 loop structure
// --------------------------------------------------------------

function setup() {
  var cont = document.getElementById("p5-canvas-container");
  var canvas = createCanvas(cont.clientWidth, cont.clientHeight);
  canvas.parent(cont);
  system = new ParticleSystem(createVector(width / 2, 50));
}

function draw() {
  background(51);
  system.addParticle();
  system.run();
}

// --------------------------------------------------------------
// Classes
// --------------------------------------------------------------

function Particle (position) {
  this.acceleration = createVector(0, 0.05);
  this.velocity = createVector(random(-1, 1), random(-1, 0));
  this.position = position.copy();
  this.lifespan = 255;

  this.run = function() {
    this.update();
    this.display();
  };

  // Method to update position
  this.update = function(){
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  };

  // Method to display
  this.display = function() {
    stroke(200, this.lifespan);
    strokeWeight(2);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  };
  
  this.isDead = function(){
    return this.lifespan < 0;
  };
}

function ParticleSystem (position) {
  this.origin = position.copy();
  this.particles = [];

  this.addParticle = function() {
    this.particles.push(new Particle(this.origin));
  };

  this.run = function() {
    for (let i = this.particles.length-1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };
}
