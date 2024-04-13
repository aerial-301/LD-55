import { getUnitVector, randF, removeFromArray, tCall } from '../utils'
import { gameScene } from './gameScene'
import { g } from './loadingScene'
import { damageMods } from './teams'
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

        this.team = team
        this.type = type
        this.team.units.push(this)

        this.png = type.png
        this.health = this.maxHealth = type.health
        this.damage = type.damage
        this.id = g.m.RND.uuid()

        this.hBar = gameScene.add
            .image(this.x, this.y - this.o.displayHeight - 4, team.bar)
            .setDepth(g.depths.ui)

        this.speed = this.type.moveSpeed

        this.o.setDepth(g.depths.actors + (0 | this.y))

        gameScene.tweens.add({
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
    }

    get x() {
        return this.o.x
    }
    get y() {
        return this.o.y
    }

    update() {
        this.o.setVelocity(0)
        this.hBar.setPosition(this.x, this.y - this.o.displayHeight - 4)
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
            .setDepth(g.depths.particles)
            .setTintFill(this.team.enemy.dmgColor)

        gameScene.tweens.add({
            targets: dmgNum,
            props: {
                x: this.x + randF(-20, 20),
                y: '-=20',
                scale: { from: 0.6, to: 1.5 },
            },
            duration: 500,
            onComplete() {
                dmgNum.destroy()
            },
        })

        if (this.health <= 0) this.die()
        else {
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
