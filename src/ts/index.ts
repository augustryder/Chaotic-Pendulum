import '/src/ts/script.ts'
import '/src/styles.css';
import { Application, Container, Graphics, ParticleContainer, Point, Texture } from 'pixi.js';
import { Pendulum } from './Pendulum';
import { Emitter } from '@pixi/particle-emitter';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x000019,
	width: window.innerWidth * 0.6,
	height: window.innerHeight
});

var origin = { x: (window.innerWidth * 0.6) / 2, y: window.innerHeight / 2 };

const pendulum1 = new Pendulum(150, 1.0, Math.PI / 2);
const pendulum2 = new Pendulum(150, 1.0, Math.PI / 2);

const graphics = new Graphics();
app.stage.addChild(graphics);

const g = 9.81;
const dt = 0.1;

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

const arm1 = new Graphics();
const bob1 = new Graphics();
const arm2 = new Graphics();
const bob2 = new Graphics();

pendulumContainer.addChild(arm1);
pendulumContainer.addChild(arm2);
pendulumContainer.addChild(bob1);
pendulumContainer.addChild(bob2);

const particleContainer = new ParticleContainer();
pendulumContainer.addChild(particleContainer);

const emitter = new Emitter(particleContainer, {
	lifetime: { min: 1, max: 1 },
	frequency: 0.01,
	emit: false,
	spawnChance: 1,
	particlesPerWave: 1,
	pos: { x: 0, y: 0 },
	autoUpdate: false,
	behaviors: [
	  {
		type: 'spawnShape',
		config: { type: 'torus', data: { x: 0, y: 0, radius: 5 } },
	  },
	  { type: 'textureSingle', config: { texture: Texture.WHITE } },
	  {
		type: 'alpha',
		config: {
		  alpha: {
			list: [
			  { value: 0.8, time: 0 },
			  { value: 0.4, time: 2 },
			  { value: 0.2, time: 4 },
			  { value: 0.2, time: 6 },
			],
		  },
		},
	  },
	  {
		type: 'scale',
		config: {
		  scale: {
			list: [{value: 0.3, time: 0}, {value: 0.3, time: 0.5}, {value: 0.3, time: 1}]
		  }
		}
	  }
	],
  });

// Draw pendulum graphics
function drawSystem(p1: Point, p2: Point) {

	arm1.lineStyle(2, 0xFFFFFF)
		.lineTo(p1.x, p1.y);

	arm2.position = p1;
	arm2.lineStyle(2, 0xFFFFFF)
		.lineTo(p1.x, p1.y);

	bob1.position = p1;
	bob1.beginFill(0x7777FF)
		.drawCircle(0, 0, 10)
		.endFill();
	
	bob2.position = p2;
	bob2.beginFill(0x7777FF)
		.drawCircle(0, 0, 10)
		.endFill();
}

drawSystem(initPos1, initPos2);

let paused = true;

app.ticker.add(() => {
  // Leapfrog integration
  if (!paused && !draggingPendulum) {
	pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
	pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;
  
	pendulum1.angle += pendulum1.angularVelocity * dt;
	pendulum2.angle += pendulum2.angularVelocity * dt;
  
	pendulum1.updateAngularAcceleration(pendulum1, pendulum2, g);
	pendulum2.updateAngularAcceleration(pendulum1, pendulum2, g);
  
	pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
	pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;

	emitter.emit = true;
  }

  if (paused) {
	emitter.emit = false;
  }

  	// Update transformations
	pos1.x = pendulum1.length * Math.sin(pendulum1.angle);
	pos1.y = pendulum1.length * Math.cos(pendulum1.angle);
  
	pos2.x = pos1.x + pendulum2.length * Math.sin(pendulum2.angle);
	pos2.y = pos1.y + pendulum2.length * Math.cos(pendulum2.angle);
  
	arm1.rotation = -1 * pendulum1.angle + Math.PI/2;
	bob1.position = pos1
  
	arm2.position.set(pos1.x, pos1.y);
	arm2.rotation = -1 * pendulum2.angle + Math.PI/2;
	bob2.position = pos2;
	emitter.spawnPos = pos2;

	emitter.update((app.ticker.elapsedMS * 0.001));

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
	}
  });
  
  app.view.addEventListener('mouseup', () => {
	draggingPendulum = 0;
  });

  
