import { Application, Container, Point, Ticker } from 'pixi.js'
import { Bob } from './Bob';

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 800,
	height: 600
});

const cont: Container = new Container();
cont.position = new Point(200,200);
app.stage.addChild(cont)

const gravity: number = 10;
const bob1: Bob = new Bob(1, 100, Math.PI/2);
cont.addChild(bob1);
bob1.draw();

function update(): void {
	bob1.accelerate(gravity);
	bob1.update(0.1);
}

Ticker.shared.add(update);