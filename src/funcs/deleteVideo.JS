import * as fs from 'fs'

async function deleteVideo(videoPath) {
  return new Promise((resolve, reject) => {
    try {
      console.group('- Video Delete')
      console.log('-------------')
      console.time('- Video Delete time')

      console.log(`> Trying to delete: ${videoPath}`)
      fs.unlinkSync(videoPath)
      console.log(`> Video deleted successfully`)
      resolve()
    } catch (error) {
      console.error('> Video delete error:', error.message)
      reject(error)
    } finally {
      console.log('-------------')
      console.groupEnd('- Video Delete')
      console.timeEnd('- Video Delete time')
    }
  })
}

export { deleteVideo }
