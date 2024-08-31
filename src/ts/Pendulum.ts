import { Graphics, Point } from "pixi.js";

export class Pendulum {
    length: number;
    mass: number;
    angle: number;
    angularVelocity: number;
    angularAcceleration: number;
    trail: { x: number, y: number, alpha: number }[] = [];
    maxTrailLength: number = 1250;
    graphics: Graphics;
    trailGraphics: Graphics;
  
    constructor(length: number, mass: number, angle: number) {
      this.length = length;
      this.mass = mass;
      this.angle = angle;
      this.angularVelocity = 0;
      this.angularAcceleration = 0;
      this.graphics = new Graphics();
      this.trailGraphics = new Graphics();
    }
    
    position(x: number, y: number): Point {
      return new Point(x + this.length * Math.sin(this.angle),
                       y + this.length * Math.cos(this.angle));
    }

    radius(): number {
      return this.mass / 10
    }

    configure(angle: number, angularVelocity: number, length: number, mass: number) {
      this.angle = angle;
      this.angularVelocity = angularVelocity;
      this.angularAcceleration = 0;
      this.length = length;
      this.mass = mass;
      this.trail = [];
      this.drawTrail();
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

    updateAngularAcceleration(pendulum1: Pendulum, pendulum2: Pendulum, g: number) {
      const m1 = pendulum1.mass;
      const m2 = pendulum2.mass;
      const l1 = pendulum1.length;
      const l2 = pendulum2.length;
      const theta1 = pendulum1.angle;
      const theta2 = pendulum2.angle;
      const omega1 = pendulum1.angularVelocity;
      const omega2 = pendulum2.angularVelocity;
  
      const deltaTheta = theta1 - theta2;
      const den1 = l1 * (2 * m1 + m2 - m2 * Math.cos(2 * deltaTheta));
      const den2 = l2 * (2 * m1 + m2 - m2 * Math.cos(2 * deltaTheta));
  
      pendulum1.angularAcceleration = (
        -g * (2 * m1 + m2) * Math.sin(theta1)
        - m2 * g * Math.sin(theta1 - 2 * theta2)
        - 2 * Math.sin(deltaTheta) * m2 * (omega2 * omega2 * l2 + omega1 * omega1 * l1 * Math.cos(deltaTheta))
      ) / den1;
  
      pendulum2.angularAcceleration = (
        2 * Math.sin(deltaTheta) * (omega1 * omega1 * l1 * (m1 + m2) + g * (m1 + m2) * Math.cos(theta1) + omega2 * omega2 * l2 * m2 * Math.cos(deltaTheta))
      ) / den2;
    }

    public updateTrail(position: { x: number, y: number }) {

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

    public drawTrail() {
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
