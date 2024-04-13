import { png } from '../assets'
import { pickRandom, tCall } from '../utils'
import { g } from './loadingScene'
import { fadeIn, fadeOut } from './midScene'
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

    gameScene.add.image(0, 0, png.bg1).setOrigin(0)

    g.summoning = true
    g.battle = false

    gameScene.scene.launch(uiScene)
    new Unit(teams.other, units[pickRandom(Object.keys(units))])
    new Unit(teams.other, units[pickRandom(Object.keys(units))])
    new Unit(teams.other, units[pickRandom(Object.keys(units))])
}

gameScene.update = () => {
    // tCall(() => {
    //     if (teams.other.units.length < g.maxSummons) {
    //         new Unit(teams.other, units[pickRandom(Object.keys(units))])
    //     }
    // }, 200)
    if (g.summoning) {
    } else if (g.battle) {
        for (let o of teams.player.units) {
            o.update()
        }
        for (let o of teams.other.units) {
            o.update()
        }

        if (!teams.player.units.length) {
            defeat()
        } else if (!teams.other.units.length) {
            victory()
        }
    }
}

function endBattle() {
    for (let u of teams.player.units) u.o.setVelocity(0)
    for (let u of teams.other.units) u.o.setVelocity(0)
    g.battle = false
    const cover = uiScene.add
        .image(0, 0, '')
        .setAlpha(0)
        .setTintFill(g.pal.black)
        .setDisplaySize(g.w, g.h)
        .setOrigin(0)

    uiScene.tweens.add({
        targets: cover,
        props: {
            alpha: 0.3,
        },
        duration: 200,
    })
}

function victory() {
    endBattle()
    const text = uiScene.add
        .bitmapText(g.hw, -50, g.font, 'Victory!', g.fSize * 3)
        .setOrigin(0.5)
        .setTintFill(g.pal.white)

    uiScene.tweens.add({
        targets: text,
        props: {
            y: g.hh,
        },
        duration: 300,
        completeDelay: 1000,
        onComplete() {
            uiScene.tweens.add({
                targets: text,
                props: {
                    y: -50,
                },
                duration: 300,
                // completeDelay: 1000,
                onComplete() {
                    fadeOut(200, () => {
                        g.level += 1
                        gameScene.scene.restart()
                    })
                },
            })
        },
    })
}

function defeat() {
    endBattle()
    const text = uiScene.add
        .bitmapText(g.hw, g.hh, g.font, 'Defeat..', g.fSize * 3)
        .setTintFill(g.pal.red)
        .setScale(0)
        .setOrigin(0.5)

    uiScene.tweens.add({
        targets: text,
        props: {
            scale: { from: 0, to: 1 },
            alpha: { from: 0, to: 1 },
        },
        duration: 800,
        completeDelay: 1000,
        onComplete() {
            uiScene.tweens.add({
                targets: text,
                props: {
                    alpha: { from: 1, to: 0 },
                },
                duration: 800,
                // completeDelay: 1000,
                onComplete() {
                    fadeOut(200, () => {
                        // g.level += 1
                        gameScene.scene.restart()
                    })
                },
            })
        },
    })
}

function init() {
    mouse = gameScene.input.activePointer
    cam = gameScene.cameras.main

    gameScene.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
        gameScene.scene.stop(uiScene)
        teams.player.units = []
        teams.other.units = []
    })
}
