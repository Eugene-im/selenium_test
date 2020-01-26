const { Builder, By, Key, until } = require("selenium-webdriver");
const driver = new Builder().forBrowser("chrome").build();

var whatSearch = ["Don't Start Now Dua Lipa", "Clandestina FILV & Edmofo"];
var dwnLink = 'a.link[data-type="mp4"]';
var tempvar = "";
var firstVideoYouTube =
  "div#contents.style-scope.ytd-section-list-renderer ytd-thumbnail:first-child #thumbnail";
var linkList = [];

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
      .then(_ => {linkList.push(_); console.log(linkList)});
  });
  driver.close();
  driver.quit();
}

getLinkVideoFull();
