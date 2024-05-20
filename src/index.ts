import { Application, Container, Graphics, Point } from 'pixi.js';
import { Pendulum } from './Pendulum';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 1000,
	height: 800
});

const origin = { x: 500, y: 300 };
const pendulum1 = new Pendulum(200, 1.0, Math.PI / 2);
const pendulum2 = new Pendulum(200, 1.0, Math.PI / 2);

const graphics = new Graphics();
app.stage.addChild(graphics);

const g = 9.81;
const dt = 0.1;

// Create a container for the pendulum
const pendulumContainer = new Container();
pendulumContainer.position = new Point(origin.x, origin.y);
app.stage.addChild(pendulumContainer);

// Draw pendulum graphics
var pos1 = new Point(pendulum1.position(0, 0).x, pendulum1.position(0, 0).y);
var pos2 = new Point(pendulum2.position(pos1.x, pos1.y).x, pendulum2.position(pos1.x, pos1.y).y);

const arm1 = new Graphics();
arm1.lineStyle(2, 0x000000)
	.lineTo(pos1.x, pos2.y);

const bob1 = new Graphics();
bob1.position = pos1;
bob1.beginFill(0x000000)
  	.drawCircle(0, 0, 10)
 	.endFill();

const arm2 = new Graphics();
arm2.position = pos1;
arm2.lineStyle(2, 0x000000)
	.lineTo(pos1.x, pos1.y);

const bob2 = new Graphics();
bob2.position = pos2;
bob2.beginFill(0x000000)
	.drawCircle(0, 0, 10)
	.endFill();

pendulumContainer.addChild(arm1);
pendulumContainer.addChild(bob1);
pendulumContainer.addChild(arm2);
pendulumContainer.addChild(bob2);

app.ticker.add(() => {
  // Leapfrog integration
  pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
  pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;

  pendulum1.angle += pendulum1.angularVelocity * dt;
  pendulum2.angle += pendulum2.angularVelocity * dt;

  pendulum1.updateAngularAcceleration(pendulum1, pendulum2, g);
  pendulum2.updateAngularAcceleration(pendulum1, pendulum2, g);

  pendulum1.angularVelocity += pendulum1.angularAcceleration * dt / 2;
  pendulum2.angularVelocity += pendulum2.angularAcceleration * dt / 2;

  // Update transformations
  pos1.x = pendulum1.length * Math.sin(pendulum1.angle);
  pos1.y = pendulum1.length * Math.cos(pendulum1.angle);

  pos2.x = pos1.x + pendulum2.length * Math.sin(pendulum2.angle);
  pos2.y = pos1.y + pendulum2.length * Math.cos(pendulum2.angle);

  arm1.rotation = -1 * pendulum1.angle + Math.PI/2;
  bob1.position = pos1;

  arm2.position.set(pos1.x, pos1.y);
  arm2.rotation = -1 * pendulum2.angle + Math.PI/2;
  bob2.position = pos2;

});
