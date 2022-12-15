// For more information, see https://crawlee.dev/
import { sleep, RequestQueue, Dataset, PuppeteerCrawler, createRequestDebugInfo, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';

//const fs = require('fs')
//const {sleep, RequestQueue, Dataset, PuppeteerCrawler, createRequestDebugInfo} = require('crawlee')
//const {puppeteer} = require('puppeteer')

let tags = [
  "john-390",
  "marf-776",
  "verd-230",
  "aldo-285",
  "frog-338",
  "mint-0",
  "mihl-380",
  "ully-375",
  "roo-757",
  "razz-632"
]
const requestQueue = await RequestQueue.open();
for (const player of tags) {
  await requestQueue.addRequest({ url: `https://slippi.gg/user/${player}` });
}

const allinfo = []
const crawler = new PuppeteerCrawler({
  launchContext: {
    launchOptions: {
      headless: true,
    },
    useChrome: true
  },
  requestQueue,
  requestHandlerTimeoutSecs: 120,
  navigationTimeoutSecs: 1000,
  async requestHandler({ page, request, log }) {
    let links = await page.$$("a")
    await links[2].click()
    await page.goBack()
    await sleep(2000)
    let containerText = (await page.$eval('.container', e => e.innerText))
    let infoSplit = containerText.split(`\n`)
    allinfo.push(`Slippi Tag: ${infoSplit[2]}\nELO: ${parseFloat((infoSplit[6].split(" "))[0])}\n`)
    fs.writeFile("table.txt", allinfo.join(`\n`), (err) => {
      if (err)
        console.log(err);
      else {
        console.log("File written successfully\n");
        console.log("The written has the following contents:");
        console.log(fs.readFileSync("table.txt", "utf8"));
      }
    });
    await Dataset.pushData({ "info": infoSplit })
  },
  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} failed too many times.`);
  },
});
await crawler.run();
