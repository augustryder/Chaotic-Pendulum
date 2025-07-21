import { Pendulum } from './Pendulum';
import { presets } from './presets';
// @ts-ignore: No types available for WASM module
import SimulationModule from '/static/wasm/simulation.js';

export class Simulation {
    paused: boolean = false;
    pendulum1: Pendulum;
    pendulum2: Pendulum;
    gravity: number;
    dt: number;
    stepRate: number;
    wasmSim: any;

    constructor(pendulum1: Pendulum, pendulum2: Pendulum, gravity: number, dt: number, stepRate: number) {
        this.pendulum1 = pendulum1
        this.pendulum2 = pendulum2
        this.gravity = gravity;
        this.dt = dt;
        this.stepRate = stepRate;          
    }

    async initializeWasmSim() {
        const wasm = await SimulationModule({
            locateFile: (path: string) => path.endsWith('.wasm') ? '/static/wasm/simulation.wasm' : path
        });
        const wasmPendulum1 = new wasm.Pendulum(
            this.pendulum1.length, 
            this.pendulum1.mass, 
            this.pendulum1.angle, 
            this.pendulum1.angularVelocity
        );
        const wasmPendulum2 = new wasm.Pendulum(
            this.pendulum2.length, 
            this.pendulum2.mass, 
            this.pendulum2.angle, 
            this.pendulum2.angularVelocity
        );
        this.wasmSim = new wasm.Simulation(wasmPendulum1, wasmPendulum2, this.gravity);
    }

    configure(pendulum1Config: any, pendulum2Config: any) {

        this.wasmSim.configure_pendulum1(
            pendulum1Config.length,
            pendulum1Config.mass,
            pendulum1Config.angle,
            pendulum1Config.angularVelocity
        );

        this.wasmSim.configure_pendulum2(
            pendulum2Config.length,
            pendulum2Config.mass,
            pendulum2Config.angle,
            pendulum2Config.angularVelocity
        );

        this.pendulum1.configure(pendulum1Config);
        this.pendulum2.configure(pendulum2Config);

    }

    configureWithPreset(preset: string) {
        const presetConfig = presets[preset as keyof typeof presets];
        const pendulum1Config = presetConfig.pendulum1Config;
        const pendulum2Config = presetConfig.pendulum2Config;

        this.wasmSim.configure_pendulum1(
            pendulum1Config.length,
            pendulum1Config.mass,
            pendulum1Config.angle,
            pendulum1Config.angularVelocity
        );

        this.wasmSim.configure_pendulum2(
            pendulum2Config.length,
            pendulum2Config.mass,
            pendulum2Config.angle,
            pendulum2Config.angularVelocity
        );

        this.pendulum1.configure(pendulum1Config);
        this.pendulum2.configure(pendulum2Config);
    }

    update(dt: number) {
		for (let i = 0; i < this.stepRate; i++) {
			this.wasmSim.simulate_step(dt);
		}
		const p1 = this.wasmSim.read_pendulum1();
		const p2 = this.wasmSim.read_pendulum2();
		this.pendulum1.angle = p1.get_angle();
		this.pendulum2.angle = p2.get_angle();
		this.pendulum1.angularVelocity = p1.get_angular_velocity();
		this.pendulum2.angularVelocity = p2.get_angular_velocity();
	}

    isRunning() { return !this.paused }
    start() { this.paused = false; }
    stop() { this.paused = true; }
    
}