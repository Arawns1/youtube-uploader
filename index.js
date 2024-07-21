import puppeteer from 'puppeteer-extra';
import { login } from './src/pages/login.js';
import { GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD, USER_SESSION_PATH } from './src/config/constants.js';
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { videoUpload } from './src/pages/videoUpload.js';

puppeteer.use(StealthPlugin())

const browser = await puppeteer.launch({ headless: false, userDataDir: USER_SESSION_PATH });
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });
await page.goto('https://studio.youtube.com/');

const pageURL = page.url();
const host = new URL(pageURL).hostname

if (host === 'accounts.google.com') {
    console.warn('> Session not found! Logging in...');
    await login(page, GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD)
}


const form = {
    title: 'Teste Upload Puppeteer',
    description: 'Teste de upload de vídeo com Puppeteer',
    tags: ['puppeteer', 'youtube', 'upload'],
    thumbnailPath: './thumbnail.jpg',
    videoPath: 'H:/youtube-uploader-app/youtube-uploader/clip.mp4',
    visibility: 'Public',
    forKids: true
}

await videoUpload(page, form);










