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
		var targetAngle = this.game.math.angleBetween(
        this.x, this.y,
        this.game.input.activePointer.x, this.game.input.activePointer.y
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
            this.angle += this.TURN_RATE;
        } else {
            // Turn counter-clockwise
            this.angle -= this.TURN_RATE;
        }

        // Just set angle to target angle if they are close
        if (Math.abs(delta) < this.game.math.degToRad(this.TURN_RATE)) {
            this.rotation = targetAngle;
        }
	}
}
