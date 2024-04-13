import 'phaser'
import { gameScene } from './src/scenes/gameScene'
import { loadingScene } from './src/scenes/loadingScene'
import { midScene } from './src/scenes/midScene'
import { uiScene } from './src/scenes/uiScene'
const parent = 'main'
export const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 320,
    height: 180,
    parent: parent,
    fullscreenTarget: parent,
    backgroundColor: '#111',
    disableContextMenu: true,
    pixelArt: true,
    physics: {
        default: 'arcade',
    },
    dom: {
        createContainer: true,
    },
    input: {
        mouse: {
            preventDefaultDown: true,
        },
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        autoRound: true,
        min: {
            width: 320,
            height: 180,
        },
        max: {
            width: 1280,
            height: 720,
        },
    },
    scene: [loadingScene, gameScene, uiScene, midScene],
})
