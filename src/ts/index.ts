import '../styles.css';
import { Pendulum } from './Pendulum';
import { graphMode, updatePlot } from './graphs';
import { setupPixiApp } from './pixi-setup';
import { setupUI } from './ui';
// @ts-expect-error: No types available for presets.js
import { presets } from '/static/presets.js';

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

	let app = setupPixiApp();
	setupUI();
	await sim.initializeWasmSim();

	const startTime = Date.now();
	let lastTime = 0;
	app.ticker.add(() => {
		updateRender();
		if (sim.isRunning()) {
			sim.update(sim.dt);
			if (sim.pendulum2.trailEnabled) { 
				sim.pendulum2.updateTrail()
				sim.pendulum2.drawTrail();
			}
			updateGraph();
		}
	});

	function updateRender() {
		sim.pendulum1.graphics.clear();
		sim.pendulum1.draw();
		sim.pendulum2.graphics.clear();
		sim.pendulum2.graphics.position = sim.pendulum1.bobPosition();
		sim.pendulum2.draw();
	}

	function updateGraph() {
		const graphContent = document.getElementById('graph-content');
		if (!graphContent?.classList.contains('active')) return;

		const currentTime = (Date.now() - startTime) / 1000;
		const timeDelta = currentTime - lastTime;

		if (
			(graphMode === "lines" && timeDelta > 0.02) ||
			(graphMode === "markers" && timeDelta > 0.1)
		) {
			updatePlot(sim.pendulum1, sim.pendulum2, currentTime);
			lastTime = currentTime;
		}
	}
}

main();


