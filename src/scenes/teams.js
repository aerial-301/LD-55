import { png } from '../assets'
import { g } from './loadingScene'

/**
 * @type {{player: import('../typeDefs').Team, other: import('../typeDefs').Team}}
 */

export const teams = {
    player: {
        x: 30,
        get y() {
            return g.hh
        },
        units: [],
        get enemy() {
            return teams.other
        },
        score: 0,
    },
    other: {
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
    },
}
/**
 * @type {{sword: import('../typeDefs').UnitType, pike: import('../typeDefs').UnitType, musketeer:import('../typeDefs').UnitType}}
 */

export const units = {
    sword: {
        name: 'sword',
        png: png.sword,
        health: 100,
        damage: 25,
        range: 32,
        fireRate: 1,
        moveSpeed: 100,
    },
    pike: {
        name: 'pike',
        png: png.pike,
        health: 100,
        damage: 25,
        range: 32,
        fireRate: 0.7,
        moveSpeed: 140,
    },
    musketeer: {
        name: 'musketeer',
        png: png.musk,
        health: 100,
        damage: 25,
        range: 32 * 5,
        fireRate: 0.5,
        moveSpeed: 70,
    },
}
export const damageMods = {
    [png.sword]: {
        [png.pike]: 1.6,
        [png.musk]: 0.9,
        [png.sword]: 1,
    },
    [png.pike]: {
        [png.pike]: 0.3,
        [png.sword]: 0.45,
        [png.musk]: 1.9,
    },
    [png.musk]: {
        [png.sword]: 1.25,
        [png.pike]: 0.35,
        [png.musk]: 2,
    },
}
