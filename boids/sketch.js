//Author: Nathan Vos (v0s.nl), 2018. 
//this is an interactive sketch which builds on the basic particle flocking
// sketch by Daniel Shiffman. I followed the Coding Train tutorial on youtube 
// (https://www.youtube.com/watch?v=mhjuuHl6qHM) and build my own design from 
// there. 
// I also included a quadtree optimization, with the help of another Coding Train 
// tutorial. (https://www.youtube.com/watch?v=OJxEcs0w_kE)

// I defined a few different 'scenes' for the flock, with their own properties and extra forces. 
// the 'leaves' and 'grain' use a perlin noise for wind and the 'stars' will cohere
// towards a few extra points. 

let flock = [];
let boundary;
let perceptionRadius = 100;
// trail sets the opacity of the background in each draw loop. 
// values between 0-1. closer to 0 gives a longer trail to each particle. 
let trail = 0.45;
//interface
let sliders;
let flockSize = 200;
let cap = flockSize/50;
// extra effects
let swirling, wind = false;
let swirls = [];
let sTotal;
let windForce, windDetail;
let xOff = 0;
let yOff = 0;



function setup() {
  colorMode(HSB,360,100,100,1);
  // createCanvas(600, 360);
	createCanvas(
		window.innerWidth,
		window.innerHeight);
	cols = floor(width/5);
	rows = floor(height/5);
 
	boundary = new Rectangle (
		width/2, height/2, width, height);
	for (var i = 0; i < flockSize; i++) {
		flock.push(new Boid());
	}


	sliders = selectAll('.slider');
	hideInterface();

}

function keyPressed() {
	if (key === '{') {
		for (let i = 0; i < 50; i++) {
			let newBoid = new Boid(mouseX, mouseY);
			flock.push(newBoid);
		  }
	}
	if (key === '}') {
		for (let i = 0; i < 50; i++) {
		  if (flock.length > 0) {
			flock.pop();
		  }
		}
	  }

  }

function draw() {
	let qtree = new QuadTree(boundary, cap);
	for (let boid of flock) {
		let p = new Point(boid.position.x, boid.position.y, boid)
		qtree.insert(p);
	}
	if (swirling) {
		for (let s of swirls) {
			qtree.insert(s);
		}
	}

	background(249,30,10,trail);

	let a = sliders[0].value();
	let c = sliders[1].value();
	let s = sliders[2].value();

	for (let boid of flock) {
		let range = new Circle(boid.position.x, boid.position.y, perceptionRadius);
		let localBoids = qtree.query(range);

		boid.flock(localBoids,a,c,s);	
		if (wind) {
			let w = (noise(boid.position.x/windDetail+xOff, boid.position.y/windDetail+yOff)*TWO_PI*4);
			let vec = p5.Vector.fromAngle(w,windForce);
			boid.acceleration.add(vec);
		}	
		boid.edges();
		boid.update();
		boid.show();
	}
	xOff += 0.005;
	yOff += 0.005;

	// for (let s of swirls) {
	// 	stroke(0,0,100);
	// 	strokeWeight(10);
	// 	point(s.x,s.y);
	// }

	// console.log(frameRate())

	// noLoop();
}

//reactive menu
function showInterface() {
	let i = select('#interface');
	i.style('top', '0');
}

function hideInterface() {
	let i = select('#interface');
	i.style('top', '-450px' );
}