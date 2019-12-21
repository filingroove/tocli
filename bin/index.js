

const tg = require("torrent-grabber");
const clipboardy = require("clipboardy");
const chalk = require("chalk");
const inquirer = require("inquirer");
const argv = require("minimist")(process.argv.slice(2));

const readme = require("../src/readme");
const torrentItem = require("../src/torrentItem");
const baseURLs = require("../src/baseURLs");

const trackersToUse = ["1337x", "ThePirateBay", "Nnm"];

// console.log( argv );

// if (argv.rutrackerUser) {
//   trackersToUse.push(["Rutracker", { login: argv.rutrackerUser, pass: argv.rutrackerPass }]);
// }

const run = async () => {
  if (!argv.q && !argv.query) {
    console.log(readme);
    return;
  }

  const QUERY = argv.q || argv.query;

  await Promise.all(trackersToUse.map(tracker => tg.activate(tracker))).catch( e => {} );

  const searchResult = await tg.search(QUERY, { groupByTracker: false });

  const { torrent: index } = await inquirer.prompt([
    {
      type: "list",
      name: "torrent",
      message: "Choose one",
      choices: searchResult.map((torrent, index) => torrentItem(torrent, index))
    }
  ]);

  const magnetURI = await tg.getMagnet(searchResult[index]);

  console.log(`
    ${chalk.green("trackerId:")} ${searchResult[index].trackerId}
    ${chalk.green("MAGNET:")} ${magnetURI}

  `);

  if ( magnetURI ) {
    await clipboardy.write( magnetURI );
    console.log( `[ Magnet copied to clipboard 😉 ]` );
  } else if ( searchResult[index].trackerId ) {
    await clipboardy.write( `${ baseURLs[ searchResult[index].tracker ] }${searchResult[index].trackerId}`)
    console.log( `[ Magnet copied to clipboard 😉 ]` );
  }
};

run();
