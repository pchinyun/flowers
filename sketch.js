let flower; 

function preload() {
  flower = loadModel('./strangeFlower.obj', true); 
  petal = loadModel('./petal.obj', true); 
}
particles = []


function setup() {
  createCanvas(400, 400);
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES); 
}

function draw() {
  background(220);
  background(0,0,30);

  rotateX(sin (frameCount / 12)* 360)
  rotateY(sin(frameCount / 4) * 360)

  translate(0,0, sin(frameCount) * 100)

  directionalLight([255], createVector(0,0,-10))

  if(random(1) > 0.97) {
    let x = random(-100,100)
    let y = random(-100,100)
    let z = random(-100,100)

    let pos = createVector(x,y,z)

    for (let i=0; i<10; i++) { 
      let r = map(sin(frameCount), -1,1,0,255) + random (-50,50)
      let g = map(sin(frameCount/2), -1, 1, 255,0) + random (-50,50)
      let b = map(sin (frameCount /4), -1,1,0,255) + random (-50,50)

      let c = color(r,g,b)

      let p = new Particle(pos, c)
      particles.push(p)
    }
  }
  
  for (let i = particles.length - 1; i >= 0; i--) { 
      if (dist(particles[i].pos.x, particles[i].pos.y, particles[i].pos.z, 0,0,0) < 500) {
      particles[i].update()
      particles[i].show()
    }
   else { 
    particles.splice(i,1);
    }
  }
}

class Particle { 
  constructor(pos, c) { 
    this.pos = createVector(pos.x,pos.y,pos.z);
    this.vel = p5.Vector.random3D().normalize().mult(random(4,6))

    this.c = c
    this.w = random(4,10)
  }
  update() {
    this.pos.add(this.vel)
  }
  show() {
    push()

    noStroke()
    fill(this.c)

    translate(this.pos.x, this.pos.y, this.pos.z)

    rotateZ(PI);
    normalMaterial(); 
    model(flower); 
   


    pop()
  }
}







