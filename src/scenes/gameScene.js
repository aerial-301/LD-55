import { ogg, png } from '../assets'
import { pickRandom, randI, tCall } from '../utils'
import { g } from './loadingScene'
import { fadeIn, fadeOut } from './midScene'
import { teams, units } from './teams'
import { ui, uiScene } from './uiScene'
import { Unit } from './unit'
export const gameScene = new Phaser.Scene('gameScene')

/** @type {Phaser.Input.Pointer} */
let mouse
/** @type {Phaser.Cameras.Scene2D.Camera} */
let cam

/** @type {Phaser.GameObjects.Particles.ParticleEmitter} */
export let partsPurple

/** @type {Phaser.GameObjects.Particles.ParticleEmitter} */
export let partsGreen

/** @type {Phaser.GameObjects.Particles.ParticleEmitter} */
export let parts

gameScene.create = function () {
    init()
    fadeIn(512)
    gameScene.add.image(0, 0, png['bg' + randI(1, 3)]).setOrigin(0)

    parts = gameScene.add
        .particles(0, 0, '__WHITE', {
            frequency: -1,
            speed: 80,
            rotate: { start: 0, end: 1359 },
            scale: { start: 6, end: 0 },
            color: [g.pal.pink],
        })
        .setDepth(g.depths.particles)

    partsPurple = gameScene.add
        .particles(0, 0, '__WHITE', {
            frequency: -1,
            speed: 80,
            rotate: { start: 0, end: 1359 },
            scale: { start: 6, end: 0 },
            color: [g.pal.pink],
        })
        .setDepth(g.depths.particles)

    partsGreen = gameScene.add
        .particles(0, 0, '__WHITE', {
            frequency: -1,
            speed: 80,
            rotate: { start: 0, end: 1359 },
            scale: { start: 6, end: 0 },
            color: [g.pal.green],
        })
        .setDepth(g.depths.particles)

    gameScene.sound.play(ogg.start)

    g.enemyReady = false
    g.maxSummons += 1
    g.coins += 2
    initialStuff.coins = g.coins

    // console.log(g.coins)

    g.summoning = true
    g.battle = false

    gameScene.scene.launch(uiScene)

    const delay = 200

    // console.log(g.playerStuff)

    for (let i = 0; i < g.playerStuff.length; i++) {
        const unit = g.playerStuff[i]

        gameScene.time.delayedCall(50 * i, () => {
            new Unit(teams.player, unit.type)
        })
    }

    for (let i = 0; i < g.maxSummons; i++) {
        gameScene.time.delayedCall(delay * i, () => {
            new Unit(teams.other, units[pickRandom(Object.keys(units))])
        })
    }

    gameScene.time.delayedCall(delay * g.maxSummons, () => {
        // console.log('ready')
        g.enemyReady = true
    })

    // initialStuff.units = [...teams.player.units]
}

export let initialStuff = {
    coins: 0,
    units: [],
}

gameScene.update = () => {
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
    gameScene.sound.play(ogg.win)
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
        ease: g.e.Sine.Out,
        duration: 500,
        completeDelay: 1000,
        onComplete() {
            uiScene.tweens.add({
                targets: text,
                props: {
                    y: -50,
                },
                duration: 500,
                ease: g.e.Sine.In,
                // completeDelay: 1000,
                onComplete() {
                    if (g.level >= 9) {
                        const win = uiScene.add
                            .bitmapText(
                                g.hw,
                                g.hh,
                                g.font,
                                'Thanks For Playing!',
                                g.fSize * 2
                            )
                            .setOrigin(0.5)
                            .setScale(0)

                        uiScene.tweens.add({
                            targets: win,
                            props: {
                                scale: 1,
                            },
                        })

                        uiScene.tweens.add({
                            targets: win,
                            props: {
                                angle: { from: 10, to: -10 },
                            },
                            repeat: -1,
                            yoyo: true,
                            duration: 1500,
                            ease: g.e.Sine.InOut,
                        })
                    } else {
                        fadeOut(200, () => {
                            g.level += 1
                            gameScene.scene.restart()
                        })
                    }
                },
            })
        },
    })
}

function defeat() {
    g.lives -= 1

    const one = ui.lives.pop()
    uiScene.tweens.add({
        targets: one,
        props: {
            alpha: 0,
            scale: 5,
        },
        ease: g.e.Sine.In,
        duration: 900,
    })

    gameScene.sound.play(ogg.lose)
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
        ease: g.e.Sine.In,
        completeDelay: 1000,
        onComplete() {
            uiScene.tweens.add({
                targets: text,
                props: {
                    alpha: { from: 1, to: 0 },
                },
                duration: 800,
                ease: g.e.Sine.In,
                onComplete() {
                    if (g.lives === 0) {
                        const go = uiScene.add
                            .bitmapText(
                                g.hw,
                                g.hh,
                                g.font,
                                'GAME OVER',
                                g.fSize * 3
                            )
                            .setOrigin(0.5)
                            .setScale(0)
                            .setTintFill(g.pal.red)

                        uiScene.tweens.add({
                            targets: go,
                            props: {
                                scale: 1,
                            },
                            ease: g.e.Sine.In,
                        })
                    } else {
                        fadeOut(200, () => {
                            gameScene.scene.restart()
                        })
                    }
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
