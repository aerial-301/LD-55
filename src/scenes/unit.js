import { ogg, png } from '../assets'
import { getUnitVector, randF, removeFromArray, tCall } from '../utils'
import { gameScene } from './gameScene'
import { g } from './loadingScene'
import { damageMods, teams } from './teams'
import { uiScene } from './uiScene'

export class Unit {
    /**
     *
     * @param {import('../typeDefs').Team} team
     * @param {import('../typeDefs').UnitType} type
     */
    constructor(team, type) {
        // console.log(team)
        this.o = gameScene.physics.add
            .image(team.x, team.y + randF(-50, 50), type.png[team.name])
            .setOrigin(0.5, 1)
            .setAlpha(0)

        if (team.name === teams.player.name) {
            this.o.setInteractive()
            this.o.on('pointerdown', () => {
                if (!g.summoning) return
                this.die()
                g.coins += 1
                gameScene.sound.play(ogg.sell, { detune: randF(0, 100) })
            })
        }

        this.team = team
        this.type = type

        this.png = type.png
        this.health = this.maxHealth = type.health
        this.damage = type.damage
        this.id = g.m.RND.uuid()

        this.speed = this.type.moveSpeed
        this.o.setDepth(g.depths.actors + (0 | this.y))

        this.team.units.push(this)

        const w = 3

        let x, y
        if (this.team.name === teams.other.name) {
            for (let i = 0; i < this.team.units.length; i++) {
                x = g.w - 15 - 40 * (0 | (i / w))
                y = g.h - 40 - 40 * (i % w)
                this.team.units[i].o.setPosition(x, y)
            }
        } else {
            for (let i = 0; i < this.team.units.length; i++) {
                x = 15 + 40 * (0 | (i / w))
                y = g.h - 40 - 40 * (i % w)
                this.team.units[i].o.setPosition(x, y)
            }
        }

        this.hBar = gameScene.add
            .image(this.x, this.hBarY, team.bar)
            .setDepth(g.depths.ui)

        gameScene.tweens
            .add({
                targets: this.o,
                props: {
                    scaleX: { from: 1.3, to: 1 },
                    scaleY: { from: 0.8, to: 1 },
                },
                duration: 300,
                ease: g.e.Sine.Out,
                yoyo: true,
                repeat: -1,
            })
            .seek(randF(0, 2000))

        const circle = gameScene.add.image(
            this.x,
            this.y - this.o.displayHeight / 2,
            png.circle
        )
        circle.setTintFill(team.dmgColor)
        gameScene.tweens.add({
            targets: circle,
            props: {
                scale: { from: 1, to: 0 },
            },
            duration: 500,
            ease: g.e.Sine.In,
            onComplete() {
                circle.destroy()
            },
        })

        gameScene.sound.play(ogg.summon, { detune: randF(0, 200) })
        gameScene.tweens.addCounter({
            from: 0,
            to: 1,
            onUpdate: e => {
                this.o.setAlpha(e.getValue())
            },
            ease: g.e.Sine.In,
        })
    }

    get x() {
        return this.o.x
    }
    get y() {
        return this.o.y
    }

    get hBarY() {
        return this.y - this.o.displayHeight
    }

    update() {
        this.o.setVelocity(0)
        this.hBar.setPosition(this.x, this.hBarY)
        if (!this.team.enemy.units.length) return
        let min = 99999
        /** @type {Unit} */
        let target
        for (let e of this.team.enemy.units) {
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
            tCall(
                () => this.attack(target),
                (500 * 1) / this.type.fireRate,
                this.id
            )
        }
    }

    /**
     * @param {Unit} target
     */
    attack(target) {
        const mod = damageMods[this.type.name][target.type.name]
        if (!mod) {
            console.log(this.png)
            console.log(target.png)
            throw 'e'
        }
        target.getDamaged(this.damage * mod)
    }

    getDamaged(amount) {
        amount = Math.ceil(amount)
        this.health -= amount

        const dmgNum = gameScene.add
            .bitmapText(this.x, this.y - 30, g.font, amount)
            .setDepth(g.depths.ui + 100)
            .setTintFill(this.team.enemy.dmgColor)

        gameScene.tweens.add({
            targets: dmgNum,
            props: {
                x: this.x + randF(-20, 20),
                y: '-=20',
                scale: { from: 0.6, to: 1.5 },
            },
            duration: 300,
            ease: g.e.Sine.Out,
            onComplete() {
                dmgNum.destroy()
            },
        })

        if (this.health <= 0) {
            gameScene.sound.play(ogg.boom, { detune: randF(-100, 100) })
            this.team.parts.explode(50, this.x, this.y)
            this.die()
        } else {
            gameScene.sound.play(ogg.hit, {
                detune: randF(-100, 100),
                volume: 0.7,
            })
            this.updateUI()
            this.o.setTintFill(g.pal.white)

            gameScene.tweens.add({
                targets: this.o,
                props: {
                    angle: { from: -10, to: 10 },
                },
                duration: 90,
                ease: g.e.Sine.In,
                // yoyo: true,
                onComplete: () => {
                    this.o.setAngle(0)
                },
            })
            uiScene.time.delayedCall(100, () => {
                this.o.clearTint()
            })
        }
    }

    updateUI() {
        const newWidth = (this.health / this.maxHealth) * this.hBar.displayWidth
        this.hBar.setCrop(0, 0, newWidth, 4)
    }

    move(target) {
        const uv = getUnitVector(this.o, target.o)
        this.o.setVelocity(this.speed * uv.x, this.speed * uv.y)
        this.o.setDepth(g.depths.actors + (0 | this.y))
        // console.log(this.o.depth)
    }

    die() {
        this.o.destroy()
        this.hBar.destroy()
        removeFromArray(this, this.team.units)
        this.team.enemy.score += 1
    }
}
