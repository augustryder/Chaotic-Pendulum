import { Graphics, Point } from "pixi.js";

export class Pendulum {
    length: number;
    mass: number;
    angle: number;
    angularVelocity: number;
    trail: { x: number, y: number, alpha: number }[] = [];
    maxTrailLength: number = 1250;
    trailEnabled: boolean = true;
    graphics: Graphics;
    trailGraphics: Graphics;
  
    constructor(pendulumConfig: any) {
      this.length = pendulumConfig.length;
      this.mass = pendulumConfig.mass;
      this.angle = pendulumConfig.angle;
      this.angularVelocity = pendulumConfig.angularVelocity;
      this.graphics = new Graphics();
      this.trailGraphics = new Graphics();
    }

    configure(pendulumConfig: any) {
      this.length = pendulumConfig.length;
      this.mass = pendulumConfig.mass;
      this.angle = pendulumConfig.angle;
      this.angularVelocity = pendulumConfig.angularVelocity;
    }
    
    getConfig() {
      return {
          length: this.length,
          mass: this.mass,
          angle: this.angle,
          angularVelocity: this.angularVelocity
      }
    }

    bobPosition(): Point {
      return new Point(this.graphics.x + this.length * Math.sin(this.angle),
                       this.graphics.y + this.length * Math.cos(this.angle));
    }

    radius(): number {
      return this.mass / 10;
    }
    
    draw() {
      const pos = new Point(this.length * Math.sin(this.angle), this.length * Math.cos(this.angle))
      this.graphics.lineStyle(2, 0xffffff)
                   .lineTo(pos.x, pos.y)
                   .lineStyle(0, 0xffffff)
                   .beginFill(0xffffff)
                   .drawCircle(pos.x, pos.y, this.radius())
                   .endFill();
    }

    updateTrail() {
      const position = this.bobPosition();
      // Add new position to the trail
      this.trail.push({ x: position.x, y: position.y, alpha: 1.0 });
      // Remove the oldest position if trail is too long
      if (this.trail.length > this.maxTrailLength) {
          this.trail.shift();
      }
      // Decrease alpha of each trail point
      for (let i = 0; i < this.trail.length; i++) {
          this.trail[i].alpha -= 1 / this.maxTrailLength;
      }
    }

    drawTrail() {
      this.trailGraphics.clear();
      this.trailGraphics.lineStyle(4, 0xffffff, 1);

      for (let i = 1; i < this.trail.length; i++) {
          const start = this.trail[i - 1];
          const end = this.trail[i];
          this.trailGraphics.moveTo(start.x, start.y);
          this.trailGraphics.lineStyle(4, 0xccccff, start.alpha);
          this.trailGraphics.lineTo(end.x, end.y);
      }
    }

  }
