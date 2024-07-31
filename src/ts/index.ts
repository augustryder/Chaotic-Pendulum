import '/src/ts/script.ts'
import '/src/styles.css';
import { Application, Container, PI_2, Point } from 'pixi.js';
import { Pendulum } from './Pendulum';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000019,
	width: window.innerWidth * 0.6,
	height: window.innerHeight
});

const g = 9.81;
var dt = 0.05;

var origin = { x: (window.innerWidth * 0.6) / 2, y: window.innerHeight / 2 };

const pendulum1 = new Pendulum(150, 100, 0);
const pendulum2 = new Pendulum(150, 100, Math.PI / 2);

// Create a container for the pendulum
const pendulumContainer = new Container();
pendulumContainer.position = new Point(origin.x, origin.y);
app.stage.addChild(pendulumContainer);

window.addEventListener('resize', () => {
	app.renderer.resize(window.innerWidth * 0.6, window.innerHeight);
	origin = { x: (window.innerWidth * 0.6) / 2, y: window.innerHeight / 2 };
	pendulumContainer.position = new Point(origin.x, origin.y);
});

const initPos1 = pendulum1.position(0, 0);
const initPos2 = pendulum2.position(initPos1.x, initPos1.y);
var pos1 = initPos1;
var pos2 = initPos2;

pendulumContainer.addChild(pendulum2.trailGraphics);
pendulumContainer.addChild(pendulum2.graphics);
pendulumContainer.addChild(pendulum1.graphics);

// Draw pendulum graphics
pendulum1.draw();
pendulum2.graphics.position = pos1;
pendulum2.draw();

let paused = true;
let trail = true;
app.ticker.add(() => {
	// Leapfrog integration
	if (!paused && !draggingPendulum && !changingAngle) {
		pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
		pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;

		pendulum1.angle += pendulum1.angularVelocity * dt;
		pendulum2.angle += pendulum2.angularVelocity * dt;

		pendulum1.updateAngularAcceleration(pendulum1, pendulum2, g);
		pendulum2.updateAngularAcceleration(pendulum1, pendulum2, g);

		pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
		pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;
		
		if (trail) {
			pendulum2.updateTrail(pos2);
		}
		pendulum2.drawTrail();
	}

	// // Update transformations
	pos1 = pendulum1.position(0, 0);
	pos2 = pendulum2.position(pos1.x, pos1.y);
	pendulum1.graphics.clear();
	pendulum1.draw();
	pendulum2.graphics.clear();
	pendulum2.graphics.position = pos1;
	pendulum2.draw();

	// pendulum1.graphics.rotation = pendulum1.angle;
	// pendulum2.graphics.position = pos1;
	// pendulum2.graphics.rotation = pendulum2.angle;
	// console.log(pendulum1.angle);

});

// pause/start button
const pauseStartButton = document.getElementById('pause-start-btn') as HTMLButtonElement;
pauseStartButton.addEventListener('click', () => {
	paused = !paused;
	pauseStartButton.textContent = paused ? 'Start' : 'Pause';
});

// dragging pendulums
var draggingPendulum: number;
app.view.addEventListener('mousedown', (event) => {
	const mouseX = event.clientX - origin.x - window.innerWidth * 0.4;
	const mouseY = event.clientY - origin.y;
	const distToBob1 = Math.sqrt((mouseX - pos1.x) ** 2 + (mouseY - pos1.y) ** 2);
	const distToBob2 = Math.sqrt((mouseX - pos2.x) ** 2 + (mouseY - pos2.y) ** 2);
	if (distToBob1 < 30) {
		draggingPendulum = 1;
	} else if (distToBob2 < 30) {
		draggingPendulum = 2;
	}
});

app.view.addEventListener('mousemove', (event) => {
	if (draggingPendulum) {
		const mouseX = event.clientX;
		const mouseY = event.clientY;
		if (draggingPendulum == 1) {
			const newAngle = Math.atan2(mouseX - origin.x - window.innerWidth * 0.4, mouseY - origin.y);
			pendulum1.configure(newAngle, 0, pendulum1.length, pendulum1.mass);
		}
		else if (draggingPendulum == 2) {
			const newAngle = Math.atan2(mouseX - origin.x - pos1.x - window.innerWidth * 0.4, mouseY - origin.y - pos1.y);
			pendulum2.configure(newAngle, 0, pendulum2.length, pendulum2.mass);
		}
		pendulum2.trail = []
	}
});

app.view.addEventListener('mouseup', () => {
	draggingPendulum = 0;
});

var changingAngle = 0;
// *** ANGLE 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('angle1-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('angle1-number') as HTMLInputElement;
	pendulum1.angle = +textbox.value / 360 * PI_2;
	pendulum2.trail = [];
});

document.getElementById('angle1-slider')?.addEventListener('input', () => {
	changingAngle = 1;
	const slider = document.getElementById('angle1-slider') as HTMLInputElement;
	pendulum1.angle = +slider.value / 360 * PI_2;
});

document.getElementById('angle1-slider')?.addEventListener('mouseup', () => {
	changingAngle = 0;
	pendulum1.configure(pendulum1.angle, 0, pendulum1.length, pendulum1.mass);
	pendulum2.configure(pendulum2.angle, 0, pendulum2.length, pendulum2.mass);
});

// *** ANGLE 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('angle2-number')?.addEventListener('input', () => {
	const slider = document.getElementById('angle2-number') as HTMLInputElement;
	pendulum2.angle = +slider.value / 360 * PI_2;
	pendulum2.trail = [];
});

document.getElementById('angle2-slider')?.addEventListener('input', () => {
	changingAngle = 1;
	const slider = document.getElementById('angle2-slider') as HTMLInputElement;
	pendulum2.angle = +slider.value / 360 * PI_2;
});

document.getElementById('angle2-slider')?.addEventListener('mouseup', () => {
	changingAngle = 0;
	pendulum1.configure(pendulum1.angle, 0, pendulum1.length, pendulum1.mass);
	pendulum2.configure(pendulum2.angle, 0, pendulum2.length, pendulum2.mass);
});

// *** ANGULAR VELOCITY 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('velocity1-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('velocity1-number') as HTMLInputElement;
	pendulum1.angularVelocity = +textbox.value / 1000;
	pendulum2.trail = [];
});

document.getElementById('velocity1-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('velocity1-slider') as HTMLInputElement;
	pendulum1.angularVelocity = +slider.value / 1000;
});

// *** ANGULAR VELOCITY 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('velocity2-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('velocity2-number') as HTMLInputElement;
	pendulum2.angularVelocity = +textbox.value / 1000;
	pendulum2.trail = [];
});

document.getElementById('velocity2-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('velocity2-slider') as HTMLInputElement;
	pendulum2.angularVelocity = +slider.value / 1000;
});

// *** LENGTH 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('length1-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('length1-number') as HTMLInputElement;
	pendulum1.length = +textbox.value < 10 ? 10 : +textbox.value;
	pendulum2.trail = [];
});

document.getElementById('length1-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('length1-slider') as HTMLInputElement;
	pendulum1.length = +slider.value;
	pendulum1.graphics.clear();
	pendulum1.draw();
});

// *** LENGTH 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('length2-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('length2-number') as HTMLInputElement;
	pendulum2.length = +textbox.value < 10 ? 10 : +textbox.value;
	pendulum2.trail = [];
});

document.getElementById('length2-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('length2-slider') as HTMLInputElement;
	pendulum2.length = +slider.value;
	pendulum2.graphics.clear();
	pendulum2.draw();
});

// *** MASS 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('mass1-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('mass1-number') as HTMLInputElement;
	pendulum1.mass = +textbox.value < 1 ? 1 : +textbox.value;
	pendulum1.graphics.clear();
	pendulum1.draw();
});

document.getElementById('mass1-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('mass1-slider') as HTMLInputElement;
	pendulum1.mass = +slider.value;
	pendulum1.graphics.clear();
	pendulum1.draw();
});

// *** MASS 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
document.getElementById('mass2-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('mass2-number') as HTMLInputElement;
	pendulum2.mass = +textbox.value < 1 ? 1 : +textbox.value;
	pendulum2.graphics.clear();
	pendulum2.draw();
});

document.getElementById('mass2-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('mass2-slider') as HTMLInputElement;
	pendulum2.mass = +slider.value;
	pendulum2.graphics.clear();
	pendulum2.draw();
});

// *** PATH SETTINGS FUNCTIONALITY *** //
document.getElementById('show-path')?.addEventListener('input', () => {
	const checkbox = document.getElementById('show-path') as HTMLInputElement;
	if (checkbox.checked) {
		trail = true;
	} else {
		trail = false;
		pendulum2.trail = [];
		pendulum2.drawTrail();
	}
});

document.getElementById('path-length')?.addEventListener('input', () => {
	const slider = document.getElementById('path-length') as HTMLInputElement;
	pendulum2.maxTrailLength = +slider.value;
});

// *** TIME STEP FUNCTIONALITY *** //
document.getElementById('time-step-number')?.addEventListener('input', () => {
	const textbox = document.getElementById('time-step-number') as HTMLInputElement;
	dt = +textbox.value / 1000;
});

document.getElementById('time-step-slider')?.addEventListener('input', () => {
	const slider = document.getElementById('time-step-slider') as HTMLInputElement;
	dt = +slider.value / 1000;
});
