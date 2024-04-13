import { Unit } from './unit'
import { teams, units } from './teams'
import { g } from './loadingScene'
import { debug_addFullScreenButton } from './midScene'
export const uiScene = new Phaser.Scene('uiScene')

export const statsUI = {
    playerScore: undefined,
    playerSummons: undefined,
    enemyScore: undefined,
    enemySummons: undefined,
}

uiScene.create = () => {
    debug_addFullScreenButton(uiScene)

    statsUI.playerScore = uiScene.add
        .bitmapText(8, g.h - 8, g.font)
        .setOrigin(0, 1)

    statsUI.playerSummons = uiScene.add
        .bitmapText(8, g.h - 20, g.font)
        .setOrigin(0, 1)

    statsUI.enemyScore = uiScene.add
        .bitmapText(g.w - 8, g.h - 8, g.font)
        .setOrigin(1)

    statsUI.enemySummons = uiScene.add
        .bitmapText(g.w - 8, g.h - 20, g.font, '', g.fSize)
        .setOrigin(1)

    const b1 = uiScene.add
        .bitmapText(20, 10, g.font, '1')
        .setInteractive()
        .on('pointerdown', () => {
            summon1()
        })
    const b2 = uiScene.add
        .bitmapText(40, 10, g.font, '2')
        .setInteractive()
        .on('pointerdown', () => {
            summon2()
        })
    const b3 = uiScene.add
        .bitmapText(60, 10, g.font, '3')
        .setInteractive()
        .on('pointerdown', () => {
            summon3()
        })

    uiScene.input.keyboard.on('keydown-ONE', () => {
        summon1()
    })
    uiScene.input.keyboard.on('keydown-TWO', () => {
        summon2()
    })
    uiScene.input.keyboard.on('keydown-THREE', () => {
        summon3()
    })
}

function summon1() {
    if (teams.player.units.length >= g.maxSummons) return
    new Unit(teams.player, units.sword)
}
function summon2() {
    if (teams.player.units.length >= g.maxSummons) return
    new Unit(teams.player, units.pike)
}
function summon3() {
    if (teams.player.units.length >= g.maxSummons) return
    new Unit(teams.player, units.musketeer)
}

uiScene.update = () => {
    statsUI.playerScore.text = teams.player.score
    statsUI.playerSummons.text = `${teams.player.units.length}/${g.maxSummons}`
    statsUI.enemyScore.text = teams.other.score
    statsUI.enemySummons.text = `${teams.other.units.length}/${g.maxSummons}`
}
