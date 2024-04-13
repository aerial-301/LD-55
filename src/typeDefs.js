import { Unit } from './scenes/unit'
/**
 * @typedef Team
 * @type {object}
 * @prop {string} name
 * @prop {Number} x
 * @prop {Number} y
 * @prop {Array<Unit>} units
 * @prop {Team} enemy
 * @prop {Number} score
 * @prop {Number} dmgColor
 * @prop {string} bar
 */

/**
 * @typedef UnitType
 * @type {object}
 * @prop {string} name
 * @prop {{player: string, other: string}} png
 * @prop {Number} health
 * @prop {Number} damage
 * @prop {Number} range
 * @prop {Number} fireRate
 * @prop {Number} moveSpeed

 */
