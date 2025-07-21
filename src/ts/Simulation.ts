import { Pendulum } from "./Pendulum";

// @ts-ignore: No types available for WASM module
import SimulationModule from '/static/wasm/simulation.js';

export class Simulation {
    paused: boolean = false;
    pendulum1: Pendulum;
    pendulum2: Pendulum;
    gravity: number;
    dt: number;
    stepRate: number;
    wasm: any;

    constructor(pendulum1: Pendulum, pendulum2: Pendulum, gravity: number, dt: number, stepRate: number) {
        this.pendulum1 = pendulum1
        this.pendulum2 = pendulum2
        this.gravity = gravity;
        this.dt = dt;
        this.stepRate = stepRate;          
    }

    async initializeWasmSim() {
        this.wasm = await SimulationModule({
            locateFile: (path: string) => path.endsWith('.wasm') ? '/static/wasm/simulation.wasm' : path
        });
        const wasmPendulum1 = new this.wasm.Pendulum(
            this.pendulum1.length, 
            this.pendulum1.mass, 
            this.pendulum1.angle, 
            this.pendulum1.angularVelocity
        );
        const wasmPendulum2 = new this.wasm.Pendulum(
            this.pendulum2.length, 
            this.pendulum2.mass, 
            this.pendulum2.angle, 
            this.pendulum2.angularVelocity
        );
        return new this.wasm.Simulation(wasmPendulum1, wasmPendulum2, this.gravity);
    }

    isRunning() { return !this.paused }
    

}