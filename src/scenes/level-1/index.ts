import { GameObjects, Physics, Scene, Tilemaps } from "phaser";
import { Enemy } from "../../classes/enemy";
import { Player } from "../../classes/player";
import { EVENTS_NAMES } from "../../consts";
import {gameObjectsToObjectPoints} from "../../helpers/gameobject -to-object-point";
export class Level1 extends Scene {

	private king!: GameObjects.Sprite;
	private player!: Player;
	private map!: Tilemaps.Tilemap;
	private tileset!: Tilemaps.Tileset;
	private wallsLayer!: Tilemaps.TilemapLayer;
	private groundLayer!: Tilemaps.TilemapLayer;
	private chests!: Phaser.GameObjects.Sprite[];
	private enemies!: Phaser.GameObjects.Sprite[];
	private particleEmitter!:Phaser.GameObjects.Particles.ParticleEmitter;

	constructor() {
		super("level-1-scene");

	}

	private initMap(): void {
		this.map = this.make.tilemap({
			key: "dungeon",
			tileHeight: 16,
			tileWidth: 16,
		});
		this.tileset = this.map.addTilesetImage("dungeon", "tiles");
		this.groundLayer = this.map.createLayer("Ground", this.tileset, 0, 0);
		this.wallsLayer = this.map.createLayer("Walls", this.tileset, 0, 0);
		this.physics.world.setBounds(
			0,
			0,
			this.wallsLayer.width,
			this.wallsLayer.height
		);
		this.wallsLayer.setCollisionByProperty({ collides: true });
	}


	private initChests(): void {
		const chestPoints = gameObjectsToObjectPoints(
			this.map.filterObjects("Chests", (obj) => obj.name === "ChestPoint")
		);
		this.chests = chestPoints.map((chestPoint) =>
			this.physics.add
				.sprite(chestPoint.x, chestPoint.y, "tiles_spr", 595)
				.setScale(1.5)
		);
		this.chests.forEach((chest) => {
			this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
				this.game.events.emit(EVENTS_NAMES.chestLoot);
				obj2.destroy();
				this.cameras.main.flash();
			});
		});
	}

	initCamera(): void{
		this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
		this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
		this.cameras.main.setZoom(2);
	}
	initEnemy(): void{
		const enemiesPoints = gameObjectsToObjectPoints(
			this.map.filterObjects("Enemies", (obj) => obj.name === "EnemyPoint")
		);
		this.enemies = enemiesPoints.map((enemyPoint) =>
			new Enemy(this, enemyPoint.x, enemyPoint.y, "tiles_spr", this.player, 503)
				.setName(enemyPoint.id.toString())
				.setScale(1.5)
		);
		this.physics.add.collider(this.enemies, this.wallsLayer);
		this.physics.add.collider(this.enemies, this.enemies);
		this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
			(obj1 as Player).getDamage(0.1);
		});

		this.physics.add.collider(this.player.gun, this.enemies, (obj1, obj2) => {
			(obj1 as Enemy).getDamage(10);
			if ((obj1 as Enemy).getHPValue() <= 0) {
				this.cameras.main.shake(100, 0.01);
				(obj1 as Enemy).setHPValue(100);
				this.particleEmitter.explode(20, (obj1 as Enemy).x, (obj1 as Enemy).y);
				this.game.events.emit(EVENTS_NAMES.chestLoot);
				(obj1 as Enemy).setRandomPosition(5,5, 400, 400);
			}
			obj2.destroy();
		})
	}
	create(): void {
		this.initMap();
		this.particleEmitter = this.add.particles("bloodParticle").createEmitter({
			x: 400,
			y: 300,
			speed: { min: -800, max: 800 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.3, end: 0 },
			blendMode: "SCREEN",
			//active: false,
			lifespan: 300,
			gravityY: 800,
		});
		this.particleEmitter.explode(0, 0, 0);
		this.player = new Player(this, 100, 100);
		this.physics.add.collider(this.player, this.wallsLayer);
		this.physics.add.collider(this.player.gun, this.wallsLayer, (obj1, obj2) => {
			obj1.destroy();
		})
		this.initChests();
		this.initCamera();
		this.initEnemy();
	}

	update(time:number,delta:number): void {
		this.player.update(delta);
	}
}
