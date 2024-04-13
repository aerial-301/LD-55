import { readFileSync, readdirSync, writeFileSync } from 'fs'

const types = {
    ogg: {},
    wav: {},
    jpeg: {},
    png: {},
    maps: {},
    sheets: {},
    ttf: {},
}

async function getNames() {
    const dir = await readdirSync('./public/')
    for (let i of dir) {
        const [name, type] = i.split('.')
        if (!type) continue
        if (!types[type]) {
            types[type] = {}
        }
        types[type][name] = name
    }

    const sheetsDir = await readdirSync('./public/sheets/')
    types['sheets'] = {}
    for (let i of sheetsDir) {
        const [name, type] = i.split('.')
        const [dims, spacing] = name.split('_')[1].split('s')
        const [width, height] = dims.split('x')

        const info = name.split('_')[1]
        const spaceTest = info.match(/s(\d)/)
        const marginTest = info.match(/m(\d)/)

        types['sheets'][name] = {
            name: name,
            width: Number(width),
            height: Number(height),
            spacing: spaceTest ? +spaceTest[1] : 0,
            margin: marginTest ? +marginTest[1] : 0,
        }
    }

    const nMapsDir = await readdirSync('./public/nMaps/')
    types['nMaps'] = {}
    for (let i of nMapsDir) {
        const [fullName, type] = i.split('.')
        types['nMaps'][fullName] = fullName
    }

    writeFileSync(
        './src/assets.js',
        `${Object.keys(types)
            .map(key => {
                return `export const ${key} = ${JSON.stringify(
                    types[key],
                    null,
                    2
                )}`
            })
            .join('\n')}`,
        'utf-8'
    )
}

getNames()
