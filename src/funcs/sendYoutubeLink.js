async function sendYoutubeLink(channel, link) {
  try {
    console.group('- Send Youtube Link')
    console.log('-------------')
    console.time('- Send Youtube Link time')

    console.log('> Trying to send youtube link:', link)
    await channel.sendToQueue('youtube-link', Buffer.from(link))
    console.log('> Youtube link sent successfully')

    console.log('-------------')
    console.groupEnd('- Send Youtube Link')
    console.timeEnd('- Send Youtube Link time')
  } catch (error) {
    console.error('> Send Youtube Link error:', error.message)
    throw error
  }
}
