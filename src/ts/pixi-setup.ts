import { Application, Container, Point } from 'pixi.js';
import { sim } from './index'
import { clearGraph } from './graphs';

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
        const newWidth = window.innerWidth * 0.55;
        const newHeight = window.innerHeight;
        app.renderer.resize(newWidth, newHeight);
        origin = { x: pixiContent.clientWidth / 2, y: pixiContent.clientHeight / 2 };
        pendulumContainer.position = new Point(origin.x, origin.y);
    });

    const pendulumContainer = new Container();
    pendulumContainer.position = origin;
    app.stage.addChild(pendulumContainer);

    pendulumContainer.addChild(sim.pendulum2.trailGraphics);
	pendulumContainer.addChild(sim.pendulum2.graphics);
	pendulumContainer.addChild(sim.pendulum1.graphics);

    // PENDULUM DRAGGING FUNCTIONALITY
    app.view.addEventListener('mousedown', (event) => {
        const mouseX = event.clientX - origin.x - (window.innerWidth - pixiContent.clientWidth);
        const mouseY = event.clientY - origin.y - (window.innerHeight - pixiContent.clientHeight);
        let bobPos1 = sim.pendulum1.bobPosition();
		let bobPos2 = sim.pendulum2.bobPosition();
        const distToBob1 = Math.sqrt((mouseX - bobPos1.x) ** 2 + (mouseY - bobPos1.y) ** 2);
        const distToBob2 = Math.sqrt((mouseX - bobPos2.x) ** 2 + (mouseY - bobPos2.y) ** 2);
    
        let dragging = 0;
        if (distToBob1 < sim.pendulum1.radius() + 10) {
            sim.stop();
            sim.pendulum2.trail = [];
            sim.pendulum2.drawTrail(); 
            clearGraph();
            dragging = 1;
            const pauseStartButton = document.getElementById('pause-start-btn') as HTMLButtonElement;
            pauseStartButton.textContent = 'Start';
        } else if (distToBob2 < sim.pendulum1.radius() + 10) {
            sim.stop();
            sim.pendulum2.trail = [];
            sim.pendulum2.drawTrail(); 
            clearGraph();
            dragging = 2;
            const pauseStartButton = document.getElementById('pause-start-btn') as HTMLButtonElement;
            pauseStartButton.textContent = 'Start';
        } else {
            return; // Not clicking on a pendulum
        }
    
        function onMouseMove(moveEvent: MouseEvent) {
            const moveX = moveEvent.clientX - origin.x - (window.innerWidth - pixiContent.clientWidth);
            const moveY = moveEvent.clientY - origin.y - (window.innerHeight - pixiContent.clientHeight);
            const pendulum1Config = {
                length: sim.pendulum1.length,
                mass: sim.pendulum1.mass,
                angle: (dragging === 1) ? Math.atan2(moveX, moveY) : sim.pendulum1.angle,
                angularVelocity: 0
            }
            const pendulum2Config = {
                length: sim.pendulum2.length,
                mass: sim.pendulum2.mass,
                angle: (dragging === 2) ? Math.atan2(moveX - bobPos1.x, moveY - bobPos1.y) : sim.pendulum2.angle,
                angularVelocity: 0
            }
            sim.configure(pendulum1Config, pendulum2Config);
            sim.pendulum2.trail = [];
        }
    
        function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
    
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

    });

    return app;
}
