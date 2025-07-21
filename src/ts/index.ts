import './script.ts';
import '../styles.css';
import { PI_2 } from 'pixi.js';
import { Pendulum } from './Pendulum';
import { graphMode, updatePlot } from './graphs';
import { setupPixiApp } from './pixi-setup';

// @ts-ignore: No types available for WASM module
import SimulationModule from '/static/wasm/simulation.js';
import { Simulation } from './Simulation';

const pendulum1Config = {
	length: 150,
	mass: 100,
	angle: Math.PI / 2,
	angularVelocity: 0
}

const pendulum2Config = {
	length: 150,
	mass: 100,
	angle: Math.PI / 2,
	angularVelocity: 0
}

const simParameters = {
	gravity: 9.81,
	dt: 0.005,
	stepRate: 10
}

export let sim = new Simulation(
	new Pendulum(pendulum1Config),
	new Pendulum(pendulum2Config),
	simParameters.gravity,
	simParameters.dt,
	simParameters.stepRate
);

async function main() {

	const wasmSim = await sim.initializeWasmSim();

	let {app, origin, pixiContent, pendulumContainer} = setupPixiApp();
	synchronizeSettings();

	let initPos1 = sim.pendulum1.position(0, 0);
	let initPos2 = sim.pendulum2.position(initPos1.x, initPos1.y);
	let pos1 = initPos1;
	let pos2 = initPos2;

	pendulumContainer.addChild(sim.pendulum2.trailGraphics);
	pendulumContainer.addChild(sim.pendulum2.graphics);
	pendulumContainer.addChild(sim.pendulum1.graphics);

	function synchronizeSettings() {
		// Time Rate and Step
		(document.getElementById('time-rate-number') as HTMLInputElement).value = String(sim.stepRate / 10);
		(document.getElementById('time-rate-slider') as HTMLInputElement).value = String(sim.stepRate / 10);
		(document.getElementById('time-step-number') as HTMLInputElement).value = String(sim.dt);
		(document.getElementById('time-step-slider') as HTMLInputElement).value = String(sim.dt);
		// Pendulum 1
		(document.getElementById('angle1-number') as HTMLInputElement).value =  String(360 * (sim.pendulum1.angle / PI_2));
		(document.getElementById('angle1-slider') as HTMLInputElement).value = String(360 * (sim.pendulum1.angle / PI_2));
		(document.getElementById('velocity1-number') as HTMLInputElement).value = String(sim.pendulum1.angularVelocity);
		(document.getElementById('velocity1-slider') as HTMLInputElement).value = String(sim.pendulum1.angularVelocity);
		(document.getElementById('length1-number') as HTMLInputElement).value =  String(sim.pendulum1.length);
		(document.getElementById('length1-slider') as HTMLInputElement).value = String(sim.pendulum1.length);
		(document.getElementById('mass1-number') as HTMLInputElement).value =  String(sim.pendulum1.mass);
		(document.getElementById('mass1-slider') as HTMLInputElement).value = String(sim.pendulum1.mass);
		// Pendulum 2
		(document.getElementById('angle2-number') as HTMLInputElement).value =  String(360 * (sim.pendulum2.angle / PI_2));
		(document.getElementById('angle2-slider') as HTMLInputElement).value = String(360 * (sim.pendulum2.angle / PI_2));
		(document.getElementById('velocity2-number') as HTMLInputElement).value = String(sim.pendulum2.angularVelocity);
		(document.getElementById('velocity2-slider') as HTMLInputElement).value = String(sim.pendulum2.angularVelocity);
		(document.getElementById('length2-number') as HTMLInputElement).value =  String(sim.pendulum2.length);
		(document.getElementById('length2-slider') as HTMLInputElement).value = String(sim.pendulum2.length);
		(document.getElementById('mass2-number') as HTMLInputElement).value =  String(sim.pendulum2.mass);
		(document.getElementById('mass2-slider') as HTMLInputElement).value = String(sim.pendulum2.mass);
	}

	function reset() {
		const preset = (document.getElementById('dropdown-presets') as HTMLInputElement).value
		switch (preset) {
			case 'Chaotic':
				sim.pendulum1.configure((120/360) * PI_2, 0, 150, 100);
				sim.pendulum2.configure((60/360) * PI_2, 0, 150, 100);
				break;
			case 'Periodic':
				sim.pendulum1.configure((5/360) * PI_2, 0, 150, 100);
				sim.pendulum2.configure((-15/360) * PI_2, 0, 150, 100);
				break;
			case 'Big-Small':
				sim.pendulum1.configure(Math.PI/2, 0, 150, 250);
				sim.pendulum2.configure(Math.PI/2, 0, 150, 30);
				break;
			case 'Small-Big':
				sim.pendulum1.configure(Math.PI/2, 0, 150, 30);
				sim.pendulum2.configure(Math.PI/2, 0, 150, 250);
				break;
			case '60-30':
				sim.pendulum1.configure((60/360) * PI_2, 0, 150, 100);
				sim.pendulum2.configure((30/360) * PI_2, 0, 150, 100);
				break;
			case '90-90':
				sim.pendulum1.configure(Math.PI/2, 0, 150, 100);
				sim.pendulum2.configure(Math.PI/2, 0, 150, 100);
				break;
			case '45-45':
				sim.pendulum1.configure(Math.PI/4, 0, 150, 100);
				sim.pendulum2.configure(Math.PI/4, 0, 150, 100);
				break;
			default:
				sim.pendulum1.configure(Math.PI, 0, 150, 100);
				sim.pendulum2.configure(Math.PI, 0, 150, 100);
				break;
		}
		synchronizeSettings();
	}

	// Draw pendulum graphics
	sim.pendulum1.draw();
	sim.pendulum2.graphics.position = pos1;
	sim.pendulum2.draw();


	function updateSimulation(dt: number) {
		for (let i = 0; i < sim.stepRate; i++) {
			wasmSim.simulate_step(dt);
		}
		const p1 = wasmSim.read_pendulum1();
		const p2 = wasmSim.read_pendulum2();
		sim.pendulum1.angle = p1.get_angle();
		sim.pendulum2.angle = p2.get_angle();
		sim.pendulum1.angularVelocity = p1.get_angular_velocity();
		sim.pendulum2.angularVelocity = p2.get_angular_velocity();
	}

	function updateRender() {
		// Update transformations
		pos1 = sim.pendulum1.position(0, 0);
		pos2 = sim.pendulum2.position(pos1.x, pos1.y);
		sim.pendulum1.graphics.clear();
		sim.pendulum1.draw();
		sim.pendulum2.graphics.clear();
		sim.pendulum2.graphics.position = pos1;
		sim.pendulum2.draw();
	}

	let trail = true;
	const startTime = Date.now();
	let lastTime = 0;
	let draggingPendulum: number;

	app.ticker.add(() => {
		if (sim.isRunning() && !draggingPendulum) {
			updateSimulation(sim.dt);
			if (trail) { 
				sim.pendulum2.updateTrail(pos2); 
				sim.pendulum2.drawTrail();
			}
			const currentTime = (Date.now() - startTime) / 1000;
			if (document.getElementById('graph-content')?.classList.contains('active')) {
				if (graphMode == "lines" && currentTime - lastTime > 0.02) {
					updatePlot(sim.pendulum1, sim.pendulum2, currentTime);
					lastTime = currentTime;
				}
				else if (graphMode == "markers" && currentTime - lastTime > 0.1) {
					updatePlot(sim.pendulum1, sim.pendulum2, currentTime);
					lastTime = currentTime;
				}
			}
		}
		updateRender();
	});

	// pause/start button
	const pauseStartButton = document.getElementById('pause-start-btn') as HTMLButtonElement;
	pauseStartButton.addEventListener('click', () => {
		sim.paused = !sim.paused;
		pauseStartButton.textContent = sim.paused ? 'Start' : 'Pause';
	});

	document.getElementById('reset-btn')?.addEventListener('click', () => {
		sim.paused = true;
		pauseStartButton.textContent = sim.paused ? 'Start' : 'Pause';
		reset();
	});

	document.getElementById('dropdown-presets')?.addEventListener('change', () => {
		sim.paused = true;
		pauseStartButton.textContent = sim.paused ? 'Start' : 'Pause';
		reset();
	});

	// PENDULUM DRAGGING FUNCTIONALITY
	app.view.addEventListener('mousedown', (event) => {
		const mouseX = event.clientX - origin.x - (window.innerWidth - pixiContent.clientWidth);
		const mouseY = event.clientY - origin.y - (window.innerHeight - pixiContent.clientHeight);
		const distToBob1 = Math.sqrt((mouseX - pos1.x) ** 2 + (mouseY - pos1.y) ** 2);
		const distToBob2 = Math.sqrt((mouseX - pos2.x) ** 2 + (mouseY - pos2.y) ** 2);
		if (distToBob1 < sim.pendulum1.radius() + 10) {
			draggingPendulum = 1;
		} else if (distToBob2 < sim.pendulum1.radius() + 10) {
			draggingPendulum = 2;
		}
	});

	app.view.addEventListener('mousemove', (event) => {
		if (draggingPendulum) {
			const mouseX = event.clientX - origin.x - (window.innerWidth - pixiContent.clientWidth);
			const mouseY = event.clientY - origin.y - (window.innerHeight - pixiContent.clientHeight);
			if (draggingPendulum == 1) {
				const newAngle = Math.atan2(mouseX, mouseY);
				sim.pendulum1.configure(newAngle, 0, sim.pendulum1.length, sim.pendulum1.mass);
				sim.pendulum2.configure(sim.pendulum2.angle, 0, sim.pendulum2.length, sim.pendulum2.mass);
			}
			else if (draggingPendulum == 2) {
				const newAngle = Math.atan2(mouseX - pos1.x, mouseY - pos1.y);
				sim.pendulum2.configure(newAngle, 0, sim.pendulum2.length, sim.pendulum2.mass);
				sim.pendulum1.configure(sim.pendulum1.angle, 0, sim.pendulum1.length, sim.pendulum1.mass);
			}
			sim.pendulum2.trail = []
		}
	});

	app.view.addEventListener('mouseup', () => {
		draggingPendulum = 0;
	});

	// Input and Slider Synchronization
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
		sim.pendulum1.angle = value / 360 * PI_2;
		sim.pendulum2.trail = [];
	});
	// *** ANGLE 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('angle2-number', 'angle2-slider', (value) => {
		sim.pendulum2.angle = value / 360 * PI_2;
		sim.pendulum2.trail = [];
	});
	// *** ANGULAR VELOCITY 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('velocity1-number', 'velocity1-slider', (value) => {
		sim.pendulum1.angularVelocity = value / 1000;
	});
	// *** ANGULAR VELOCITY 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('velocity2-number', 'velocity2-slider', (value) => {
		sim.pendulum2.angularVelocity = value / 1000;
	});
	// *** LENGTH 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('length1-number', 'length1-slider', (value) => {
		sim.pendulum1.length = value;
		sim.pendulum1.graphics.clear();
		sim.pendulum1.draw();
	});
	// *** LENGTH 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('length2-number', 'length2-slider', (value) => {
		sim.pendulum2.length = value;
		sim.pendulum2.graphics.clear();
		sim.pendulum2.draw();
	});
	// *** MASS 1 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('mass1-number', 'mass1-slider', (value) => {
		sim.pendulum1.mass = value < 1 ? 1 : value;
		sim.pendulum1.graphics.clear();
		sim.pendulum1.draw();
	});
	// *** MASS 2 TEXTBOX AND SLIDER FUNCTIONALITY *** //
	synchronizeInputAndSlider('mass2-number', 'mass2-slider', (value) => {
		sim.pendulum2.mass = value < 1 ? 1 : value;
		sim.pendulum2.graphics.clear();
		sim.pendulum2.draw();
	});
	// *** TIME RATE FUNCTIONALITY *** //
	synchronizeInputAndSlider('time-rate-number', 'time-rate-slider', (value) => {
		sim.stepRate = value * 10;
	});
	// *** TIME STEP FUNCTIONALITY *** //
	synchronizeInputAndSlider('time-step-number', 'time-step-slider', (value) => {
		sim.dt = value;
	});
	// *** PATH SETTINGS FUNCTIONALITY *** //
	document.getElementById('show-path')?.addEventListener('input', () => {
		const checkbox = document.getElementById('show-path') as HTMLInputElement;
		if (checkbox.checked) {
			trail = true;
		} else {
			trail = false;
			sim.pendulum2.trail = [];
			sim.pendulum2.drawTrail();
		}
	});
	document.getElementById('path-length')?.addEventListener('input', () => {
		const slider = document.getElementById('path-length') as HTMLInputElement;
		sim.pendulum2.maxTrailLength = +slider.value;
	});
}

main();


