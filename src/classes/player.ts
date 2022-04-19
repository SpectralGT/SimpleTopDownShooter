import { EVENTS_NAMES, GameStatus } from "../consts";
import { Actor } from "./actor";
import { Bullet } from "./bullet";
import { Text } from "./text";
export class Player extends Actor {
	private keyW: Phaser.Input.Keyboard.Key;
	private keyA: Phaser.Input.Keyboard.Key;
	private keyS: Phaser.Input.Keyboard.Key;
	private keyD: Phaser.Input.Keyboard.Key;
	private keyShift: Phaser.Input.Keyboard.Key;
	private keySpace: Phaser.Input.Keyboard.Key;
	private hpValue: Text;
	gun: Phaser.Physics.Arcade.Group;
	private gunRot: number;
	private gunCoolDownTime: number;
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "king");
		// KEYS
		this.keyW = this.scene.input.keyboard.addKey("W");
		this.keyA = this.scene.input.keyboard.addKey("A");
		this.keyS = this.scene.input.keyboard.addKey("S");
		this.keyD = this.scene.input.keyboard.addKey("D");
		this.keyShift = this.scene.input.keyboard.addKey("Shift");
		this.keySpace = this.scene.input.keyboard.addKey(32);

		this.keySpace.on("down", (event: KeyboardEvent) => {
			this.scene.cameras.main.shake(100, 0.001);
			this.anims.play("attack", true);
			this.scene.game.events.emit(EVENTS_NAMES.attack);
		});
		// PHYSICS
		this.getBody().setSize(30, 30);
		this.getBody().setOffset(8, 0);

		this.hpValue = new Text(
			this.scene,
			this.x,
			this.y - this.height,
			this.hp.toString()
		)
			.setFontSize(12)
			.setOrigin(0.8, 0.5);

		this.initAnimations();

		this.on("destroy", () => {
			this.keySpace.removeAllListeners();
		});

		this.gun = this.scene.physics.add.group({
			classType: Bullet,
			runChildUpdate: true,
		});
		this.gunCoolDownTime = 0;
		this.gunRot = 0;
	}

	private initAnimations(): void {
		this.scene.anims.create({
			key: "run",
			frames: this.scene.anims.generateFrameNames("a-king", {
				prefix: "run-",
				end: 7,
			}),
			frameRate: 8,
		});
		this.scene.anims.create({
			key: "attack",
			frames: this.scene.anims.generateFrameNames("a-king", {
				prefix: "attack-",
				end: 2,
			}),
			frameRate: 8,
		});
	}

	update(deltaTime: number): void {
		this.getBody().setVelocity(0);

		if (this.keyW?.isDown) {
			this.body.velocity.y = -110;
			this.anims.play("run", true);
		}
		if (this.keyA?.isDown) {
			this.body.velocity.x = -110;
			this.checkFlip();
			this.getBody().setOffset(48, 15);
			this.anims.play("run", true);
		}
		if (this.keyS?.isDown) {
			this.body.velocity.y = 110;
			this.anims.play("run", true);
		}
		if (this.keyD?.isDown) {
			this.body.velocity.x = 110;
			this.checkFlip();
			this.getBody().setOffset(15, 15);
			this.anims.play("run", true);
		}

		if (this.keyShift?.isDown) {
			this.body.velocity.multiply(new Phaser.Math.Vector2(2, 2));
		}

		this.gunRot = Phaser.Math.Angle.Between(
			this.x,
			this.y,
			this.scene.game.input.mousePointer.x + this.scene.cameras.main.scrollX,
			this.scene.game.input.mousePointer.y + this.scene.cameras.main.scrollY
		);
		this.gunCoolDownTime -= deltaTime;
		if (
			this.scene.input.activePointer.leftButtonDown() &&
			this.gunCoolDownTime <= 0
		) {
			const bullet = this.gun.get();
			bullet.fire(this, this.gunRot);
			this.scene.cameras.main.shake(100, 0.001);
			this.gunCoolDownTime = 200;
		}

		this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
		this.hpValue.setOrigin(0.8, 0.5);
	}

	public getDamage(value?: number): void {
		super.getDamage(value);
		this.hpValue.setText(this.hp.toString());
		if (this.hp <= 0) {
			this.scene.game.events.emit(EVENTS_NAMES.gameEnd, GameStatus.LOSE);
		}
	}
}
