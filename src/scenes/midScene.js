import { g } from './loadingScene'

export const midScene = new Phaser.Scene('midScene')
/** @type {Phaser.GameObjects.DOMElement} */
let cover
midScene.create = () => {
    const el = document.createElement('div')
    el.style.cssText = `background-color: var(--black);
    width: 100% !important;
    height: 100% !important;`
    cover = midScene.add.dom(0, 0, el).setOrigin(0).setDepth(999)
    cover.setInteractive()
}

midScene.update = () => {}

export function fadeIn(duration = 600, complete = () => {}) {
    midScene.tweens.add({
        targets: cover,
        props: {
            alpha: { from: 1, to: 0 },
        },
        duration: duration,
        ease: g.e.Sine.In,
        onComplete() {
            complete()
            cover.removeInteractive()
        },
    })
}

export function fadeOut(duration = 600, complete = () => {}) {
    cover.setInteractive()
    midScene.tweens.add({
        targets: cover,
        props: {
            alpha: { from: 0, to: 1 },
        },
        duration: duration,
        ease: g.e.Sine.In,
        onComplete() {
            complete()
        },
    })
}

/** @param {Phaser.Scene} scene*/
export function debug_addFullScreenButton(scene) {
    const btn = scene.add
        .image(0, 0, '__WHITE')
        .setOrigin(0)
        .setAlpha(0.001)
        .setDisplaySize(16, 16)
    btn.setInteractive()
    btn.on('pointerdown', () => {
        scene.scale.toggleFullscreen()
    })
}
