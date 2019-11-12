require('dotenv').config()

const Maker = require('@makerdao/dai');

async function openLockDraw() {
    const maker = await Maker.create("http", {
        privateKey: YOUR_PRIVATE_KEY,
        url: 'https://kovan.infura.io/v3/YOUR_INFURA_PROJECT_ID'
    });

  await maker.authenticate();
  const cdp = await maker.openCdp();

  await cdp.lockEth(0.25);
  await cdp.drawDai(50);

  const debt = await cdp.getDebtValue();
  console.log(debt.toString); // '50.00 DAI'
}

openLockDraw();