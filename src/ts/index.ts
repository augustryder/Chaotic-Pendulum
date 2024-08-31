import '/src/ts/script.ts';
import '/src/styles.css';
import { Application, Container, PI_2, Point } from 'pixi.js';
import { Pendulum } from './Pendulum';
import { graphMode, updatePlot } from './graphs';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000019,
	width: window.innerWidth * 0.6,
	height: window.innerHeight
});

const g = 9.81;
var dt = 0.005;
var timeRate = 1;

const pixiContent = document.getElementById('pixi-content') as HTMLElement;
var origin = { x: pixiContent.clientWidth / 2, y: pixiContent.clientHeight / 2 };

const pendulum1 = new Pendulum(150, 100, Math.PI / 2);
const pendulum2 = new Pendulum(150, 100, Math.PI / 2);
synchronizeSettings();

// Create a container for the pendulum
const pendulumContainer = new Container();
pendulumContainer.position = new Point(origin.x, origin.y);
app.stage.addChild(pendulumContainer);

window.addEventListener('resize', () => {
	app.renderer.resize(window.innerWidth * 0.6, window.innerHeight);
	origin = { x: pixiContent.clientWidth / 2, y: pixiContent.clientHeight / 2 };
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


function calculateStep(dt: number) {
	// Leapfrog integration
	pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
	pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;

	pendulum1.angle += pendulum1.angularVelocity * dt;
	pendulum2.angle += pendulum2.angularVelocity * dt;

	pendulum1.updateAngularAcceleration(pendulum1, pendulum2, g);
	pendulum2.updateAngularAcceleration(pendulum1, pendulum2, g);

	pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
	pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;
}

function updateSimulation() {
	const steps = timeRate * 10;
	for (let i = 0; i < steps; i++) {
        // Perform simulation step
        calculateStep(dt);
    }
}

function updateRender() {
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
}

let paused = false;
let trail = true;
const startTime = Date.now();
let lastTime = 0;
app.ticker.add(() => {
	if (!paused && !draggingPendulum) {
		
		updateSimulation();
		if (trail) { 
			pendulum2.updateTrail(pos2); 
			pendulum2.drawTrail();
		}
		const currentTime = (Date.now() - startTime) / 1000;
		if (document.getElementById('graph-content')?.classList.contains('active')) {
			console.log("Graphing!");
			if (graphMode == "lines" && currentTime - lastTime > 0.02) {
				updatePlot(pendulum1, pendulum2, currentTime);
				lastTime = currentTime;
			}
			else if (graphMode == "markers" && currentTime - lastTime > 1) {
				updatePlot(pendulum1, pendulum2, currentTime);
				lastTime = currentTime;
			}
		}
	}
	updateRender();
});
















/////// ****** INTERACTION FUNCTIONALITY ****** ///////

// pause/start button
const pauseStartButton = document.getElementById('pause-start-btn') as HTMLButtonElement;
pauseStartButton.addEventListener('click', () => {
	paused = !paused;
	pauseStartButton.textContent = paused ? 'Start' : 'Pause';
});

// RESET BUTTON
function synchronizeSettings() {
	// Time Rate and Step
	(document.getElementById('time-rate-number') as HTMLInputElement).value = String(timeRate);
	(document.getElementById('time-rate-slider') as HTMLInputElement).value = String(timeRate);
	(document.getElementById('time-step-number') as HTMLInputElement).value = String(dt);
	(document.getElementById('time-step-slider') as HTMLInputElement).value = String(dt);
	// Pendulum 1
	(document.getElementById('angle1-number') as HTMLInputElement).value =  String(360 * (pendulum1.angle / PI_2));
	(document.getElementById('angle1-slider') as HTMLInputElement).value = String(360 * (pendulum1.angle / PI_2));
	(document.getElementById('velocity1-number') as HTMLInputElement).value = String(pendulum1.angularVelocity);
	(document.getElementById('velocity1-slider') as HTMLInputElement).value = String(pendulum1.angularVelocity);
	(document.getElementById('length1-number') as HTMLInputElement).value =  String(pendulum1.length);
	(document.getElementById('length1-slider') as HTMLInputElement).value = String(pendulum1.length);
	(document.getElementById('mass1-number') as HTMLInputElement).value =  String(pendulum1.mass);
	(document.getElementById('mass1-slider') as HTMLInputElement).value = String(pendulum1.mass);
	// Pendulum 2
	(document.getElementById('angle2-number') as HTMLInputElement).value =  String(360 * (pendulum2.angle / PI_2));
	(document.getElementById('angle2-slider') as HTMLInputElement).value = String(360 * (pendulum2.angle / PI_2));
	(document.getElementById('velocity2-number') as HTMLInputElement).value = String(pendulum2.angularVelocity);
	(document.getElementById('velocity2-slider') as HTMLInputElement).value = String(pendulum2.angularVelocity);
	(document.getElementById('length2-number') as HTMLInputElement).value =  String(pendulum2.length);
	(document.getElementById('length2-slider') as HTMLInputElement).value = String(pendulum2.length);
	(document.getElementById('mass2-number') as HTMLInputElement).value =  String(pendulum2.mass);
	(document.getElementById('mass2-slider') as HTMLInputElement).value = String(pendulum2.mass);
}

var preset = '90-90';
function reset() {
	switch (preset) {
        case '90-90':
			pendulum1.configure(Math.PI/2, 0, 150, 100);
			pendulum2.configure(Math.PI/2, 0, 150, 100);
            break;
        case '45-45':
			pendulum1.configure(Math.PI/4, 0, 150, 100);
			pendulum2.configure(Math.PI/4, 0, 150, 100);
            break;
        default:
			pendulum1.configure(Math.PI, 0, 150, 100);
			pendulum2.configure(Math.PI, 0, 150, 100);
            break;
    }
	synchronizeSettings();
}

document.getElementById('reset-btn')?.addEventListener('click', () => {
	paused = true;
	pauseStartButton.textContent = paused ? 'Start' : 'Pause';
	reset();
});

document.getElementById('dropdown-presets')?.addEventListener('change', (event) => {
	paused = true;
	pauseStartButton.textContent = paused ? 'Start' : 'Pause';
	preset = (event.target as HTMLSelectElement).value;
	reset();
});


//  *** PENDULUM DRAGGING FUNCTIONALITY *** //
var draggingPendulum: number;
app.view.addEventListener('mousedown', (event) => {
	const mouseX = event.clientX - origin.x - (window.innerWidth - pixiContent.clientWidth);
	const mouseY = event.clientY - origin.y;
	const distToBob1 = Math.sqrt((mouseX - pos1.x) ** 2 + (mouseY - pos1.y) ** 2);
	const distToBob2 = Math.sqrt((mouseX - pos2.x) ** 2 + (mouseY - pos2.y) ** 2);
	if (distToBob1 < pendulum1.radius() + 10) {
		draggingPendulum = 1;
	} else if (distToBob2 < pendulum1.radius() + 10) {
		draggingPendulum = 2;
	}
});

app.view.addEventListener('mousemove', (event) => {
	if (draggingPendulum) {
		const mouseX = event.clientX - origin.x - (window.innerWidth - pixiContent.clientWidth);
		const mouseY = event.clientY - origin.y;
		if (draggingPendulum == 1) {
			const newAngle = Math.atan2(mouseX, mouseY);
			pendulum1.configure(newAngle, 0, pendulum1.length, pendulum1.mass);
			pendulum2.configure(pendulum2.angle, 0, pendulum2.length, pendulum2.mass);
		}
		else if (draggingPendulum == 2) {
			const newAngle = Math.atan2(mouseX - pos1.x, mouseY - pos1.y);
			pendulum2.configure(newAngle, 0, pendulum2.length, pendulum2.mass);
			pendulum1.configure(pendulum1.angle, 0, pendulum1.length, pendulum1.mass);
		}
		pendulum2.trail = []
	}
});

app.view.addEventListener('mouseup', () => {
	draggingPendulum = 0;
});

function synchronizeInputAndSlider(inputId: string, sliderId: string, onChange: (value: number) => void) {
    const inputElement = document.getElementById(inputId) as HTMLInputElement;
    const sliderElement = document.getElementById(sliderId) as HTMLInputElement;

    inputElement.addEventListener('keypress', (event) => {
		if (event.key == 'Enter') {
			const value = +inputElement.value;
			sliderElement.value = inputElement.value;
			onChange(value);
		}
    });

	inputElement.addEventListener('blur', () => {
		const value = +inputElement.value;
		sliderElement.value = inputElement.value;
		onChange(value);

    });

	sliderElement.addEventListener('input', () => {
		const value = +sliderElement.value;
		inputElement.value = sliderElement.value;
		onChange(value);
    });
}

// *** ANGLE 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('angle1-number', 'angle1-slider', (value) => {
	pendulum1.angle = value / 360 * PI_2;
	pendulum2.trail = [];
});

// *** ANGLE 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('angle2-number', 'angle2-slider', (value) => {
	pendulum2.angle = value / 360 * PI_2;
	pendulum2.trail = [];
});

// *** ANGULAR VELOCITY 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('velocity1-number', 'velocity1-slider', (value) => {
	pendulum1.angularVelocity = value / 1000;
});

// *** ANGULAR VELOCITY 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('velocity2-number', 'velocity2-slider', (value) => {
	pendulum2.angularVelocity = value / 1000;
});

// *** LENGTH 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('length1-number', 'length1-slider', (value) => {
	pendulum1.length = value;
	pendulum1.graphics.clear();
	pendulum1.draw();
});

// *** LENGTH 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('length2-number', 'length2-slider', (value) => {
	pendulum2.length = value;
	pendulum2.graphics.clear();
	pendulum2.draw();
});

// *** MASS 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('mass1-number', 'mass1-slider', (value) => {
	pendulum1.mass = value < 1 ? 1 : value;
	pendulum1.graphics.clear();
	pendulum1.draw();
});

// *** MASS 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
synchronizeInputAndSlider('mass2-number', 'mass2-slider', (value) => {
	pendulum2.mass = value < 1 ? 1 : value;
	pendulum2.graphics.clear();
	pendulum2.draw();
});

// *** TIME RATE FUNCTIONALITY *** //
synchronizeInputAndSlider('time-rate-number', 'time-rate-slider', (value) => {
	timeRate = value;
});

// *** TIME STEP FUNCTIONALITY *** //
synchronizeInputAndSlider('time-step-number', 'time-step-slider', (value) => {
	dt = value;
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


