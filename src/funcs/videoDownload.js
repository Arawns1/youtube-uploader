import * as fs from 'fs'
import * as path from 'path'
import { Readable } from 'stream'

async function videoDownload(url, title, extension) {
  try {
    console.group('- Video Download')
    console.log('-------------')
    console.time('- Video Download time')

    console.log(`> Trying to download: ${url}`)
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(response.statusText)
    }
    console.log(`> Video download completed`)

    console.log(`> Trying to save locally...`)
    const __dirname = path.resolve()
    const filePath = path.join(__dirname, 'temp', `${title}.${extension}`)
    const fileStream = fs.createWriteStream(filePath)

    return new Promise(async (resolve, reject) => {
      Readable.fromWeb(response.body).pipe(fileStream)
      fileStream.on('finish', () => {
        console.log(`> Locally saved successfully at: ${filePath}`)
        resolve(filePath)
      })
      fileStream.on('error', () => {
        console.log(`> Error saving video`)
        reject(err)
      })
    })
  } catch (error) {
    console.error('> Video download error:', error.message)
    reject(error)
  } finally {
    console.log('-------------')
    console.groupEnd('- Video Download')
    console.timeEnd('- Video Download time')
  }
}

export { videoDownload }
