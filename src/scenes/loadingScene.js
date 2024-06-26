import { game } from '../../main'
import { fnt, nMaps, ogg, png, sheets, wav } from '../assets'
import { gameScene } from './gameScene'
import { fadeIn, fadeOut, midScene } from './midScene'

const pal = {
    black: 0x272736,
    white: 0xffffeb,
    red: 0xeb564b,
    blue: 0x4b5bab,
    yellow: 0xffe478,
    orange: 0xf2a65e,
    green: 0xcfff70,
    pink: 0xffb5b5,
}
const depths = {
    actors: 10,
    shots: 1000,
    particles: 1500,
    ui: 2000,
}

export const g = {
    sys: undefined,
    w: undefined,
    h: undefined,
    hw: undefined,
    hh: undefined,
    m: Phaser.Math,
    e: Phaser.Math.Easing,
    font: fnt.cozettevector,
    fSize: 13,
    tw: 16,
    depths,
    pal,
    maxSummons: 0,
    summoning: true,
    battle: false,
    enemyReady: false,
    level: 1,
    coins: 0,
    lives: 3,
    playerStuff: [],
}

export const loadingScene = new Phaser.Scene('loadingScene')

loadingScene.preload = () => {
    for (let i in fnt) {
        loadingScene.load.bitmapFont(i, `./${i}.png`, `./${i}.fnt`)
    }
}

loadingScene.create = () => {
    const scene = game.scene.systemScene
    g.w = scene.renderer.width
    g.hw = g.w / 2
    g.h = scene.renderer.height
    g.hh = g.h / 2
    g.sys = scene
    g.coins = 1

    addLoadUI()
    loadFiles()

    loadingScene.scene.launch(midScene)
    midScene.events.on(Phaser.Scenes.Events.CREATE, () => {
        fadeIn(512, () => {
            loadingScene.load.start()
        })
    })
}

function addLoadUI() {
    loadingScene.add
        .bitmapText(g.hw, g.hh - 40, g.font, 'Loading ..', g.fSize * 2)
        .setTintFill(0xffffff)
        .setOrigin(0.5)

    const bW = g.w * 0.7
    const bar = loadingScene.add.image(g.hw - bW / 2, g.hh + 20, '__WHITE')
    bar.setTintFill(0xffffff)
    bar.setOrigin(0, 0.5)
    bar.setScale(0, 1)
    bar.displayHeight = 16

    loadingScene.load.on('progress', value => {
        loadingScene.tweens.add({
            targets: bar,
            props: {
                displayWidth: bW * value,
            },
            duration: 512,
            ease: g.e.Sine.In,
        })
    })

    loadingScene.load.on(Phaser.Loader.Events.COMPLETE, () => {
        loadingScene.time.delayedCall(500, () => {
            fadeOut(512, () => {
                loadingScene.scene.start(gameScene)
            })
        })
    })
}

let nMap
function loadFiles() {
    for (let i in sheets) {
        if (nMaps[i]) {
            nMap = `./nMaps/${i}.png`
        } else nMap = undefined

        loadingScene.load.spritesheet({
            key: i,
            url: `./sheets/${i}.png`,
            normalMap: nMap,
            frameConfig: {
                frameWidth: sheets[i].width,
                frameHeight: sheets[i].height,
                spacing: sheets[i].spacing,
                margin: sheets[i].margin,
            },
        })
    }

    for (let i in png) loadingScene.load.image(i)
    for (let i in ogg) loadingScene.load.audio(i, `./${i}.ogg`)
    for (let i in wav) loadingScene.load.audio(i, `./${i}.wav`)
}
