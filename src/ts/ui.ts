
import { sim } from './index'

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