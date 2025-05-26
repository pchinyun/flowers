let mic, amplitude;
let flower;
let particles = [];
let threshold = 0.05;

function preload() {
  flower = loadModel('./strangeFlower.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);

  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();
  userStartAudio();
  mic.start();
  amplitude.setInput(mic);
}

function draw() {
  background(0);
  directionalLight(255, 255, 255, 0, 0, -1);
  ambientLight(100);

  let level = amplitude.getLevel();
  let boostedLevel = level * 5; 
  // console.log("Boosted Level:", boostedLevel);

  
  rotateX(frameCount * 0.2);
  rotateY(frameCount * 0.3);

  // When audio is detected above threshold, spawn rotating flowers
  if (boostedLevel > threshold && random(1) > 0.8) {
    let x = random(-200, 200);
    let y = random(-200, 200);
    let z = random(-200, 200);
    let pos = createVector(x, y, z);

    particles.push(new FlowerParticle(pos));
  }

  
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();

    if (particles[i].isOffscreen()) {
      particles.splice(i, 1);
    }
  }
}

// Flower Particle class
class FlowerParticle {
  constructor(pos) {
    this.pos = pos.copy();
    this.vel = p5.Vector.random3D().mult(random(1, 3));
    this.rot = createVector(random(360), random(360), random(360));
    this.rotSpeed = createVector(random(0.5, 1.5), random(0.5, 1.5), random(0.5, 1.5));
    this.scale = random(0.4, 1.2);
  }

  update() {
    this.pos.add(this.vel);
    this.rot.add(this.rotSpeed);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);
    scale(this.scale);
    normalMaterial();
    model(flower);
    pop();
  }

  isOffscreen() {
    return this.pos.mag() > 800; 
  }
}


 

