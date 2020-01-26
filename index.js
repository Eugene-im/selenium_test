const { Builder, By, until } = require("selenium-webdriver");
const driver = new Builder().forBrowser("chrome").build();

const fs = require("fs");
const http = require("http");
const https = require("https");
const ffmpeg = require("fluent-ffmpeg");
const merge = ffmpeg();
const dir = "./files";
const dir2 = "./readyToUpload";
const dir3 = "./img";

var fileList = [];
var listFileName = "list.txt";
var fileNames = "";
var saveString = "./readyToUpload/mergedAudio.m4a";

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

function checkDir(d) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d);
  }
}

checkDir(dir);
checkDir(dir2);
checkDir(dir3);

function getClear50() {
  return new Promise((resolve, reject) => {
    driver.findElements(By.css(tr)).then(elements => {
      for (var e of elements) {
        e.getAttribute("class").then(text => (temp = text));
        e.getAttribute("innerHTML").then(text2 => (temp2 = text2));
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
        if (temp == "hide") break;
        // await good50.push(e);
        e.getText().then(_ => tracks.push(_));
        trq = tracks
          .toString()
          .replace(/[\n\r]/g, " - ")
          .replace(/,/g, ",\n");
        console.log(trq);
      }
      // resolve(trq);
    });
    resolve(trq);
  });
}

//when done resolve == list of artists to input in txt

function sortCreate() {
  console.log(tracks);
  tracks.forEach(el => {
    ar1.push(el.split("\n"));
  });
  // console.log(ar1)
  ar1.reduce(function(result, item, index, array) {
    var result1 = {};
    for (var i = 0; i < item.length; i++) {
      result1.chNum = item[0];
      result1.trackName = item[1];
      result1.artist = item[2];
      result1.urlImg = urlImg[index];
      result1.urlSh = urlSh[index];
      result1.urlShortMusic = urlShortMusic[index];
      result1.urlShMusExt = urlShMusExt[index];
      result["it" + (index + 1)] = result1;
    }
    return result;
  }, ar4);
  console.log(ar4);
}

//when done resolve == link to save in base

function download(url, dest, cb) {
  return new Promise((resolve, reject) => {
    var file = fs.createWriteStream(dest);
    var request = https
      .get(url, function(response) {
        response.pipe(file);
        file.on("finish", function() {
          file.close(cb); // close() is async, call cb after close completes.
        });
      })
      .on("close", function() {
        ghj = ghj + 1;
        // console.log('file downloaded');
        console.log(ghj);
        resolve();
      })
      .on("error", function(err) {
        // Handle errors
        fs.unlink(dest); // Delete the file async. (But we don't check the result)
        if (cb) cb(err.message);
        reject(err);
      });
  });
}

function cyclicDownload() {
  var promises = [];
  var i = 0;
  var ast = "";
  // function cdownload(){
  //   var i = 0;
  //   var ast = "";
  //   for (e in ar4) {
  //     i+=1;
  //     ast = (i<10) ? "0" + i : i;
  //     promises.push( download(ar4[e].urlShortMusic, dir + "/" + ast + ar4[e].urlShMusExt));
  //   }
  // }

  fs.readdir(dir, (err, files) => {
    if (files.length != 0) {
      files.forEach(file => fs.unlinkSync(dir + "/" + file));
      for (e in ar4) {
        i += 1;
        ast = i < 10 ? "0" + i : i;
        promises.push(
          download(ar4[e].urlShortMusic, dir + "/" + ast + ar4[e].urlShMusExt)
        );
      }
      // cdownload();
    } else {
      for (e in ar4) {
        i += 1;
        ast = i < 10 ? "0" + i : i;
        promises.push(
          download(ar4[e].urlShortMusic, dir + "/" + ast + ar4[e].urlShMusExt)
        );
      }
      // cdownload();
    }
  });
  return Promise.all(promises);
}

function getLinkVideoFull() {
  whatSearch.forEach(el => {
    driver.get("https://youtube.com");
    driver.findElement(By.css("#search")).sendKeys(el);
    driver.findElement(By.css("#search-icon-legacy")).click();
    driver.wait(until.elementLocated(By.css(firstVideoYouTube)));
    driver
      .findElement(By.css(firstVideoYouTube))
      .getAttribute("href")
      .then(_ => {
        tempvar = "https://ss" + _.slice(_.indexOf("you"));
        driver.get(tempvar);
        console.log(tempvar);
      });
    driver.wait(until.elementLocated(By.css(dwnLink)));
    driver
      .findElement(By.css(dwnLink))
      .getAttribute("href")
      .then(_ => {
        linkList.push(_);
        console.log(linkList);
      });
  });
  // driver.close();
  // driver.quit();
}

//when done resolve == links on full audiofiles list for download

function createListFile() {
  fs.readdir(dir, (err, files) => {
    files.forEach(file => {
      fileList.push(file);
    });
    console.log(fileList);
    fileList.forEach(fileName => {
      fileNames = fileNames + "file '" + dir + "/" + fileName + "'\n";
    });
    console.log(fileNames);
    fs.writeFileSync(listFileName, fileNames);
  });
}

//when done resolve == audiofiles list for merge

function concatAudio() {
  merge
    .input(listFileName)
    .inputOptions(["-f concat", "-safe 0", "-report"])
    .outputOptions("-c copy")
    .save(saveString)
    .on("error", function(err) {
      console.log("Error " + err.message);
    })
    .on("end", function() {
      console.log("Finished!");
    });
}

// (async function example() {
//   try {
//     await driver.get(where);
//     await driver.wait(until.elementLocated(By.css(what)));
//     await getClear50();
//     await sortCreate();
//     await cyclicDownload();
//     await createListFile();
//     await concatAudio();
//     await fs.writeFile("new.txt",trq,(err)=> {if (err) throw err; console.log('file is ok')})
//     // tracks.forEach(element => {i+=1;item['it'+i]={"song":element};items['it'+i]=item['it'+i]});
//     // console.log(JSON.stringify(items));
//     // fs.writeFile("artists.txt",JSON.parse(items),(err)=> {if (err) throw err; console.log('file is ok')})
//   } catch (err) {
//     console.log(err);
//   } finally {
//     await driver.quit();
//   }
// })();

driver
  .get(where)
  .then(_ => {
    driver.wait(until.elementLocated(By.css(what)));
  })
  .then(_ => {
    getClear50();
    // return trq
  })
  .then(_ => createListFile())
  .then(_ => concatAudio())
  .then(_=> fs.writeFile("new.txt",trq,(err)=> {if (err) throw err; console.log('file is ok')}))
  .catch(error => console.log("Rejected: " + error));
// .then(_=>{
//   sortCreate()
// })

// 'use strict';

// let urls = [
//   'user.json',
//   'guest.json'
// ];

//   let chain = Promise.resolve();

// let results = [];

// // в цикле добавляем задачи в цепочку
// urls.forEach(function(url) {
//   chain = chain
//     .then(() => httpGet(url))
//     .then((result) => {
//       results.push(result);
//     });
// });

// // в конце — выводим результаты
// chain.then(() => {
//   console.log(results);
// });
