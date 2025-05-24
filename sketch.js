let mic, amplitude;
let particles = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  // Wait for user gesture to start audio
  userStartAudio();
  mic.start();
  amplitude.setInput(mic);

  // create particles
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  background(0, 20); // slight trail effect
  let level = amplitude.getLevel();

  console.log(level);

  for (let p of particles) {
    p.update();
    p.display(level);
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.size = random(2, 5);
    this.baseSize = this.size;
  }

  update() {
    this.pos.add(this.vel);

    // bounce off edges
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }

  display(volume) {
    let volSize = map(volume, 0, 0.1, 0, 50, true);
    let petalLength = this.baseSize + volSize;
    let petalWidth = petalLength * 0.4;
    let petalCount = 6;
  
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(255, 100, 200, 180);
  
    for (let i = 0; i < petalCount; i++) {
      rotate(TWO_PI / petalCount);
      ellipse(0, petalLength / 2, petalWidth, petalLength);
    }
  
    pop();
  }
}  

