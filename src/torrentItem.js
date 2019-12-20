const chalk = require( 'chalk' );
const filesize = require( 'filesize' );

module.exports = ( torrent, index ) => {
  const { tracker, title, seeds } = torrent;

  return {
    name: `${ chalk.green( `[ ${tracker} ]` )} ${ title } ${ torrent.size ? `[Size: ${ filesize( torrent.size ) }] ` : '' }[Seeds: ${ chalk.yellow( seeds ) }]`,
    value: index
  }
}