import { g } from './loadingScene'
import { debug_addFullScreenButton } from './midScene'

export const uiScene = new Phaser.Scene('uiScene')
uiScene.create = () => {
    debug_addFullScreenButton(uiScene)

    const b1 = uiScene.add
        .bitmapText(20, 10, g.font, '1')
        .setInteractive()
        .on('pointerdown', () => {
            console.log(1)
        })
    const b2 = uiScene.add
        .bitmapText(40, 10, g.font, '2')
        .setInteractive()
        .on('pointerdown', () => {
            console.log(2)
        })
    const b3 = uiScene.add
        .bitmapText(60, 10, g.font, '3')
        .setInteractive()
        .on('pointerdown', () => {
            console.log(3)
        })
}
uiScene.update = () => {}
