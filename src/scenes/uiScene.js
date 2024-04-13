import { debug_addFullScreenButton } from './midScene'

export const uiScene = new Phaser.Scene('uiScene')
uiScene.create = () => {
    debug_addFullScreenButton(uiScene)
}
uiScene.update = () => {}
