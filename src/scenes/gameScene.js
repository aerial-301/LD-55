import { pickRandom, tCall } from '../utils'
import { g } from './loadingScene'
import { fadeIn } from './midScene'
import { teams, units } from './teams'
import { uiScene } from './uiScene'
import { Unit } from './unit'
export const gameScene = new Phaser.Scene('gameScene')

/** @type {Phaser.Input.Pointer} */
let mouse
/** @type {Phaser.Cameras.Scene2D.Camera} */
let cam

gameScene.create = function () {
    init()
    fadeIn(1)

    gameScene.scene.launch(uiScene)
}

gameScene.update = () => {
    tCall(() => {
        if (teams.other.units.length < g.maxSummons) {
            new Unit(teams.other, units[pickRandom(Object.keys(units))])
        }
    }, 200)

    for (let o of teams.player.units) {
        o.update()
    }
    for (let o of teams.other.units) {
        o.update()
    }
}

function init() {
    mouse = gameScene.input.activePointer
    cam = gameScene.cameras.main

    gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        gameScene.scene.stop(uiScene)
    })
}
