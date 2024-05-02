class Boid {
	constructor() {
		this.position = createVector(
			random(width), 
			random(height));
		this.velocity = p5.Vector.random2D();
		this.velocity.setMag(random(2.5, 5));
		this.acceleration = createVector();
		this.maxForce = 0.2;
		this.maxSpeed = 6;
		this.hue = random(150, 240);
		this.saturation = random(50, 100);
		this.brightness = random(30, 100);
	}

	edges() {
		if(this.position.x > width + 10) {
			this.position.x = 0;
		} else if (this.position.x < 0 - 10) {
			this.position.x = width;
		}
		if (this.position.y > height + 10) {
			this.position.y = 0;
		} else if (this.position.y < - 10) {
			this.position.y = height;
		}
	}
	
	show() {
		strokeWeight(8);
		stroke(this.hue, this.saturation, this.brightness);
		point(this.position.x, this.position.y);
	}

	update() {
		this.position.add(this.velocity);
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
	}

	steer(boids) {
		// console.log(boids);
		let align = createVector();
		let cohesion = createVector();
		let seperation = createVector();		
		let extraForce = createVector();
		let total = 0;
		let sTotal = 0;

		for (let b of boids) {
			let other = b.userData;
			if (!(other == this || other == "swirl")) {
				align.add(other.velocity);
				cohesion.add(other.position);
				let diff = p5.Vector.sub(
						this.position,
						other.position
					);
				let d = diff.x*diff.x + diff.y*diff.y;
				diff.div(d);
				seperation.add(diff);
				total++;
			} else if (other == "swirl") {
				let pos = createVector(b.x,b.y);
				extraForce = p5.Vector.sub(this.position, pos);
				extraForce.mult(-1); // repel the boids from the mouse pointer
				extraForce.setMag(this.maxSpeed);
				extraForce.sub(this.velocity);
				extraForce.limit(this.maxForce);
				sTotal ++;
			}
		}
		
		let steer = [align, cohesion, seperation];
		if (sTotal > 0) {
			steer.push(extraForce);
		}
		if (total > 0) {
			for (let vec = 0; vec < steer.length; vec++) {
				if (vec == 3) {
					steer[vec].div(sTotal);
					steer[vec].sub(this.position);
				;} else {steer[vec].div(total);}				
				if (vec == 1) {
					steer[vec].sub(this.position);		
				}
				steer[vec].setMag(this.maxSpeed);
				steer[vec].sub(this.velocity);
				steer[vec].limit(this.maxForce);
			}
		}
		return steer;
	}
	
	flock(boids, a, c, s) {
		let steer = this.steer(boids);
		let alignment = steer[0].mult(a);
		let cohesion = steer[1].mult(c);
		let seperation = steer[2].mult(s);
	  
		// add a new force to avoid the mouse
		let mousePos = createVector(mouseX, mouseY);
		let diff = p5.Vector.sub(this.position, mousePos);
		let d = diff.mag();
		if (d < 100) { // increase the avoidance radius to 100
		  let force = diff.normalize();
		  force.mult(-2); // increase the strength of the avoidance force
		  this.acceleration.add(force);
	  
		  // increase the separation force when close to the mouse
		  seperation.mult(3);
		}
	  
		this.acceleration.add(alignment);
		this.acceleration.add(cohesion);
		this.acceleration.add(seperation);
	  
		this.acceleration.limit(this.maxForce);
	  }
}

let boids = [];
let swirlBoid = {
  x: 0,
  y: 0,
  userData: "swirl",
  size: 1000
};

function setup() {
  createCanvas(800, 600);
  for (let i = 0; i < 100; i++) {
    boids.push(new Boid());
  }
}

function draw() {
	background(50);
	for (let boid of boids) {
	  boid.update();
	  boid.edges();
	  boid.show();
	  boid.flock(boids, 1, 1, 1);
	}
	
	// draw the swirlBoid as a large circle
	fill(255, 0, 0); // red color
	noStroke();
	ellipse(swirlBoid.x, swirlBoid.y, swirlBoid.size, swirlBoid.size);
}

function mouseMoved() {
  swirlBoid.x = mouseX;
  swirlBoid.y = mouseY;
}