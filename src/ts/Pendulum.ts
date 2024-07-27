
export class Pendulum {
    length: number;
    mass: number;
    angle: number;
    angularVelocity: number;
    angularAcceleration: number;
  
    constructor(length: number, mass: number, angle: number) {
      this.length = length;
      this.mass = mass;
      this.angle = angle;
      this.angularVelocity = 0;
      this.angularAcceleration = 0;
    }
  
    position(x: number, y: number): { x: number, y: number } {
      return {
        x: x + this.length * Math.sin(this.angle),
        y: y + this.length * Math.cos(this.angle)
      };
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
  }