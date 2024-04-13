import { png } from '../assets'
import {
    getUnitVector,
    pickRandom,
    removeFromArray,
    throttledCall,
} from '../utils'
import { g } from './loadingScene'
import { fadeIn } from './midScene'
import { uiScene } from './uiScene'
export const gameScene = new Phaser.Scene('gameScene')

/** @type {Phaser.Input.Pointer} */
let mouse
/** @type {Phaser.Cameras.Scene2D.Camera} */
let cam

const teams = {
    player: {
        x: 30,
        get y() {
            return g.hh
        },
        units: [],
        get enemies() {
            return teams.enemy.units
        },
    },
    enemy: {
        get x() {
            return g.w - 30
        },
        get y() {
            return g.hh
        },
        units: [],
        get enemies() {
            return teams.player.units
        },
    },
}

const units = {
    sword: {
        name: 'sword',
        png: png.sword,
        health: 100,
        damage: 25,
        range: 32,
    },
    pike: {
        name: 'pike',
        png: png.pike,
        health: 100,
        damage: 25,
        range: 32,
    },
    musketeer: {
        name: 'musketeer',
        png: png.musk,
        health: 100,
        damage: 25,
        range: 32 * 5,
    },
}

const damageMods = {
    [png.sword]: {
        [png.pike]: 1.5,
        [png.musk]: 1,
        [png.sword]: 1,
    },
    [png.pike]: {
        [png.pike]: 1,
        [png.sword]: 1,
        [png.musk]: 1.9,
    },
    [png.musk]: {
        [png.sword]: 1.3,
        [png.pike]: 0.35,
        [png.musk]: 1,
    },
}

gameScene.create = function () {
    init()
    fadeIn(1)

    gameScene.scene.launch(uiScene)
}

gameScene.update = () => {
    throttledCall(() => {
        if (teams.player.units.length < 3) {
            new Unit(teams.player, units[pickRandom(Object.keys(units))])
            // console.log('player: ', teams.enemy.units)
        }

        if (teams.enemy.units.length < 3) {
            new Unit(teams.enemy, units[pickRandom(Object.keys(units))])
            // console.log('enemy: ', teams.player.units)
        }
    }, 1000)

    for (let o of teams.player.units) {
        o.update()
    }
    for (let o of teams.enemy.units) {
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

class Unit {
    constructor(team, type) {
        // console.log(team)
        this.o = gameScene.physics.add.image(team.x, team.y, type.png)
        this.team = team
        this.type = type
        this.team.units.push(this)

        this.png = type.png
        this.health = type.health
        this.damage = type.damage
        this.id = g.m.RND.uuid()

        this.speed = 100
    }

    update() {
        this.o.setVelocity(0)
        if (!this.team.enemies.length) return
        let min = 99999
        let target
        for (let e of this.team.enemies) {
            const d = g.m.Distance.BetweenPointsSquared(this.o, e.o)
            if (d < min) {
                min = d
                target = e
            }
        }

        const distToTarget = g.m.Distance.BetweenPoints(this.o, target.o)

        if (distToTarget > this.type.range) {
            this.move(target)
        } else {
            throttledCall(() => {
                this.attack(target)
            }, 500, this.id)
        }
    }

    attack(target) {
        const mod = damageMods[this.png][target.png]
        if (!mod) {
            console.log(this.png)
            console.log(target.png)
            throw 'e'
        }
        target.getDamaged(this.damage * damageMods[this.png][target.png])
    }

    getDamaged(amount) {
        this.health -= amount
        if (this.health <= 0) this.die()
    }

    move(target) {
        const uv = getUnitVector(this.o, target.o)
        this.o.setVelocity(this.speed * uv.x, this.speed * uv.y)
    }

    die() {
        this.o.destroy()
        removeFromArray(this, this.team.units)
    }
}
