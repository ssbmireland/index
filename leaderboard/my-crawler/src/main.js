// For more information, see https://crawlee.dev/
import { sleep, RequestQueue, Dataset, PuppeteerCrawler, createRequestDebugInfo, ProxyConfiguration } from 'crawlee';
import { router } from './routes.js';
import * as fs from 'fs';
import * as puppeteer from 'puppeteer';
import express from 'express';

const app = express();

//const fs = require('fs')
//const {sleep, RequestQueue, Dataset, PuppeteerCrawler, createRequestDebugInfo} = require('crawlee')
//const {puppeteer} = require('puppeteer')

let tags = [
  "aldo-285",
  "ddud-378",
  "frog-338",
  "john-390",
  "marf-776",
  "mihl-380",
  "mint-0",
  "razz-632",
  "sharp-0",
  "ully-375",
  "verd-230"
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
    allinfo.push(`${infoSplit[2]} ${parseFloat((infoSplit[6].split(" "))[0])}`)
    console.log(allinfo)
    app.get('/leaderboard', (req, res) => {
        res.render('index.ejs', { players: results })
      })
    await Dataset.pushData({ "info": infoSplit })
  },
  failedRequestHandler({ request, log }) {
    log.error(`Request ${request.url} failed too many times.`);
  },
});
await crawler.run();

function Player(tag, elo){
  this.tag = tag;
  this.elo = elo;
}

function sortTable(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("myTable2");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 1); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          // If so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
app.listen(process.env.PORT || 3030,
	() => console.log("Server is running..."));
