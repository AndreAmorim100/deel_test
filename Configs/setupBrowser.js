import driver from 'selenium-webdriver';
import * as conf from '../Configs/conf';
import chrome from 'selenium-webdriver/chrome';
import firefox from 'selenium-webdriver/firefox';
import 'chromedriver';
import 'geckodriver';

exports.setIeLocal = function () {
    let browser = new driver.Builder()
        .forBrowser('internet explorer')
        .build();
    return browser;
}

exports.setChromeLocal = function () {

    let browser = new driver.Builder()
        .forBrowser('chrome')
        .build();
    return browser;
}

exports.setChromeHeadless = function () {

    const width = conf.width;
    const height = conf.height;

    let browser = new driver.Builder()
        .forBrowser('chrome')
        .setChromeOptions(new chrome.Options()
            .headless()
            .addArguments("--no-sandbox")
            .addArguments("--disable-extensions")
            .windowSize({ width, height }))
        .build();
    return browser;
}

exports.setFirefoxLocal = function () {
    let browser = new driver.Builder()
        .forBrowser('firefox')
        .build();
    return browser;
}

exports.setFirefoxHeadless = function () {
    const width = conf.width;
    const height = conf.height;

    let browser = new driver.Builder()
        .forBrowser('firefox')
        .setFirefoxOptions(new firefox.Options()
            .headless()
            .addArguments("--no-sandbox")
            .addArguments("--disable-extensions")
            .windowSize({ width, height }))
        .build();
    return browser;
}

exports.accessWebsite = async function (browser, url) {
    return await browser.get(url);
}

exports.closeBrowser = async function (browser) {

    await browser.quit();
}

exports.maximizeWindow = function (browser) {
    browser
        .manage()
        .window()
        .maximize()
}



