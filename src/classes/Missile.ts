export class Missile extends Phaser.Physics.Arcade.Sprite {
    private turnDegreesPerFrame: number = 1;
	private speed: number = 100;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "tiles_spr", 50);
        scene.add.existing(this);
        scene.physics.add.existing(this);
	}
	update(delta: number): void {
		const target = this.scene.game.input.mousePointer;

		const targetAngle = Phaser.Math.Angle.Between(
			this.y,
			this.x,
			target.y + this.scene.cameras.main.scrollY,
			target.x + this.scene.cameras.main.scrollX
		);
		// clamp to -PI to PI for smarter turning
		let diff = Phaser.Math.Angle.Wrap(targetAngle - this.rotation);

		// set to targetAngle if less than turnDegreesPerFrame
		if (Math.abs(diff) < Phaser.Math.DegToRad(this.turnDegreesPerFrame)) {
			this.rotation = targetAngle;
		} else {
			let angle = this.angle;
			if (diff > 0) {
				// turn clockwise
				angle += this.turnDegreesPerFrame;
			} else {
				// turn counter-clockwise
				angle -= this.turnDegreesPerFrame;
			}

			this.setAngle(angle);
		}

		// move missile in direction facing
		const vx = Math.cos(this.rotation) * this.speed;
		const vy = Math.sin(this.rotation) * this.speed;

        this.setVelocityX(vx);
		this.setVelocityY(vy);
		
	}
}
