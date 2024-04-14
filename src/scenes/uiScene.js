import { ogg, png } from '../assets'
import { randF } from '../utils'
import { initialStuff } from './gameScene'
import { g } from './loadingScene'
import { debug_addFullScreenButton } from './midScene'
import { teams, units } from './teams'
import { Unit } from './unit'
export const uiScene = new Phaser.Scene('uiScene')

let battleB
let btn1, btn2, btn3
let resetBtn

export const ui = {
    coins: undefined,
    score: undefined,
    playerSummons: undefined,
    enemySummons: undefined,
    lives: [],
}

/** @type {Phaser.GameObjects.Image} */
let howImage

uiScene.create = () => {
    debug_addFullScreenButton(uiScene)
    ui.lives = []

    howImage = uiScene.add
        .image(g.hw, g.hh, png.howImage)
        // .setOrigin(0)
        .setDepth(9999)
        .setInteractive()
        .setVisible(false)

    const how = uiScene.add.image(g.w - 8, 8, png.how).setOrigin(1, 0)
    how.setInteractive()
        .on('pointerover', hover)
        .on('pointerout', out)
        .on('pointerdown', () => {
            howImage.visible = !howImage.visible
        })

    for (let i = 0; i < g.lives; i++) {
        const l = uiScene.add.image(16 + i * 20, 16, png.life)
        ui.lives.push(l)
    }

    ui.playerSummons = uiScene.add
        .bitmapText(8, g.h - 20, g.font)
        .setOrigin(0, 1)

    ui.coins = uiScene.add
        .bitmapText(8, g.h - 8, g.font, '', g.fSize * 1)
        .setOrigin(0, 1)
    ui.score = uiScene.add
        .bitmapText(g.w - 8, g.h - 10, g.font, '', g.fSize * 2)
        .setOrigin(1)

    const btnY = 22
    btn1 = addSummonButton(g.hw, btnY, units.sword)
    btn2 = addSummonButton(g.hw, btnY * 3, units.pike)
    btn3 = addSummonButton(g.hw, btnY * 5, units.musk)

    battleB = uiScene.add
        .image(g.hw + 20, g.h - 4, png.battleBtn)
        .setOrigin(0.5, 1)
        .setOrigin(0.5, 1)
        .setInteractive()
        .on('pointerover', hover)
        .on('pointerout', out)
        .on('pointerdown', startBattle)

    resetBtn = uiScene.add
        .image(battleB.x - 90, g.h - 4, png.resetBtn)
        .setOrigin(0.5, 1)
        .setInteractive()
        .on('pointerover', hover)
        .on('pointerout', out)
        .on('pointerdown', () => {
            if (!g.summoning) {
                cantClick()
                return
            }
            click()
            g.coins = initialStuff.coins
            while (teams.player.units.length > 0) {
                teams.player.units[0].die()
            }
            for (let o of g.playerStuff) {
                new Unit(teams.player, o.type)
            }
        })
}

/** @param {import('../typeDefs').UnitType} type */
function addSummonButton(x, y, type) {
    const button = uiScene.add.renderTexture(x, y, 40, 40)
    button.draw(png.s1)
    button
        .draw(type.png.player, 4, 4)
        .setInteractive()
        .on('pointerdown', () => {
            summon(type)
        })
        .on('pointerover', hover)
        .on('pointerout', out)

    return button
}

/** @param {import('../typeDefs').UnitType} type */
function summon(type) {
    if (
        !g.summoning ||
        teams.player.units.length >= g.maxSummons ||
        g.coins < 2
    ) {
        cantClick()
        return
    }
    click()
    g.coins -= 2
    new Unit(teams.player, type)
}

// function sell(target) {
//     target.inst.die()
//     g.coins += 1
// }

export function click() {
    uiScene.sound.play(ogg.click, { detune: randF(0, 50) })
}

export function cantClick() {
    uiScene.sound.play(ogg.cantClick, { detune: randF(0, 50) })
}

function startBattle() {
    if (teams.player.units.length === 0 || !g.enemyReady || !g.summoning) {
        cantClick()
        return
    }
    click()
    g.summoning = false
    g.playerStuff = [...teams.player.units]

    uiScene.tweens.add({
        targets: battleB,
        props: {
            scale: 0.8,
        },
        duration: 100,
        ease: g.e.Sine.In,
        yoyo: true,
        onComplete() {
            uiScene.tweens.addCounter({
                from: 1,
                to: 0,
                duration: 200,
                ease: g.e.Sine.In,
                onUpdate(e) {
                    for (let o of [battleB, btn1, btn2, btn3, resetBtn]) {
                        o.setAlpha(e.getValue())
                    }
                },
            })
            g.battle = true
        },
    })
}

uiScene.update = () => {
    ui.score.text = teams.player.score
    ui.playerSummons.text = `Units: ${teams.player.units.length}/${g.maxSummons}`
    ui.coins.text = `Cash: $${g.coins}`

    ui.score.text = `Lvl ${g.level}`

    // ui.enemyScore.text = teams.other.score
    // ui.enemySummons.text = `${teams.other.units.length}/${g.maxSummons}`
}

const OVER_TINT = 0xaaaaaa
/** @this {Phaser.GameObjects.Image} */
function hover() {
    uiScene.sound.play(ogg.hover, { detune: randF(0, 200) })
    this.setTint(OVER_TINT)
}
/** @this {Phaser.GameObjects.Image} */
function out() {
    this.clearTint()
}
