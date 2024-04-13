import { g } from './scenes/loadingScene'

let throttle = {}

export function clearStuff() {
    throttle = {}
}

export function throttledCall(func, delay, id = '', key = '' + func + id) {
    if (!throttle[key]) {
        func()
        throttle[key] = true
        g.sys.time.delayedCall(delay, () => {
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
