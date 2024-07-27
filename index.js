import puppeteer from 'puppeteer-extra';
import { login } from './src/funcs/login.js';
import { GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD, USER_SESSION_PATH } from './src/config/constants.js';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { videoUpload } from './src/funcs/videoUpload.js';
import { videoDownload } from './src/funcs/videoDownload.js';
import { createClipsChannel } from "./src/helpers/clipsChannel.js";
import Video from './src/helpers/Video.js';
import { deleteVideo } from './src/funcs/deleteVideo.js';

puppeteer.use(StealthPlugin())


async function uploadVideoToYouTube(video) {

    if (video instanceof Video === false) {
        throw new Error('Invalid video object');
    }

    const browser = await puppeteer.launch({ headless: false, userDataDir: USER_SESSION_PATH });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200,  height: 800 })
    await page.goto('https://studio.youtube.com/');


    const pageURL = page.url();
    const host = new URL(pageURL).hostname;

    if (host === 'accounts.google.com') {
        console.warn('> Session not found! Logging in...');
        await login(page, GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD);
        await page.goto('https://studio.youtube.com/');
    }

    const form = {
        title: video.title,
        description: video.description,
        tags: ['puppeteer', 'youtube', 'upload'],
        videoPath: video.videoPath,
        visibility: 'Public',
        forKids: true
    };

    const youtubeLink = await videoUpload(page, form);
    await browser.close();
    return youtubeLink;
}


async function main() {
    try {
        const onMessage = async (content, properties) => {
            const video = new Video(content.id, content.titulo, content.descricao, content.formato, content.tamanho, content.link, content.autor);

            const videoPath = await videoDownload(video.url, video.title, video.getExtension());
            video.videoPath = videoPath;

            const youtubeLink = await uploadVideoToYouTube(video);
            await deleteVideo(videoPath);

            console.log("Video uploaded to youtube: ", youtubeLink);

            channel.sendToQueue(properties.replyTo,
                Buffer.from(JSON.stringify(youtubeLink)), {
                correlationId: properties.correlationId
            });
        };

        const channel = await createClipsChannel(onMessage)
    } catch (error) {
        console.error('Error: ', error);
    }

}




main();










