import { uiScene } from './scenes/uiScene'

let throttle = {}

export function clearStuff() {
    throttle = {}
}

export function tCall(func, delay, id = '', key = '' + func + id) {
    if (!throttle[key]) {
        func()
        throttle[key] = true
        uiScene.time.delayedCall(delay, () => {
            throttle[key] = false
        })
    }
}

export function debounce(func, delay) {
    let timer
    return () => {
        clearTimeout(timer)
        timer = setTimeout(() => func(arguments), delay)
    }
}

export function randI(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export function randF(min, max) {
    return Math.random() * (max - min) + min
}

export function addToArrayOnce(item, array) {
    if (!array.find(i => i === item)) array.push(item)
}

export function removeFromArray(item, array) {
    const index = array.indexOf(item)
    array.splice(index, 1)
}

export function pickRandom(array) {
    const index = randI(0, array.length)
    return array[index]
}

export function getUnitVector(a, b) {
    const angle = angleBetween(a, b)
    return {
        x: Math.cos(angle),
        y: Math.sin(angle),
        angle: angle,
    }
}

export function angleBetween(a, b) {
    return Math.atan2(b.y - a.y, b.x - a.x)
}
