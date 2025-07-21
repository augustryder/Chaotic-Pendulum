import './script.ts';
import '../styles.css';
import { Pendulum } from './Pendulum';
import { graphMode, updatePlot } from './graphs';
import { setupPixiApp } from './pixi-setup';
import { synchronizeSettingsUI } from './ui';
import { presets } from './presets';

// @ts-ignore: No types available for WASM module
import SimulationModule from '/static/wasm/simulation.js';
import { Simulation } from './Simulation';

const simParameters = {
	gravity: 9.81,
	dt: 0.005,
	stepRate: 10
}

export let sim = new Simulation(
	new Pendulum(presets['Default'].pendulum1Config),
	new Pendulum(presets['Default'].pendulum2Config),
	simParameters.gravity,
	simParameters.dt,
	simParameters.stepRate
);

async function main() {

	const wasmSim = await sim.initializeWasmSim();

	let {app, origin, pixiContent, pendulumContainer} = setupPixiApp();
	synchronizeSettingsUI();
	console.log(origin, pixiContent);

	pendulumContainer.addChild(sim.pendulum2.trailGraphics);
	pendulumContainer.addChild(sim.pendulum2.graphics);
	pendulumContainer.addChild(sim.pendulum1.graphics);

	// Draw pendulum graphics
	sim.pendulum1.draw();
	sim.pendulum2.graphics.position = sim.pendulum1.bobPosition()
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
		sim.pendulum1.graphics.clear();
		sim.pendulum1.draw();

		sim.pendulum2.graphics.clear();
		sim.pendulum2.graphics.position = sim.pendulum1.bobPosition();
		sim.pendulum2.draw();
	}

	const startTime = Date.now();
	let lastTime = 0;

	app.ticker.add(() => {
		if (sim.isRunning()) {
			updateSimulation(sim.dt);
			if (sim.pendulum2.trailEnabled) { 
				sim.pendulum2.updateTrail(sim.pendulum2.bobPosition()); 
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

}

main();


