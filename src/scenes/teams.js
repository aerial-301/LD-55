import { png } from '../assets'
import { partsGreen, partsPurple } from './gameScene'
import { g } from './loadingScene'

/**
 * @type {{player: import('../typeDefs').Team, other: import('../typeDefs').Team}}
 */

export const teams = {
    player: {
        name: 'player',
        x: 30,
        get y() {
            return g.hh
        },
        units: [],
        get enemy() {
            return teams.other
        },
        score: 0,
        dmgColor: g.pal.green,
        bar: png.hBar,
        get parts() {
            return partsGreen
        },
    },
    other: {
        name: 'other',
        get x() {
            return g.w - 30
        },
        get y() {
            return g.hh
        },
        units: [],
        get enemy() {
            return teams.player
        },
        score: 0,
        dmgColor: g.pal.pink,
        bar: png.hBarE,
        get parts() {
            return partsPurple
        },
    },
}
/**
 * @type {{sword: import('../typeDefs').UnitType, pike: import('../typeDefs').UnitType, musk:import('../typeDefs').UnitType}}
 */

export const units = {
    sword: {
        name: 'sword',
        png: {
            player: png.sword,
            other: png.swordE,
        },
        health: 100,
        damage: 25,
        range: 32,
        fireRate: 1,
        moveSpeed: 100,
    },
    pike: {
        name: 'pike',
        png: {
            player: png.pike,
            other: png.pikeE,
        },
        health: 100,
        damage: 25,
        range: 32,
        fireRate: 0.85,
        moveSpeed: 140,
    },
    musk: {
        name: 'musketeer',
        png: {
            player: png.musk,
            other: png.muskE,
        },
        health: 100,
        damage: 25,
        range: 32 * 5,
        fireRate: 0.7,
        moveSpeed: 60,
    },
}
export const damageMods = {
    [units.sword.name]: {
        [units.pike.name]: 1.7,
        [units.musk.name]: 0.5,
        [units.sword.name]: 0.7,
    },
    [units.pike.name]: {
        [units.pike.name]: 0.4,
        [units.sword.name]: 0.35,
        [units.musk.name]: 1.8,
    },
    [units.musk.name]: {
        [units.sword.name]: 1.75,
        [units.pike.name]: 0.35,
        [units.musk.name]: 0.8,
    },
}
