import { By, until } from 'selenium-webdriver';
import fs from 'fs';
import * as conf from '../Configs/conf';
import { Key } from 'selenium-webdriver/lib/input';



export default class BaseObject {
    constructor(browser) {
        this.browser = browser;
    }


    async isNotPresent(locator) {
        return await this.browser.wait(() => {
            return this.browser.findElements(locator).then((elements) => {
                return elements.length <= 0;
            });
        }, conf.timeoutFindElements, 'The element was still present when it should have disappeared. locator: ' + locator);
    }

    async initializationisNotPresent(locator) {
        await this.browser.wait(() => {
            this.browser.findElements(locator).then((elements) => {
                return elements.length <= 0;
            });
        }, conf.maxSafeTimeout, 'The element was still present when it should have disappeared. locator: ' + locator);
    }

    async isPresent(locator) {
        return await this.browser.wait(() => {
            return this.browser.findElements(locator).then((elements) => {
                return elements.length > 0;
            });
        }, conf.timeoutFindElements, 'The element is not present. locator: ' + locator);
    }

    async checkElementisNotPresent(locator) {
        let webElements = this.browser.findElements(locator);
        return webElements.then(function (elements) {
            return elements.length == 0;
        });
    }

    async checkElementisPresent(locator) {
        let webElements = this.browser.findElements(locator);
        return webElements.then(function (elements) {
            return elements.length > 0;
        });
    }

    takeScreenshot(filename) {

        if (!fs.existsSync("./artifacts")) {
            fs.mkdirSync("artifacts");

            console.log('Folder Created Successfully.');
        }
        return this.browser.takeScreenshot()
            .then(screen => {
                fs.writeFileSync("artifacts/" + filename, screen, 'base64');
            }).catch((err) => {
                console.log("Failed screenshot!");
                console.log(err);
            });
    }

    async waitUntilElementIsNotVisible(locator) {
        await this.browser.wait(until.elementIsNotVisible(
            this.browser.findElement(locator)), conf.timeoutFindElements,
            `Timed out waiting for the element with ${locator.using} of '${locator.value}' to be visible`);
    }

    async clickWhenVisible(locator) {
        await this.browser.wait(until.elementIsEnabled(
            this.browser.findElement(locator)), conf.timeoutFindElements,
            `Timed out waiting for the element with ${locator.using} of '${locator.value}' to be visible`)

        return await this.browser.findElement(locator).click();
    }

    async setWhenVisible(locator, text) {
        await this.browser.wait(until.elementIsVisible(
            this.browser.findElement(locator)), conf.timeoutFindElements,
            `Timed out waiting for the element with ${locator.using} of '${locator.value}' to be visible`);
        let element = await this.browser.findElement(locator);
        await element.clear();
        await element.sendKeys(text);
    }

    async getElementText(locator) {
        await this.browser.wait(until.elementIsVisible(
            this.browser.findElement(locator)), conf.timeoutFindElements,
            `Timed out waiting for the element with ${locator.using} of '${locator.value}' to be visible`);
        let element = await this.browser.findElement(locator);
        return await element.getText();
    }

    async waitUntilElementPresent(locator) {
        const item = this.browser.wait(until.elementLocated(locator), conf.timeoutFindElements)
            .then(element => {
                return this.browser.wait(until.elementIsVisible(element), conf.timeoutFindElements);
            });
    }

    async waitUntilElementIsVisible(locator) {
        await this.browser.wait(until.elementIsVisible(
            this.browser.findElement(locator)), conf.timeoutFindElements,
            `Timed out waiting for the element with ${locator.using} of '${locator.value}' to be visible`);
    }

    async writeTextFile(file, text) {
        await fs.writeFile(file, text, function (err) {
            if (err) {
                return console.log(err);
            }


        });
    }

    async reloadPage() {
        let driver = await this.browser;
        return await driver.navigate().refresh();
    }

    async clickOnElement(locator) {
        let element = await this.browser.findElement(locator);
        await element.click();
    }

    async clickOnElementOnly(element) {
        await element.click();
    }

    async clickOnElementFromList(index, locator) {
        let element = await this.browser.findElements(locator);
        await element[index].click();
    }


    async getElements(locator) {
        let elements = await this.browser.findElements(locator);
        return elements;
    }

    async waitForElementToBeLoaded(locator) {
        let it_counter = 0;
        while (await this.checkElementisNotPresent(locator) && it_counter < conf.minRetryCount) {
            it_counter++;
            await this.browser.sleep(1000);
        }

        expect(it_counter).toBeLessThan(conf.minRetryCount);
    }

    async sleepBrowser(time) {
        return await this.browser.sleep(time);
    }

    async clickEnter(locator) {
        let element = await this.browser.findElement(locator);
        await element.click();
        await element.sendKeys(Key.TAB);
    }

    async sendText(locator, text) {
        let element = await this.browser.findElement(locator);
        await element.sendKeys(text);
    }


    async sendEnter(locator) {
        let element = await this.browser.findElement(locator);
        await element.sendKeys(Key.TAB);
    }

    async hoverElement(locator) {
        const actions = await this.browser.actions({ bridge: true });
        let elem = await this.browser.findElement(locator);
        await actions.move({ duration: 500, origin: elem, x: 0, y: 0 }).perform();
    }

    async scrollDownPage(locator) {
        let elem = await this.browser.findElement(locator);
        await elem.sendKeys(Key.CONTROL, Key.END);
    }

    async setImageJSDOM(image, name) {
        console.log(image);
        const pngFile = await fs.readFileSync(image);
        const pngFileBuffer = new ArrayBuffer(image.length);
        const view = new Uint8Array(pngFileBuffer);
        for (let i = 0; i < pngFile.length; ++i) {
            view[i] = pngFile[i];
        }
        await this.browser.executeScript("const el = document.querySelector('alt-asset-manager-dialog [altassetmanagerdropupload]');const dataTransfer = new DataTransfer();dataTransfer.items.add(new File([" + view + "],'" + name + "',{type:'image/png'}));el.dispatchEvent(new DragEvent('drop',{dataTransfer}));");
        await this.sleepBrowser(3000);
    }

    async jsClickOn(el) {
        let elem = await this.browser.findElement(el);
        await this.browser.executeScript("arguments[0].click();", elem);
        await this.sleepBrowser(3000);
    }

    async navigateBrowser(url) {
        await this.browser.get(url);
    }



}