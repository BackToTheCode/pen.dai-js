require("dotenv").config();

const fs = require("fs");
const Maker = require("@makerdao/dai");
const { MKR, DAI, ETH, WETH, PETH, USD_ETH, USD_MKR, USD_DAI } = Maker;

// Setup
const cdpIdTxt = "./cdpId.txt";

// Setup maker with chosen provider
let maker;

async function setupMaker() {
  maker = await Maker.create("http", {
    privateKey: process.env.PRIVATE_KEY,
    url: `https://kovan.infura.io/v3/${process.env.INFURA_PROJ_ID}`
  });
}

// Simple cdp opening function
async function openLockDraw() {
  await maker.authenticate();
  const cdp = await maker.openCdp();

  await cdp.lockEth(0.1);
  await cdp.drawDai(5);

  fs.writeFileSync(cdpIdTxt, cdp.id);
  const debt = await cdp.getDebtValue();
  console.log(debt.toString()); // '50.00 DAI'
}

async function getCurrentCdp() {
  const cdpId = fs.readFileSync(cdpIdTxt);
  const cdp = await maker.getCdp(parseInt(cdpId));

  console.log(cdp.id);
}

async function getPrices() {
  const price = maker.service("price");
  const ethPrice = await price.getEthPrice();
  const mkrPrice = await price.getMkrPrice();
  const pethPrice = await price.getPethPrice();

  console.log("ethPrice: ", ethPrice);
  console.log("mkrPrice: ", mkrPrice);
  console.log("pethPrice: ", pethPrice);

}

async function getUnits() {
    const eth = ETH(5);
    console.log(eth.toString());
  
    const price = USD_ETH(500);
    console.log(price.toString());
  
    // multiplication handles units
    const usd = eth.times(price);
    console.log(usd.toString());
}

async function getProxy() {
  return maker.service('proxy').currentProxy();
}

async function getWeb3() {
  web3 = await maker.service('web3')._web3;
  return web3;
}

async function main() {
  await setupMaker();
  await getCurrentCdp();
  await getPrices();
  await getUnits();
  const web3 = await getWeb3();
  console.log('web3: ', web3);
  console.log('current proxy:', await getProxy());  
}

main();
