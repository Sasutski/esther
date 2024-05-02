
function seaDefault() {	
	perceptionRadius = 100;
	trail = 0.45;
	sliders[0].value(1);
	sliders[1].value(1);
	sliders[2].value(1);
	resizeFlock();

	for (let boid of flock) {
		boid.maxForce = 0.2;
		boid.maxSpeed = 6;
		boid.hue = random(150, 240);
		boid.saturation = random(50, 100);
		boid.brightness = random(30, 100);
	}

    swirling = false;
    wind = false;
}

function disco() {
	perceptionRadius = 50;
	trail = 0.8;
	sliders[0].value(0);
	sliders[1].value(1);
	sliders[2].value(5);
	resizeFlock();

	for (let boid of flock) {
		boid.hue = random(360);
		boid.saturation = random(70,100);
		boid.brightness = random(40,80);
		boid.maxForce = 0.4;
		boid.maxSpeed = 6;
	}

    swirling = false;
    wind = false;
}

function birds() {
	// todo add view for boids
	perceptionRadius = 100;
	trail = 0.7;

	sliders[0].value(1);
	sliders[1].value(1);
	sliders[2].value(1);
	resizeFlock();
	for (let boid of flock) {
		boid.hue = random(360);
		boid.saturation = random(15);
		boid.brightness = random(40,75);
		boid.maxForce = 0.2;
		boid.maxSpeed = 6;
	}

    swirling = false;
    wind = false;
}

function leaves() {
	perceptionRadius = 50;
	trail = 0.7;

	sliders[0].value(0.2);
	sliders[1].value(0);
	sliders[2].value(0.6);
	resizeFlock();
	for (let boid of flock) {
		boid.hue = random(60);
		boid.saturation = random(50,100);
		boid.brightness = random(10,70);
		boid.maxForce = 0.1;
		boid.maxSpeed = 2;
	}

    swirling = false;
    wind = true;
    windForce = 0.1;
    windDetail = 400;
}

function snow() {
	perceptionRadius = 30; 
	trail = 0.6;

	sliders[0].value(0.5);
	sliders[1].value(0);
	sliders[2].value(0.8);
	resizeFlock();
	
	for (let boid of flock) {
		//nugde to the bottom.
		boid.velocity = createVector(random(-1,1), random(0,1));
		boid.hue = random(180,210);
		boid.saturation = random(5,25);
		boid.brightness = random(60,100);
		boid.maxForce = 0.1;
		boid.maxSpeed = 3;
	}

    swirling = false;
    wind = false;
}

function grain() {
	perceptionRadius = 20; 
	trail = 0.6;
	let s = flock.length * 4;

	sliders[0].value(0.5);
	sliders[1].value(0);
	sliders[2].value(2);
	resizeFlock(s);
	
	for (let boid of flock) {
		boid.velocity.mult(0.1);
		boid.hue = random(30,75);
		boid.saturation = random(50,100);
		boid.brightness = random(50,90);
		boid.maxForce = 0.7;
		boid.maxSpeed = 1;
	}

    swirling = false;
    wind = true;
    windForce = 0.2;
    windDetail = 1000;
}

function starryNight() {
	trail = 0.15;
	perceptionRadius = 100;
	sliders[0].value(1);
	sliders[1].value(0.8);
	sliders[2].value(1.1);
	resizeFlock();

	for (let boid of flock) {
		//nugde to the right.
		boid.velocity = createVector(random(0.3), random(-1,1));
		//fast moving
		boid.maxForce = 0.3;
		boid.maxSpeed = 6;
		// van Gogh color scheme
		boid.hue = (random(1) < 0.75) ? random(49,61) : random(180,240);
		boid.saturation = random(70, 100);
		boid.brightness = random(70, 100);
	}

	swirling = true;
	swirls = [];
	let n = random(2,8);
	for (let i = 0; i < n; i++) {
		let s = new Point(random(width), random(height), "swirl");
		swirls.push(s);
	}
    // console.log(swirls)
    
    wind = false;
}

function search() {	
	perceptionRadius = 50;
	trail = 0.7;
	sliders[0].value(1);
	sliders[1].value(5);
	sliders[2].value(5);
	resizeFlock();

	for (let boid of flock) {
		boid.maxForce = 0.3;
		boid.maxSpeed = 6;
		boid.hue = random(0,30);
		boid.saturation = random(70, 100);
		boid.brightness = random(30, 80);
	}

    swirling = false;
    wind = false;
}



function resizeFlock(s) {
	let size = s || select('#size').value();
	if (!size && flock.length > 500) {
		flock = flock.slice(floor(flock.length/2));
	} else if (size && flock.length > size) {
		flock = flock.slice(flock.length-size);
	} else if (size && flock.length < size) {
		let f = flock.length;
		for (var i = 0; i < (size - f); i++) {
			flock.push(new Boid());
		}
	}
	cap = flock.length/50;
	select('#size').value('');
}