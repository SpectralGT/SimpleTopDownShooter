import { Bullet } from "./bullet";

export class Missile extends Bullet {
	private turnSpeed: number = 5;
	private speed: number = 250;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
	update(): void {
		var targetAngle = Phaser.Math.Angle.Between(
			this.x,
			this.y,
			this.scene.game.input.activePointer.worldX,
			this.scene.game.input.activePointer.worldY
		);

		// Gradually (this.TURN_RATE) aim the missile towards the target angle
		if (this.rotation !== targetAngle) {
			// Calculate difference between the current angle and targetAngle
			var delta = targetAngle - this.rotation;

			// Keep it in range from -180 to 180 to make the most efficient turns.
			if (delta > Math.PI) delta -= Math.PI * 2;
			if (delta < -Math.PI) delta += Math.PI * 2;

			if (delta > 0) {
				// Turn clockwise
				this.angle += this.turnSpeed;
			} else {
				// Turn counter-clockwise
				this.angle -= this.turnSpeed;
			}

			// Just set angle to target angle if they are close
			if (Math.abs(delta) < Phaser.Math.DegToRad(this.turnSpeed)) {
				this.rotation = targetAngle;
			}

			this.body.velocity.x = Math.cos(this.rotation) * this.speed;
			this.body.velocity.y = Math.sin(this.rotation) * this.speed;
		}
	}
}
