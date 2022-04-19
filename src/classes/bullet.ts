export class Bullet extends Phaser.Physics.Arcade.Sprite{
    private bulletSpeed: number;
    private timeTillBorn: number;
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'tiles_spr',50);
        this.timeTillBorn = 0;
        this.bulletSpeed = 200;
    }

    fire(shooter : Phaser.GameObjects.Sprite,gunRot:number): void{
        this.setRotation(gunRot);
        this.x = shooter.x + (50 * Math.cos(this.rotation));
        this.y = shooter.y + (50 * Math.sin(this.rotation));

        this.setVelocityX(this.bulletSpeed * Math.cos(Math.PI * this.angle / 180));
        this.setVelocityY(this.bulletSpeed * Math.sin(Math.PI * this.angle / 180));
        this.timeTillBorn = 0;
        this.setBounce(1, 1);
    }
    update(delta:number):void {
        this.setRotation(this.body.velocity.angle());
        this.timeTillBorn += delta;
        if (this.timeTillBorn > 10e6) {
            this.destroy();
        }
    }
}