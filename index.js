import puppeteer from 'puppeteer';
import { login } from './login.js';
import { GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD } from './constants.js';

const browser = await puppeteer.launch({headless: false});
const page = await browser.newPage();
await page.setViewport({width: 1080, height: 1024});

await page.goto('https://studio.youtube.com/');

const pageURL = page.url();

const host = new URL(pageURL).hostname
if(host === 'accounts.google.com') {
    console.warn('> Account not logged in!');
    await login(page, GOOGLE_USER_LOGIN, GOOGLE_USER_PASSWORD)
}

await browser.close();






