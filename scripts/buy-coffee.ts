import { ethers } from "hardhat";
import { float } from "hardhat/internal/core/params/argumentTypes";

async function main() {
  const BMAC = await ethers.getContractFactory("BuyMeACoffee");
  const bmac = await BMAC.deploy();

  console.log("BuyMeACoffee deployed to:", bmac.address);

  // Extract some accounts
  const signers = await ethers.getSigners();

  const owner = signers[0]

  let wei = Math.floor((Math.random() * 100));
  let eth = ethers.utils.formatEther(wei);
  let eth_bignum = ethers.utils.parseUnits(wei.toString(), "wei");
  //console.log(eth_bignum)

  let sender = signers[Math.floor(Math.random()*10)];
  let senderName = "coffeeBuyer#" + (Math.floor(Math.random() * 10000));

  let senderMessage = `${senderName} is sending ${eth} ETH! from address ${sender.address}`;
  //console.log(senderMessage)

  const addresses = [owner.address, sender.address, bmac.address];
  console.log("== BEFORE sending ETH ==");
  await printBalances(addresses);

  // Send coffee
  await bmac.connect(sender).buyCoffee(senderName, senderMessage, { value: eth_bignum });
  
  // Check balances after withdrawal.
  console.log("== AFTER buying coffees ==");
  await printBalances(addresses);

  // Withdraw.
  await bmac.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log("== AFTER Withdrawal ==");
  await printBalances(addresses);

  // Check out the memos.
  console.log("== memos ==");
  printMemos(await bmac.getMemos());

  //
  // Challenges
  //

  // Change withdrawal address
  console.log(`Withdrawal address: ${await bmac.withdrawalAddress()}`)
  await bmac.connect(owner).changeWithdrawalAddress(signers[2].address);
  console.log(` NEW Withdrawal address: ${await bmac.withdrawalAddress()}`)

  // buyLargeCoffee for 0.003 ETH
  const largeCoffeeEth = ethers.utils.parseEther("0.003");
  await bmac.connect(signers[5]).buyLargeCoffee("Large Coffee Buyer", "Buying you a large coffee", { value: largeCoffeeEth });

  await printBalances(addresses);
  await printMemos(await bmac.getMemos());
  //
}

// Returns the Ether balance of a given address.
async function getBalance(address:string) {
  const balanceBigInt = await ethers.provider.getBalance(address);
  return ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses:any[]) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${address} balance: `, await getBalance(address));
    idx ++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos:any[]) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
