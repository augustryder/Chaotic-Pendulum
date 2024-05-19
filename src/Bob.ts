import { Graphics } from "pixi.js";

export class Bob extends Graphics {
    
    private bobNumber: number;
    // private mass: number;
    private armLength: number;
    private currAngle: number;
    private prevAngle: number;
    private angularAcc: number;

    constructor(bobNumber: number, armLength: number, initAngle: number) {
        super();
        this.bobNumber = bobNumber;
        // this.mass = mass;
        this.armLength = armLength;
        this.currAngle = initAngle;
        this.prevAngle = initAngle;
        this.angularAcc = 0;
    }

    public accelerate(gravity: number): void {

        if (this.bobNumber == 1) 
        {
            this.angularAcc = (-1 * gravity / this.armLength) * Math.sin(this.currAngle);
        } else 
        {

        }

    }

    public update(dt: number): void {
        let temp = this.currAngle;
        this.currAngle = 2 * this.currAngle - this.prevAngle + this.angularAcc * dt * dt;
        this.prevAngle = temp;
        // this.position.x = this.armLength * Math.sin(this.currAngle);
        // this.position.y = this.armLength * Math.cos(this.currAngle);

        this.rotation = -1 * this.currAngle + Math.PI/2;
    }

    public draw(): void {
        this.position.x = this.armLength * Math.sin(this.currAngle);
        this.position.y = this.armLength * Math.cos(this.currAngle);

        this.beginFill(0xFF00FF);
        this.lineStyle(3, 0x00FF00);
        this.lineTo(this.x, this.y);
        this.endFill;

        this.beginFill(0x000000);
        this.lineStyle(0, 0x000000);
        this.drawCircle(this.x, this.y, 15);
        this.endFill();

    }
}

