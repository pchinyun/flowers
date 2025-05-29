// ------------- text showing up with flowers ---------------

// let mic, amplitude;
// let flower;
// let particles = [];
// let threshold = 0.05;

// let myRec = new p5.SpeechRec();
// let myVoice = new p5.Speech();

// let inc = 0.1;
// let scl = 20;
// let cols, rows;
// let zoff = 0;
// let flowField = [];

// let myFont;

// function preload() {
//   myFont = loadFont('./Orange-Squash-Demo-BF6483cfe8b2bfc.otf');
//   flower = loadModel('./strangeFlower.obj', true);
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   textFont(myFont);
//   textSize(32);
//   textAlign(CENTER, CENTER);

//   cols = floor(width / scl);
//   rows = floor(height / scl);
//   flowField = new Array(cols * rows);

//   myRec.continuous = true;
//   myRec.interimResults = false;
//   myRec.onResult = showResult;
//   myRec.start();
//   myVoice.speak("Say something");

//   angleMode(DEGREES);

//   mic = new p5.AudioIn();
//   amplitude = new p5.Amplitude();
//   userStartAudio();
//   mic.start();
//   amplitude.setInput(mic);
// }

// function draw() {
//   background(0);
//   directionalLight(255, 255, 255, 0, 0, -1);
//   ambientLight(100);

//   let yoff = 0;
//   for (let y = 0; y < rows; y++) {
//     let xoff = 0;
//     for (let x = 0; x < cols; x++) {
//       let index = x + y * cols;
//       let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
//       let v = p5.Vector.fromAngle(angle);
//       v.setMag(1);
//       flowField[index] = v;
//       xoff += inc;
//     }
//     yoff += inc;
//   }
//   zoff += 0.0003;

//   let level = amplitude.getLevel();
//   let boostedLevel = level * 5;

//   // Generate flower when volume is detected
//   if (boostedLevel > threshold && random(1) > 0.8) {
//     particles.push(new Particle({
//       type: "flower",
//       model: flower
//     }));
//   }

//   // Update and display all particles
//   for (let i = particles.length - 1; i >= 0; i--) {
//     particles[i].follow(flowField);
//     particles[i].update();
//     particles[i].display();

//     if (particles[i].isOffscreen()) {
//       particles.splice(i, 1);
//     }
//   }
// }

// function showResult() {
//   if (myRec.resultValue) {
//     let spokenText = myRec.resultString;
//     myVoice.speak(spokenText);
//     console.log("Heard:", spokenText);

//     particles = [];

//     let chars = spokenText.split(" ");
//     for (let i = 0; i < chars.length; i++) {
//       // Text particle
//       particles.push(new Particle({
//         type: "text",
//         char: chars[i],
//         index: i,
//         total: chars.length
//       }));

//       // Bonus flower for each word
//       particles.push(new Particle({
//         type: "flower",
//         model: flower
//       }));
//     }
//   }
// }


// // Unified Particle class
// class Particle {
//   constructor(options) {
//     this.type = options.type; // "text" or "flower"
//     this.char = options.char || null;
//     this.model = options.model || null;

//     this.pos = options.pos || createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
//     this.vel = options.vel || p5.Vector.random3D().mult(random(1, 3));
//     this.acc = createVector();
//     this.maxSpeed = 3;
//     this.scale = random(0.4, 1.2);
//     this.rot = createVector(random(360), random(360), random(360));
//     this.rotSpeed = createVector(random(0.5, 1.5), random(0.5, 1.5), random(0.5, 1.5));

//     this.reformDelay = 120;
//     if (this.type === "text") {
//       let xSpacing = 20;
//       let index = options.index || 0;
//       let total = options.total || 1;
//       let sentenceWidth = total * xSpacing;
//       this.target = createVector((0 - sentenceWidth) / 2 + index * xSpacing, 0);
//     }
//   }

//   applyForce(force) {
//     this.acc.add(force);
//   }

//   update() {
//     this.vel.add(this.acc);
//     this.vel.limit(this.maxSpeed);
//     this.pos.add(this.vel);
//     this.acc.mult(0);

//     if (this.type === "text" && this.reformDelay > 0) {
//       this.reformDelay--;
//     } else if (this.type === "text") {
//       let towardsTarget = p5.Vector.sub(this.target, this.pos);
//       towardsTarget.setMag(0.05);
//       this.applyForce(towardsTarget);
//     }

//     this.rot.add(this.rotSpeed);
//   }

//   follow(vectors) {
//     let x = floor((this.pos.x + width / 2) / scl);
//     let y = floor((this.pos.y + height / 2) / scl);
//     let index = x + y * cols;
//     if (index >= 0 && index < vectors.length) {
//       this.applyForce(vectors[index]);
//     }
//   }

//   edges() {
//     if (this.pos.x > width / 2) this.pos.x = -width / 2;
//     if (this.pos.x < -width / 2) this.pos.x = width / 2;
//     if (this.pos.y > height / 2) this.pos.y = -height / 2;
//     if (this.pos.y < -height / 2) this.pos.y = height / 2;
//   }

//   display() {
//     push();
//     translate(this.pos.x, this.pos.y, this.pos.z);
//     rotateX(this.rot.x);
//     rotateY(this.rot.y);
//     rotateZ(this.rot.z);
//     scale(this.scale);

//     if (this.type === "flower" && this.model) {
//       normalMaterial();
//       model(this.model);
//     } else if (this.type === "text" && this.char) {
//       fill(100); // shadow
//       for (let z = 0; z < 6; z++) {
//         translate(0, 0, -1);
//         text(this.char, 0, 0);
//       }
//       fill(0); // front face
//       text(this.char, 0, 0);
//     }
//     pop();
//   }

//   isOffscreen() {
//     return this.pos.mag() > 800;
//   }
// }


 


//-----------------------------text showing up as words (use this) ------------

// let mic, amplitude;
// let flower;
// let particles = [];
// let threshold = 0.1;

// let myRec = new p5.SpeechRec();
// let myVoice = new p5.Speech();

// let inc = 0.1;
// let scl = 20;
// let cols, rows;
// let zoff = 0;
// let flowField = [];

// let myFont;

// function preload() {
//   myFont = loadFont('./GOTHICBI.TTF');
//   flower = loadModel('./strangeFlower.obj', true);
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL); 
//   textFont(myFont);
//   textSize(64);
//   textAlign(CENTER, CENTER);

//   cols = floor(width / scl);
//   rows = floor(height / scl);
//   flowField = new Array(cols * rows);

//   myRec.continuous = true;
//   myRec.interimResults = false;
//   myRec.onResult = showResult;  
//   myRec.start();
//   // myVoice.speak("Say something");

//   angleMode(DEGREES);

//   mic = new p5.AudioIn();
//   amplitude = new p5.Amplitude();
//   userStartAudio();
//   mic.start();
//   amplitude.setInput(mic);
// }

// function draw() {
//   background(0);
//   directionalLight(255, 255, 255, 0, 0, -1);
//   ambientLight(100);

//   let yoff = 0;
//   for (let y = 0; y < rows; y++) {
//     let xoff = 0;
//     for (let x = 0; x < cols; x++) {
//       let index = x + y * cols;
//       let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
//       let v = p5.Vector.fromAngle(angle);
//       v.setMag(1);
//       flowField[index] = v;
//       xoff += inc;
//     }
//     yoff += inc;
//   }
//   zoff += 0.0003;

//   let level = amplitude.getLevel();
//   let boostedLevel = level * 5;

//   // Generate flower when volume is detected
//   if (boostedLevel > threshold && random(1) > 0.8) {
//     particles.push(new Particle({
//       type: "flower",
//       model: flower
//     }));
//   }

//   // Update and display all particles
//   for (let i = particles.length - 1; i >= 0; i--) {
//     particles[i].follow(flowField);
//     particles[i].update();
//     particles[i].display();

//     if (particles[i].isOffscreen()) {
//       particles.splice(i, 1);
//     }
//   }
  
//   // Log every 30 frames to avoid spam
//   if (frameCount % 30 === 0) {
//     console.log("Audio level:", level.toFixed(6), "Boosted:", boostedLevel);
//   }
  
// }

// function showResult() {
//   if (myRec.resultValue) {
//     let spokenText = myRec.resultString;
//     myVoice.speak(spokenText);
//     console.log("Heard:", spokenText);

//     // Remove only text particles, keep flowers
//     particles = particles.filter(p => p.type !== "text");

//     let chars = spokenText.split(" ");
//     for (let i = 0; i < chars.length; i++) {
//       // Text particle
//       particles.push(new Particle({
//         type: "text",
//         char: chars[i],
//         index: i,
//         total: chars.length
//       }));

//       // Bonus flower for each word
//       particles.push(new Particle({
//         type: "flower",
//         model: flower
//       }));
//     }
//   }
// }

// // Unified Particle class
// class Particle {
//   constructor(options) {
//     this.type = options.type; // "text" or "flower"
//     this.char = options.char || null;
//     this.model = options.model || null;

//     this.pos = options.pos || createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
//     this.vel = options.vel || p5.Vector.random3D().mult(random(1, 3));
//     this.acc = createVector();
//     this.maxSpeed = 3;
//     this.scale = random(0.4, 1.2);
//     this.rot = createVector(random(360), random(360), random(360));
//     this.rotSpeed = createVector(random(0.5, 1.5), random(0.5, 1.5), random(0.5, 1.5));

//     this.reformDelay = 120;
//     if (this.type === "text") {
//       let xSpacing = 20;
//       let index = options.index || 0;
//       let total = options.total || 1;
//       let sentenceWidth = total * xSpacing;
//       this.target = createVector((0 - sentenceWidth) / 2 + index * xSpacing, 0);
//     }
//   }

//   applyForce(force) {
//     this.acc.add(force);
//   }

//   update() {
//     this.vel.add(this.acc);
//     this.vel.limit(this.maxSpeed);
//     this.pos.add(this.vel);
//     this.acc.mult(0);

//     if (this.type === "text" && this.reformDelay > 0) {
//       this.reformDelay--;
//     } else if (this.type === "text") {
//       let towardsTarget = p5.Vector.sub(this.target, this.pos);
//       towardsTarget.setMag(0.05);
//       this.applyForce(towardsTarget);
//     }

//     this.rot.add(this.rotSpeed);
//   }

//   follow(vectors) {
//     let x = floor((this.pos.x + width / 2) / scl);
//     let y = floor((this.pos.y + height / 2) / scl);
//     let index = x + y * cols;
//     if (index >= 0 && index < vectors.length) {
//       this.applyForce(vectors[index]);
//     }
//   }

//   edges() {
//     if (this.pos.x > width / 2) this.pos.x = -width / 2;
//     if (this.pos.x < -width / 2) this.pos.x = width / 2;
//     if (this.pos.y > height / 2) this.pos.y = -height / 2;
//     if (this.pos.y < -height / 2) this.pos.y = height / 2;
//   }

//   display() {
//     push();
//     translate(this.pos.x, this.pos.y, this.pos.z);
//     rotateX(this.rot.x);
//     rotateY(this.rot.y);
//     rotateZ(this.rot.z);
//     scale(this.scale);

//     if (this.type === "flower" && this.model) {
//       normalMaterial();
//       model(this.model);
//     } else if (this.type === "text" && this.char) {
  
//       for (let z = 0; z < 6; z++) {
//         translate(0, 0, -1);
//         text(this.char, 0, 0);
//       }
     
//       fill(255);               // core
    
//     }
//     pop();
//   }

//   isOffscreen() {
//     return this.pos.mag() > 800;
//   }
// }
 







// ------------------------------ showing full sentence instead of single words -------------------
// let mic, amplitude;
// let flower;
// let particles = [];
// let threshold = 0.05;

// let myRec = new p5.SpeechRec();
// let myVoice = new p5.Speech();

// let inc = 0.1;
// let scl = 20;
// let cols, rows;
// let zoff = 0;
// let flowField = [];

// let myFont;

// function preload() {
//   myFont = loadFont('./Orange-Squash-Demo-BF6483cfe8b2bfc.otf');
//   flower = loadModel('./strangeFlower.obj', true);
// }

// function setup() {
//   createCanvas(windowWidth, windowHeight, WEBGL);
//   textFont(myFont);
//   textSize(64);
//   textAlign(CENTER, CENTER);

//   cols = floor(width / scl);
//   rows = floor(height / scl);
//   flowField = new Array(cols * rows);

//   myRec.continuous = true;
//   myRec.interimResults = false;
//   myRec.onResult = showResult;
//   myRec.start();
//   myVoice.speak("Say something");

//   angleMode(DEGREES);

//   mic = new p5.AudioIn();
//   amplitude = new p5.Amplitude();
//   userStartAudio();
//   mic.start();
//   amplitude.setInput(mic);
// }

// function draw() {
//   background(0);
//   directionalLight(255, 255, 255, 0, 0, -1);
//   ambientLight(100);

//   // Update flow field
//   let yoff = 0;
//   for (let y = 0; y < rows; y++) {
//     let xoff = 0;
//     for (let x = 0; x < cols; x++) {
//       let index = x + y * cols;
//       let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
//       let v = p5.Vector.fromAngle(angle);
//       v.setMag(1);
//       flowField[index] = v;
//       xoff += inc;
//     }
//     yoff += inc;
//   }
//   zoff += 0.0003;

//   // Detect loud audio and generate flower
//   let level = amplitude.getLevel();
//   let boostedLevel = level * 5;

//   if (boostedLevel > threshold && random(1) > 0.8) {
//     particles.push(new Particle({
//       type: "flower",
//       model: flower
//     }));
//   }

//   // Update and display all particles
//   for (let i = particles.length - 1; i >= 0; i--) {
//     let p = particles[i];
//     p.follow(flowField);
//     p.update();
//     p.display();

//     if (p.isOffscreen()) {
//       particles.splice(i, 1);
//     }
//   }
// }

// function showResult() {
//   if (myRec.resultValue) {
//     let spokenText = myRec.resultString;
//     myVoice.speak(spokenText);
//     console.log("Heard:", spokenText);

//     // Remove only text particles (leave flowers)
//     particles = particles.filter(p => p.type !== "text");

//     // Create one particle with the full sentence
//     particles.push(new Particle({
//       type: "text",
//       char: spokenText,
//       index: 0,
//       total: 1
//     }));

//     // Optional: add one flower per sentence
//     particles.push(new Particle({
//       type: "flower",
//       model: flower
//     }));
//   }
// }

// // Unified Particle class
// class Particle {
//   constructor(options) {
//     this.type = options.type; // "text" or "flower"
//     this.char = options.char || null;
//     this.model = options.model || null;

//     this.pos = options.pos || createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
//     this.vel = options.vel || p5.Vector.random3D().mult(random(1, 3));
//     this.acc = createVector();
//     this.maxSpeed = 3;
//     this.scale = random(0.4, 1.2);
//     this.rot = createVector(random(360), random(360), random(360));
//     this.rotSpeed = createVector(random(0.5, 1.5), random(0.5, 1.5), random(0.5, 1.5));

//     this.reformDelay = 120;
//     if (this.type === "text") {
//       let xSpacing = 20;
//       let index = options.index || 0;
//       let total = options.total || 1;
//       let sentenceWidth = total * xSpacing;
//       this.target = createVector((0 - sentenceWidth) / 2 + index * xSpacing, 0);
//     }
//   }

//   applyForce(force) {
//     this.acc.add(force);
//   }

//   update() {
//     this.vel.add(this.acc);
//     this.vel.limit(this.maxSpeed);
//     this.pos.add(this.vel);
//     this.acc.mult(0);

//     if (this.type === "text" && this.reformDelay > 0) {
//       this.reformDelay--;
//     } else if (this.type === "text") {
//       let towardsTarget = p5.Vector.sub(this.target, this.pos);
//       towardsTarget.setMag(0.05);
//       this.applyForce(towardsTarget);
//     }

//     this.rot.add(this.rotSpeed);
//   }

//   follow(vectors) {
//     let x = floor((this.pos.x + width / 2) / scl);
//     let y = floor((this.pos.y + height / 2) / scl);
//     let index = x + y * cols;
//     if (index >= 0 && index < vectors.length) {
//       this.applyForce(vectors[index]);
//     }
//   }

//   display() {
//     push();
//     translate(this.pos.x, this.pos.y, this.pos.z);
//     rotateX(this.rot.x);
//     rotateY(this.rot.y);
//     rotateZ(this.rot.z);
//     scale(this.scale);

//     if (this.type === "flower" && this.model) {
//       normalMaterial();
//       model(this.model);
//     } else if (this.type === "text" && this.char) {
//       fill(100); // shadow
//       for (let z = 0; z < 6; z++) {
//         translate(0, 0, -1);
//         text(this.char, 0, 0);
//       }
//       fill(0); // front face
//       text(this.char, 0, 0);
//     }
//     pop();
//   }

//   isOffscreen() {
//     return this.pos.mag() > 800;
//   }
// }



//------------------------- adding the video in ----------------------
let mic, amplitude;
let flower;
let particles = [];
let threshold = 0.1;
let showParticles = true;

let myRec = new p5.SpeechRec();
let myVoice = new p5.Speech();

let inc = 0.1;
let scl = 20;
let cols, rows;
let zoff = 0;
let flowField = [];

let myFont;

let dragonVideo;
let dragonPlaying = false;
let videoJustEnded = false;

function preload() {
  myFont = loadFont('./GOTHICBI.TTF');
  flower = loadModel('./strangeFlower.obj', true);
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
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

  angleMode(DEGREES);

  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();
  userStartAudio();
  mic.start();
  amplitude.setInput(mic);
 

  dragonVideo = createVideo(['./dragon.mp4'], onVideoEnded);
  dragonVideo.hide();
  dragonVideo.loop = false; // Ensure it doesn't loop
}

function draw() {
  background(0);
  directionalLight(255, 255, 255, 0, 0, -1);
  ambientLight(100);

  if (dragonPlaying) {
    push();
    texture(dragonVideo);
    noStroke();
    plane(width, height);
    pop();
    return
    } 
    
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

    let level = amplitude.getLevel();
    let boostedLevel = level * 5;

    if (frameCount % 30 === 0) {
      console.log("Audio level:", level.toFixed(6), "Boosted:", boostedLevel.toFixed(3));
      console.log("Heard:", myRec.resultString)
    }

    if (!dragonPlaying && !videoJustEnded && boostedLevel > 30) { //THISSSSSSSS///// 
      triggerDragonVideo();
    }

    let particleTriggerChance = videoJustEnded ? 0.3 : 0.8;
    if (boostedLevel > threshold && random(1) > particleTriggerChance) {
      particles.push(new Particle({ type: "flower", model: flower }));
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].follow(flowField);
      particles[i].update();
      particles[i].display();

      if (particles[i].isOffscreen()) {
        particles.splice(i, 1);
      }
    }
    
}

function showResult() {
  if (myRec.resultValue && !dragonPlaying) {
    let spokenText = myRec.resultString;
    particles = particles.filter(p => p.type !== "text");

    let words = spokenText.split(" ");
    for (let i = 0; i < words.length; i++) {
      particles.push(new Particle({
        type: "text",
        char: words[i],
        index: i,
        total: words.length
      }));
      particles.push(new Particle({
        type: "flower",
        model: flower
      }));
    }
  }
}

function triggerDragonVideo() {
  dragonPlaying = true;
  videoJustEnded = false;
  dragonVideo.show();
  dragonVideo.play();
  particles = [];
}

function onVideoEnded() {
  dragonPlaying = false;
  videoJustEnded = true;
  dragonVideo.stop();
  dragonVideo.hide();

  // Restart mic + amplitude after video ends
  mic = new p5.AudioIn(); 
  mic.start(() => {
    console.log("Mic restarted after video.");
    amplitude.setInput(mic);
  });

  setTimeout(() => {
    videoJustEnded = false;
  }, 2000);
}

class Particle {
  constructor(options) {
    this.type = options.type;
    this.char = options.char || null;
    this.model = options.model || null;

    this.pos = options.pos || createVector(random(-width / 2, width / 2), random(-height / 2, height / 2), random(-200, 200));
    this.vel = options.vel || p5.Vector.random3D().mult(random(1, 3));
    this.acc = createVector();
    this.maxSpeed = 3;
    this.scale = random(0.4, 1.2);
    this.rot = createVector(random(360), random(360), random(360));
    this.rotSpeed = createVector(random(0.5,1.5), random( 0.5, 1.5), random(0.5, 1.5));

   
      
  

    this.reformDelay = 120;
    if (this.type === "text") {
      let xSpacing = 20;
      let index = options.index || 0;
      let total = options.total || 1;
      let sentenceWidth = total * xSpacing;
      this.target = createVector((0 - sentenceWidth) / 2 + index * xSpacing, 0);
    }
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.type === "text" && this.reformDelay > 0) {
      this.reformDelay--;
    } else if (this.type === "text") {
      let towardsTarget = p5.Vector.sub(this.target, this.pos);
      towardsTarget.setMag(0.05);
      this.applyForce(towardsTarget);
    }

    this.rot.add(this.rotSpeed);
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

  display() {
    push();
    translate(this.pos.x, this.pos.y, this.pos.z);
    rotateX(this.rot.x);
    rotateY(this.rot.y);
    rotateZ(this.rot.z);
    scale(this.scale);

    if (this.type === "flower" && this.model) {
      normalMaterial();
      model(this.model);
    } else if (this.type === "text" && this.char) {
      for (let z = 0; z < 6; z++) {
        translate(0, 0, -1);
        text(this.char, 0, 0);
      }
      fill(255);
    }
    pop();
  }

  isOffscreen() {
    return this.pos.mag() > 800;
  }
}


