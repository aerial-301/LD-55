import { g } from './loadingScene'
import { debug_addFullScreenButton } from './midScene'
import { teams, units } from './teams'
import { Unit } from './unit'
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
            summon(units.sword)
        })
    const b2 = uiScene.add
        .bitmapText(40, 10, g.font, '2')
        .setInteractive()
        .on('pointerdown', () => {
            summon(units.pike)
        })
    const b3 = uiScene.add
        .bitmapText(60, 10, g.font, '3')
        .setInteractive()
        .on('pointerdown', () => {
            summon(units.musk)
        })

    uiScene.input.keyboard.on('keydown-ONE', () => {
        summon(units.sword)
    })
    uiScene.input.keyboard.on('keydown-TWO', () => {
        summon(units.pike)
    })
    uiScene.input.keyboard.on('keydown-THREE', () => {
        summon(units.musk)
    })

    uiScene.input.keyboard.on('keydown-B', () => {
        if (g.summoning) {
            g.summoning = false
            g.battle = true
        }
    })
}

/** @param {import('../typeDefs').UnitType} type */
function summon(type) {
    if (!g.summoning) return
    if (teams.player.units.length >= g.maxSummons) return
    new Unit(teams.player, type)
}

uiScene.update = () => {
    statsUI.playerScore.text = teams.player.score
    statsUI.playerSummons.text = `${teams.player.units.length}/${g.maxSummons}`
    statsUI.enemyScore.text = teams.other.score
    statsUI.enemySummons.text = `${teams.other.units.length}/${g.maxSummons}`
}
