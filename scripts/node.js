'use strict';

const Lab = require('../services/Lab');

async function main () {
  const lab = new Lab();
  await lab.start();
  console.log('Lab started.');
}

main().catch((exception) => {
  console.error('Could not start:', exception);
}).then((result) => {
  console.log('Done.');
});
