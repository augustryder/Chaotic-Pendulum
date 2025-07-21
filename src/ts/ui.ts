
import { sim } from './index';
import { PI_2 } from 'pixi.js';

function reset() {
    sim.stop();
    const preset = (document.getElementById('dropdown-presets') as HTMLInputElement).value;
    sim.configureWithPreset(preset)
    synchronizeSettingsUI();
}

// pause/start button
const pauseStartButton = document.getElementById('pause-start-btn') as HTMLButtonElement;
pauseStartButton.addEventListener('click', () => {
    if (sim.isRunning()) sim.stop()
    else sim.start()
    pauseStartButton.textContent = sim.isRunning() ? 'Pause' : 'Start';
});

document.getElementById('reset-btn')?.addEventListener('click', () => {
    pauseStartButton.textContent = 'Start';
    reset();
});

document.getElementById('dropdown-presets')?.addEventListener('change', () => {
    pauseStartButton.textContent = 'Start';
    reset();
});

export function synchronizeSettingsUI() {
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
        sim.pendulum2.trailEnabled = true;
    } else {
        sim.pendulum2.trailEnabled = false;
        sim.pendulum2.trail = [];
        sim.pendulum2.drawTrail();
    }
});

document.getElementById('path-length')?.addEventListener('input', () => {
    const slider = document.getElementById('path-length') as HTMLInputElement;
    sim.pendulum2.maxTrailLength = +slider.value;
});