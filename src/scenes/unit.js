import { getUnitVector, randF, removeFromArray, tCall } from '../utils'
import { g } from './loadingScene'
import { damageMods, teams } from './teams'
import { gameScene } from './gameScene'
import { png } from '../assets'

export class Unit {
    /**
     *
     * @param {import('../typeDefs').Team} team
     * @param {import('../typeDefs').UnitType} type
     */
    constructor(team, type) {
        // console.log(team)
        this.o = gameScene.physics.add
            .image(team.x, team.y + randF(-50, 50), type.png)
            // .setAlpha(0.3)
            .setOrigin(0.5, 1)

        if (team === teams.other) {
            this.o.setTint(0xffaaaa)
        }

        this.team = team
        this.type = type
        this.team.units.push(this)

        this.png = type.png
        this.health = this.maxHealth = type.health
        this.damage = type.damage
        this.id = g.m.RND.uuid()

        this.hBar = gameScene.add
            .image(this.x, this.y - this.o.displayHeight - 4, png.hBar)
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
        else this.updateUI()
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
