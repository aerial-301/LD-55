import { g } from './loadingScene'
import { fadeIn } from './midScene'
import { uiScene } from './uiScene'
export const gameScene = new Phaser.Scene('gameScene')

/** @type {Phaser.Input.Pointer} */
let mouse
/** @type {Phaser.Cameras.Scene2D.Camera} */
let cam

gameScene.create = function () {
    init()
    fadeIn(512)

    gameScene.add
        .bitmapText(g.hw, g.hh, g.font, 'Game Scene', g.fSize * 1)
        .setOrigin(0.5)



        

    gameScene.scene.launch(uiScene)
}

gameScene.update = () => {}

function init() {
    mouse = gameScene.input.activePointer
    cam = gameScene.cameras.main

    gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        gameScene.scene.stop(uiScene)
    })
}
