import * as fs from 'fs';
import { delay } from '../helpers/utils.js';
class VideoUploadForm {

    constructor(page, form) {
        this.page = page;
        this.form = form;
    }

    identifiers = {
        uploadButton: "#upload-icon > tp-yt-iron-icon",
        uploadInput: "#select-files-button > ytcp-button-shape > button",
        forKidsRadio: "#audience > ytkc-made-for-kids-select > div.made-for-kids-rating-container.style-scope.ytkc-made-for-kids-select > tp-yt-paper-radio-group > tp-yt-paper-radio-button:nth-child(1)",
        checksCompleteLabel: "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.left-button-area.style-scope.ytcp-uploads-dialog > ytcp-video-upload-progress > span",
        nextButton: "#next-button",
        saveButton: "#done-button",
        youtubeLink: "#scrollable-content > ytcp-uploads-review > div.right-col.style-scope.ytcp-uploads-review > ytcp-video-info > div > div.row.style-scope.ytcp-video-info > div.left.style-scope.ytcp-video-info > div.value.style-scope.ytcp-video-info > span > a",
        publicVisibility: "#privacy-radios > tp-yt-paper-radio-button:nth-child(21)",
        saveButtonLabel: "#done-button > ytcp-button-shape > button > div",
    }
    

    elements = {
        uploadBtn: () => this.page.locator(this.identifiers.uploadButton),
        uploadInput: () => this.page.locator(this.identifiers.uploadInput),
        forKidsRadio: () => this.page.locator(this.identifiers.forKidsRadio),
        checksCompleteLabel: () => this.page.locator(this.identifiers.checksCompleteLabel),
        nextButton: () => this.page.locator(this.identifiers.nextButton),
        saveButton: () => this.page.locator(this.identifiers.saveButton),
        youtubeLink: () => this.page.locator(this.identifiers.youtubeLink),
        publicVisibilityRadio: () => this.page.locator(this.identifiers.publicVisibility),
        saveButtonLabel: () => this.page.locator(this.identifiers.saveButtonLabel)
    }

    async uploadFile() {
        const videoFilePath = this.form.videoPath;
        if (!fs.existsSync(videoFilePath)) {
            throw new Error(`File not found: ${videoFilePath}`);
        }

        await this.page.waitForSelector(this.identifiers.uploadButton, { visible: true, timeout: 2000 });
        await this.elements.uploadBtn().click();

        await this.page.waitForSelector(this.identifiers.uploadInput, { visible: true });

        const [fileChooser] = await Promise.all([
            this.page.waitForFileChooser(),
            this.page.click(this.identifiers.uploadInput),
        ]);

        await fileChooser.accept([videoFilePath]);
        await delay(2000);
    }

    async fillDetailsForm() {
        await this.page.waitForSelector(this.identifiers.forKidsRadio, { visible: true, timeout: 0 });
        await this.page.click(this.identifiers.forKidsRadio);
        await delay(1500);

        await this.page.waitForSelector(this.identifiers.nextButton, { visible: true, hidden: false, timeout: 0 });

        for (let i = 0; i <= 2; i++) {
            await this.page.hover(this.identifiers.nextButton);
            await delay(2000);
            await this.elements.nextButton().click();
            await delay(2000);
        }
    }

    async save() {
        delay(3000);
        await this.page.waitForSelector(this.identifiers.saveButtonLabel, { visible: true, hidden: false, timeout: 0 }, text => text === 'Publish');
        await this.elements.saveButton().click();
    }

    async setPublicVisibility() {
        delay(1000);
        await this.page.waitForSelector(this.identifiers.publicVisibility, { visible: true, timeout: 0 });
        await this.page.click(this.identifiers.publicVisibility);
    }

    async getYouTubeLink() {
        await this.page.waitForSelector(this.identifiers.youtubeLink, { visible: true, timeout: 0 });
        return await this.page.$eval(this.identifiers.youtubeLink, el => el.textContent);
    }
}


async function videoUpload(page, form) {
    return new Promise(async (resolve, reject) => {
        try {
            console.group('- Youtube Upload');
            console.log('-------------');
            console.time('- Youtube Upload time');

            const videoUpload = new VideoUploadForm(page, form);

            console.time('> Uploading video...');
            await videoUpload.uploadFile();
            console.timeEnd('> Uploading video...');

            console.log('> Verifying dialog errors...');
            await verifyDialogErrors(page);

            console.log('> Filling details form...');
            await videoUpload.fillDetailsForm();

            console.log('> Setting visibility...');
            await videoUpload.setPublicVisibility();

            console.log('> Getting youtube link...');
            const youtubeLink = await videoUpload.getYouTubeLink();

            console.log('> Saving...');
            await videoUpload.save();

            console.log(`> Video uploaded successfully at: ${youtubeLink}`);
            return resolve(youtubeLink);
        } catch (error) {
            console.error('> Video upload error:', error.message);
            reject(error);
        } finally {
            console.log('-------------');
            console.groupEnd('- Youtube Upload');
            console.timeEnd('- Youtube Upload time');
        }
    })
}

async function verifyDialogErrors(page) {
    return new Promise(async (resolve, reject) => {
        try {
            await delay(8000);

            const dialog = '#html-body > ytcp-uploads-dialog'

            await page.waitForSelector(dialog, { timeout: 1500 });
            await page.$eval(dialog, async el => {
                let attrs = Array.from(el.attributes);

                for (let { name } of attrs) {
                    if (name === 'has-error' || name === 'show-error-scrim') {
                        const errorSelector = '#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.left-button-area.style-scope.ytcp-uploads-dialog > ytcp-ve > div.error-short.style-scope.ytcp-uploads-dialog';
                        const errorMessage = el.querySelector(errorSelector).textContent;
                        throw new Error(errorMessage);
                    }
                }
            });
            await delay(2000);

            const checksComplete = "#dialog > div > ytcp-animatable.button-area.metadata-fade-in-section.style-scope.ytcp-uploads-dialog > div > div.left-button-area.style-scope.ytcp-uploads-dialog > ytcp-video-upload-progress > span"
            await page.waitForSelector(checksComplete, { visible: true, timeout: 0 }, text => text === 'Checks complete. No issues found.');
            await delay(2000);
            resolve()
        }
        catch (error) {
            return reject(error);
        }
    })

}

export { videoUpload };