import { Application, Container, Point } from 'pixi.js';

export function setupPixiApp() {
    const pixiCanvasHeight = window.innerHeight;
    const pixiCanvasWidth = window.innerWidth * 0.55;

	const app = new Application<HTMLCanvasElement>({
		view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
		resolution: window.devicePixelRatio || 1,
		autoDensity: true,
		backgroundColor: 0x000019,
		width: pixiCanvasWidth,
		height: pixiCanvasHeight
	});

	const pixiContent = document.getElementById('pixi-content') as HTMLElement;
	let origin = { x: pixiContent.clientWidth / 2, y: pixiContent.clientHeight / 2 };

	window.onload = () => {
		app.renderer.resize(pixiCanvasWidth, pixiCanvasHeight);
		origin = { x: pixiContent.clientWidth / 2, y: pixiContent.clientHeight / 2 };
	};

    window.addEventListener('resize', () => {
		app.renderer.resize(pixiCanvasWidth, pixiCanvasHeight);
		origin = { x: pixiContent.clientWidth / 2, y: pixiContent.clientHeight / 2 };
		pendulumContainer.position = new Point(origin.x, origin.y);
	});

    const pendulumContainer = new Container();
    pendulumContainer.position = new Point(origin.x, origin.y);
    app.stage.addChild(pendulumContainer);

    return { app, origin, pixiContent, pendulumContainer };
}