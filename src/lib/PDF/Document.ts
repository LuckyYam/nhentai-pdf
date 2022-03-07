import PDF from 'pdfkit'
import sizes from './sizes.json'
import { createWriteStream, existsSync, promises as fs } from 'fs'
import download from '../Utils/download'
import { tmpdir } from 'os'
export class Document {
    constructor(public pages: string[], public size: keyof typeof sizes = 'A4') {}

    build = async (): Promise<Buffer> => {
        const document = new PDF({ margin: 0, size: sizes[this.size] })
        for (const image of this.pages) {
            const file = existsSync(image) ? image : await download(image)
            document.image(file, 0, 0, {
                fit: sizes[this.size] as [number, number],
                align: 'center',
                valign: 'center'
            })
            if (this.pages.indexOf(image) === this.pages.length - 1) break
            else document.addPage()
        }
        document.end()
        const filename = `${tmpdir()}/${this.size}_${Math.random().toString()}.pdf`
        const stream = createWriteStream(filename)
        document.pipe(stream)
        await new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(filename))
            stream.on('error', reject)
        })
        const buffer = await fs.readFile(filename)
        return buffer
    }
}