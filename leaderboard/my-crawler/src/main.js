// For more information, see https://crawlee.dev/
import { PuppeteerCrawler, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';

const {sleep, RequestQueue, Dataset, createRequestDebugInfo} = import('crawlee')
const {puppeteer} = import('puppeteer')

tags = [
    "john-390",
    "marf-776",
    "verd-230",
    "aldo-285",
    "frog-338",
	"mint-0",
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
              let containerText = (await page.$eval('.container', e=>e.innerText))
              let infoSplit = containerText.split(`\n`)
              allinfo.push(`Slippi Tag: ${infoSplit[2]}\nELO: ${parseFloat((infoSplit[6].split(" "))[0])}\n`)
              await Dataset.pushData({"info": infoSplit})
          },
          failedRequestHandler({ request, log }) {
              log.error(`Request ${request.url} failed too many times.`);
          },
      });
      await crawler.run();