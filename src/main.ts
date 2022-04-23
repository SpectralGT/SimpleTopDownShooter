import { Game,Types } from 'phaser';
import { Level1,LoadingScene } from './scenes';
import { UIScene } from './scenes/ui';

const gameConfig: Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height:window.innerWidth* (8/16),
	pixelArt: true,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false
		}
	},
	
	scene:[LoadingScene,Level1,UIScene]
}

window.game = new Game(gameConfig);
