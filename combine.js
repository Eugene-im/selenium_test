const { Builder, By, until } = require("selenium-webdriver");
const driver = new Builder().forBrowser("chrome").build();

const fs = require("fs");
const http = require("http");
const https = require("https");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
const dir = ["./files", "./audio", "./video", "./img"];
// const dir2 = "./readyToUpload";
// const dir3 = "./img";

var fileList = [];
var listFileName = "list.txt";
var fileNames = "";
var saveString = "./audio/mergedAudio.m4a";

var ghj = 0;
var trq = "";

var where = "https://www.shazam.com/charts/top-200/russia";
var what = "div.artist";
var tr = "ul.tracks li[itemprop='track']";
var tracks = [];
var urlSh = [];
var urlShMusExt = [];
var urlShortMusic = [];
var urlImg = [];
var temp = "";
var temp2 = "";
var ar1 = [],
  ar4 = {};

var whatSearch = ["Don't Start Now Dua Lipa", "Clandestina FILV & Edmofo"];
var dwnLink = 'a.link[data-type="mp4"]';
var tempvar = "";
var firstVideoYouTube =
  "div#contents.style-scope.ytd-section-list-renderer ytd-thumbnail:first-child #thumbnail";
var linkList = [];

var chain = Promise.resolve();

function checkDir(d) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(d)) {
      fs.mkdirSync(d);
    }
    resolve();
  });
}

// function specSubstr(a, b, c, d) {
//   arguments.forEach(_=>{if (typeof(_)!='string'){
//     console.error('arguments must be a string');
//     break;
//   }})
//     return (a = b.substring(
//     b.indexOf(c),
//     b.indexOf(d)
//   ));
// }

function getClear50(el) {
  return new Promise((resolve, reject) => {
    el.getAttribute("class")
      .then(text => (temp = text))
      .then(_ => el.getAttribute("innerHTML"))
      .then(text2 => (temp2 = text2));
    var q = temp2.substring(temp2.indexOf('itemprop="url" content="'));
    var z = q.substring(
      q.indexOf("http"),
      q.indexOf('"><meta itemprop="audio" content="')
    );
    var t = q.substring(
      q.indexOf('"><meta itemprop="audio" content="') +
        '"><meta itemprop="audio" content="'.length,
      q.indexOf('"><div class="grid')
    );
    var y = t.substring(t.lastIndexOf("."));
    var w = q.substring(
      q.indexOf('style="background-image: url(&quot;') +
        'style="background-image: url(&quot;'.length,
      q.indexOf('&quot;);"> <ul class="')
    );

    urlSh.push(z);
    urlShMusExt.push(y);
    urlShortMusic.push(t);
    urlImg.push(w);
    if (temp == "hide") reject("stop");
    // await good50.push(e);
    el.getText().then(_ => tracks.push(_));
    trq = tracks
      .toString()
      .replace(/[\n\r]/g, " - ")
      .replace(/,/g, ",\n");
    console.log(trq);
    resolve();
  });
}

function getClearName50() {
    var proms = [];
//   return new Promise((resolve, reject) => {
    driver.findElements(By.css(tr)).then(elements => {
      for (var element of elements) {
          proms.push(
        new Promise((resolve, reject) => {
          try {
            element.getAttribute("class").then(_ => {
              // console.log(`1 ${_}`);
              temp = _;
              // if (temp == "hide") reject("stape"); /// tut dich add try catch
              if (temp == "hide") throw new Error(); /// tut dich
            });
            element.getAttribute("innerHTML").then(_ => {
              //   console.log(`3 ${_}`);
              temp2 = _;
            });
            element.getText().then(_ => {
              console.log(`3 ${_}`);
              tracks.push(_);
            });
            // console.log(`asd ${temp} ${temp2}`);
            var q = temp2.substring(temp2.indexOf('itemprop="url" content="'));
            var z = q.substring(
              q.indexOf("http"),
              q.indexOf('"><meta itemprop="audio" content="')
            );
            var t = q.substring(
              q.indexOf('"><meta itemprop="audio" content="') +
                '"><meta itemprop="audio" content="'.length,
              q.indexOf('"><div class="grid')
            );
            var y = t.substring(t.lastIndexOf("."));
            var w = q.substring(
              q.indexOf('style="background-image: url(&quot;') +
                'style="background-image: url(&quot;'.length,
              q.indexOf('&quot;);"> <ul class="')
            );

            urlSh.push(z);
            urlShMusExt.push(y);
            urlShortMusic.push(t);
            urlImg.push(w);

            // if (temp == "hide") break;
            // await good50.push(e);
            trq = tracks
              .toString()
              .replace(/[\n\r]/g, " - ")
              .replace(/,/g, ",\n");
            //   console.log(trq);
          } catch (e) {
            throw e;
          }
        // });
        //   )
    //   }
    // });
    console.log(tracks);
    resolve();
  });
    return Promise.all(proms);
}

chain = chain
  .then(_ => dir.forEach(el => checkDir(el)))
  .then(_ => driver.get(where))
  .then(_ => driver.wait(until.elementLocated(By.css(what))))
  .then(_ => getClearName50())
  //   .then(_ => driver.close())
  //   .then(_ => driver.quit())
  .then(_ => console.log("prominse done"))
  .catch(error => console.log("Rejected: " + error));
