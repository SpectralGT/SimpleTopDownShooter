export class Missile extends Phaser.Physics.Arcade.Sprite {
	private velocityFromRotation =
		Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation;
	private desiredAngle!: number;
	private angleDelta!: number;
	private turnSpeed: number = 1 * Math.PI;
	private turnSpeedDegrees: number = Phaser.Math.RadToDeg(this.turnSpeed);
	private speed: number = 50;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "tiles_spr", 50);

		scene.add.existing(this);
		scene.physics.add.existing(this);
	}
	update(): void {
		this.desiredAngle = Phaser.Math.Angle.Between(
			this.x,
			this.y,
			this.scene.input.mousePointer.x + this.scene.cameras.main.scrollX,
			this.scene.input.mousePointer.y + this.scene.cameras.main.scrollY
		);
		this.angleDelta = Phaser.Math.Angle.Wrap(this.desiredAngle - this.rotation);

		if (Phaser.Math.Within(this.angleDelta, 0, 0.02 * this.turnSpeed)) {
			this.rotation = this.desiredAngle;
			this.setAngularVelocity(0);
		} else {
			this.setAngularVelocity(Math.sign(this.angleDelta) * this.turnSpeedDegrees);
		}

		this.velocityFromRotation(this.rotation, this.speed, this.body.velocity);
	}
}
