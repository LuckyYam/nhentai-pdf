// eslint-disable-next-line @typescript-eslint/no-var-requires
const { Doujin } = require('../dist/index')

const doujin = new Doujin('https://nhentai.net/g/327/')
const a = async () => {
    doujin.save().then(console.log)
}
a()
