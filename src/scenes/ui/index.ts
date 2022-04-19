import { Scene } from "phaser";
import { Text } from "../../classes/text";
import { Score, ScoreOperations } from "../../classes/score";
import { EVENTS_NAMES, GameStatus } from "../../consts";

export class UIScene extends Scene {
	private gameEndPhrase!: Text;
	private gameEndHandler: (status: GameStatus) => void;
	chestLootHandler: () => void;
	private score!: Score;
	constructor() {
		super("ui-scene");
		this.chestLootHandler = () => {
			this.score.changeValue(ScoreOperations.INCREASE, 10);
			if (this.score.getValue() >= 30) {
				this.game.events.emit(EVENTS_NAMES.gameEnd, GameStatus.WIN);
			}
		};

		this.gameEndHandler = (status) => {
			this.cameras.main.setBackgroundColor("rgba(0,0,0,0.6)");
			this.game.scene.pause("level-1-scene");
			this.gameEndPhrase = new Text(
				this,
				this.game.scale.width / 2,
				this.game.scale.height * 0.4,
				status === GameStatus.LOSE
					? `YOU LOSE!\nCLICK TO RESTART`
					: `YOU WON!\nCLICK TO RESTART`
			)
				.setAlign("center")
				.setColor(status === GameStatus.LOSE ? "#ff0000" : "#ffffff");
			
			this.gameEndPhrase.setPosition(
				this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
				this.game.scale.height * 0.4
			);

			this.input.on("pointerdown", () => {
				this.game.events.off(EVENTS_NAMES.chestLoot, this.chestLootHandler);
				this.game.events.off(EVENTS_NAMES.gameEnd, this.gameEndHandler);
				this.scene.get("level-1-scene").scene.restart();
				this.scene.restart();
			});
		};
	}
	create(): void {
		this.score = new Score(this, 20, 20, 0);
		this.initListeners();
	}

	private initListeners(): void {
		this.game.events.on(EVENTS_NAMES.chestLoot, this.chestLootHandler, this);
		this.game.events.once(EVENTS_NAMES.gameEnd, this.gameEndHandler, this);
	}
}
