let myRec = new p5.SpeechRec();
let myVoice = new p5.Speech();

let inc = 0.1;
let scl = 20;
let cols, rows;
let zoff = 0;
let particles = [];
let flowField = [];

let myFont; 

function preload() {
  myFont = loadFont('./SpaceMono-Bold.ttf');
}


function setup() {
  createCanvas(800, 800, WEBGL); // ← Add WEBGL for 3D
  textFont(myFont);
  textSize(64);
  textAlign(CENTER, CENTER);

  cols = floor(width / scl);
  rows = floor(height / scl);
  flowField = new Array(cols * rows);

  myRec.continuous = true;
  myRec.interimResults = false;
  myRec.onResult = showResult;
  myRec.start();

  myVoice.speak("Say something");
}

function draw() {
  background(255);

  rotateX(-0.2); // slight tilt for 3D effect
  rotateY(0.2);

  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowField[index] = v;
      xoff += inc;
    }
    yoff += inc;
  }
  zoff += 0.0003;

  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowField);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function showResult() {
  if (myRec.resultValue) {
    let spokenText = myRec.resultString;
    myVoice.speak(spokenText);
    console.log("Heard:", spokenText);

    particles = [];

    let chars = spokenText.split(" ");

    for (let i = 0; i < chars.length; i++) {
      particles.push(new Particle(chars[i], i, chars.length));
    }
  }
}

class Particle {
  constructor(char, index, total) {
    this.char = char;
    this.pos = createVector(random(-width / 2, width / 2), random(-height / 2, height / 2));
    this.vel = createVector();
    this.acc = createVector();
    this.maxSpeed = 3;
    this.reformDelay = 120;

    let xSpacing = 20;
    let sentenceWidth = total * xSpacing;
    this.target = createVector((0 - sentenceWidth) / 2 + index * xSpacing, 0);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.reformDelay > 0) {
      this.reformDelay--;
    } else {
      let towardsTarget = p5.Vector.sub(this.target, this.pos);
      towardsTarget.setMag(0.05);
      this.applyForce(towardsTarget);
    }
  }

  follow(vectors) {
    let x = floor((this.pos.x + width / 2) / scl);
    let y = floor((this.pos.y + height / 2) / scl);
    let index = x + y * cols;
    if (index >= 0 && index < vectors.length) {
      this.applyForce(vectors[index]);
    }
  }

  edges() {
    if (this.pos.x > width / 2) this.pos.x = -width / 2;
    if (this.pos.x < -width / 2) this.pos.x = width / 2;
    if (this.pos.y > height / 2) this.pos.y = -height / 2;
    if (this.pos.y < -height / 2) this.pos.y = height / 2;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y, 0);

    // "3D Shadow" effect by layering
    fill(100); // shadow
    for (let z = 0; z < 6; z++) {
      translate(0, 0, -1);
      text(this.char, 0, 0);
    }

    fill(0); // front face
    text(this.char, 0, 0);
    pop();
  }
}


