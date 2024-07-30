import '/src/ts/script.ts'
import '/src/styles.css';
import { Application, Container, PI_2, Point} from 'pixi.js';
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
const dt = 0.06;

var origin = { x: (window.innerWidth * 0.6) / 2, y: window.innerHeight / 2 };

const pendulum1 = new Pendulum(150, 1.0, Math.PI / 2);
const pendulum2 = new Pendulum(150, 1.0, Math.PI / 2);

// Create a container for the pendulum
const pendulumContainer = new Container();
pendulumContainer.position = new Point(origin.x, origin.y);
app.stage.addChild(pendulumContainer);

window.addEventListener('resize', () => {
    app.renderer.resize(window.innerWidth * 0.6, window.innerHeight);
	origin = { x: (window.innerWidth * 0.6) / 2, y: window.innerHeight / 2 };
	pendulumContainer.position = new Point(origin.x, origin.y);
});


const initPos1 = new Point(pendulum1.position(0, 0).x, pendulum1.position(0, 0).y);
const initPos2 = new Point(pendulum2.position(initPos1.x, initPos1.y).x, pendulum2.position(initPos1.x, initPos1.y).y);
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

	pendulum2.updateTrail(pos2);
	pendulum2.drawTrail();
  }

  	// Update transformations
	pos1.x = pendulum1.length * Math.sin(pendulum1.angle);
	pos1.y = pendulum1.length * Math.cos(pendulum1.angle);
  
	pos2.x = pos1.x + pendulum2.length * Math.sin(pendulum2.angle);
	pos2.y = pos1.y + pendulum2.length * Math.cos(pendulum2.angle);
  
	pendulum1.graphics.rotation = -1 * pendulum1.angle + Math.PI/2;
	pendulum2.graphics.position = pos1;
	pendulum2.graphics.rotation = -1 * pendulum2.angle + Math.PI/2;

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
	console.log(distToBob1)
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
	pendulum1.angle = Math.atan2(mouseX - origin.x - window.innerWidth * 0.4, mouseY - origin.y);
	}
	else if (draggingPendulum == 2) {
	pendulum2.angle = Math.atan2(mouseX - origin.x - pos1.x - window.innerWidth * 0.4, mouseY - origin.y - pos1.y);
	}
	pendulum1.angularVelocity = 0;
	pendulum1.angularAcceleration = 0;
	pendulum2.angularVelocity = 0;
	pendulum2.angularAcceleration = 0;
	pendulum2.trail = [];
}
});

app.view.addEventListener('mouseup', () => {
draggingPendulum = 0;
});

var changingAngle = 0;
document.getElementById('angle1-slider')?.addEventListener('input', () => {
		changingAngle = 1;
		const slider = document.getElementById('angle1-slider') as HTMLInputElement;
		pendulum1.angle = slider.value as unknown as number / 360 * PI_2;
	});

document.getElementById('angle1-number')?.addEventListener('input', () => {
		changingAngle = 1;
		const slider = document.getElementById('angle1-number') as HTMLInputElement;
		pendulum1.angle = slider.value as unknown as number / 360 * PI_2;
});

document.getElementById('angle1-slider')?.addEventListener('mouseup', () => {
	changingAngle = 0;
	pendulum1.angularVelocity = 0;
	pendulum1.angularAcceleration = 0;
	pendulum2.angularVelocity = 0;
	pendulum2.angularAcceleration = 0;
	pendulum2.trail = [];
});
  
