const createParticleSystem = (location) => {
  const origin = location.copy();
  const particles = [];

  const addParticle = velocity => {
    const rand = random(0, 1);
    if (rand <= .3) {
      particles.push(createSparkParticle(origin, velocity.copy()));
    } else {
      particles.push(createParticle(origin, velocity.copy())); 
    }
  };

  const applyForce = force => {
    particles.forEach(particle => {
      particle.applyForce(force);
    });
  };

  const run = () => {
    particles.forEach((particle, index) => {
      particle.move();
      particle.draw();
      if (particle.isDead()) {
        particles.splice(index, 1);
      }
    });
  };

  return { origin, addParticle, run, applyForce };
};

const createSparkParticle = (locationP, velocity) => {
  const particle = createParticle(locationP, velocity);
  let fade = 255;
  
  const draw = () => {
    colorMode(HSB);
    stroke(16, 62, 100, fade);
    const arrow = velocity.copy().normalize().mult(random(2, 4));
    const direction = p5.Vector.add(particle.location, arrow);
    line(particle.location.x, particle.location.y, direction.x, direction.y);
  };
  
   const move = () => {
    particle.applyForce(createVector(random(-.2 , .2), random(-0.1 , -0.4)));
    particle.velocity.add(particle.acc);
    particle.location.add(particle.velocity.copy().normalize().mult(random(2, 4)));
    particle.acc.mult(0);
    fade -= 5;
  };
  
  return { ...particle, draw, move }
}

const createParticle = (locationP, velocity) => {
  const acc = createVector(0, 0);
  const location = locationP.copy();
  let fade = 255;
  const fadeMinus = randomGaussian(15, 2);
  let ligther = 100;
  let situate = 62;

  const draw = () => {
    colorMode(HSB)
    stroke(16, constrain(situate, 62, 92), constrain(ligther, 60, 100), fade);
    const arrow = velocity.copy().mult(2);
    const direction = p5.Vector.add(location, arrow);
    line(location.x, location.y, direction.x, direction.y);
  };

  const move = () => {
    velocity.add(acc);
    location.add(velocity.copy().div(map(velocity.mag(), 18, 0, 5, 1)));
    acc.mult(0);
    fade -= fadeMinus;
    ligther -= 8;
    situate += 8;
  };

  const applyForce = force => { acc.add(force); };
  const isDead = () => {
    return (fade < 0 || location.x < 0 || location.x > width || location.y > height);
  };

  return { draw, move, applyForce, isDead, velocity, location, acc };
};

const createMover = () => {
  const location = createVector(250, 250); // CENTERED IN 500x500
  let angle = 0;
  let angleVelocity = 0;
  let angleAcc = 0;

  const particleSystems = Array.from({ length: 9 }, () => createParticleSystem(location));

  const getGotoVector = angle => {
    const radius = map(angleVelocity, 0, 0.3, 0, 150); // PORTAL RADIUS
    return createVector(
      location.x + radius * cos(angle),
      location.y + radius * sin(angle)
    );
  };

  const draw = () => {
    particleSystems.forEach(ps => ps.run());
  };

  const move = () => {
    angleAcc = 0.001;
    angleVelocity = constrain(angleVelocity + angleAcc, 0, 0.32);
    angle += angleVelocity;
    
    particleSystems.forEach(ps => {
      const goToVector = getGotoVector(angle - Math.random(0, TWO_PI));
      const prepencular = createVector(goToVector.y - location.y, (goToVector.x - location.x) * -1);
      prepencular.normalize().mult(angleVelocity * 70);
      ps.origin.set(goToVector);
      ps.addParticle(prepencular);
      ps.applyForce(createVector(0, 0.3));
    });
  };

  return { draw, move };
};

let mover;

function setup() {
  const canvas = createCanvas(500, 500);
  canvas.parent('p5-canvas-container'); // ATTACH TO DIV
  mover = createMover();
}

function draw() {
  clear(); // CLEAR BACKGROUND TO BE TRANSPARENT
  mover.move();
  mover.draw();
}