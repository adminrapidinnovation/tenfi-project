import axios from "axios";
import Web3 from "web3";
import {
  tenTokenAbi,
  tenAddress,
  tenFarmAbi,
  tenFarmAddress,
  tenStrategyTenAbi,
  tenStrategyPcsAbi,
  masterchefAbi,
  pancakeLPabi,
} from "./abi";
import { getWeb3Instance } from "global-function/globalFunction";
let web3;
let tokenList = {
  0: { 0: "ADA-BNB", 1: "PCS" , 2:258},
  1: { 0: "BTCB-BNB", 1: "PCS", 2:246},
  2: { 0: "BUSD-BNB", 1: "PCS", 2:244 },
  3: { 0: "CAKE-BNB", 1: "PCS", 2:243 },
  4: { 0: "DAI-BUSD", 1: "PCS", 2:258 },
  5: { 0: "DOT-BNB", 1: "PCS", 2:250 },
  6: { 0: "ETH-BNB", 1: "PCS", 2:247 },
  7: { 0: "LINK-BNB", 1: "PCS", 2:251 },
  8: { 0: "UNI-BNB", 1: "PCS", 2:252 },
  9: { 0: "USDC-BUSD", 1: "PCS", 2:258 },
  10: { 0: "USDT-BUSD", 1: "PCS", 2:248 },
  11: { 0: "USDT-BNB", 1: "PCS", 2:245 },
  12: { 0: "VAI-BUSD", 1: "PCS", 2:249 },
  13: { 0: "XRP-BNB", 1: "PCS", 2:257 },
  14: { 0: "TENFI", 1: "TENFI"},
};
import { BigNumber } from "bignumber.js";

export const getTenPrice = async () => {
  const tenfarmInstance = await selectInstance("TENFARM", tenFarmAddress);
  let poolDetails = await tenfarmInstance.methods.poolInfo("14").call();
  const lpAddress = '0xED44fa40e875fE29c761E28918b570182dF84286';
  const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
  const pancakeLPinstance3 = await selectInstance('PANCAKELP', '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16');
      let reserveOfBUSDBNB = await pancakeLPinstance3.methods.getReserves().call();
      let getBNBReserve= await reserveOfBUSDBNB['_reserve0'];
      let getUSDReserve= await reserveOfBUSDBNB['_reserve1'];
      const bnbPrice= getUSDReserve/getBNBReserve;
  // const bnbPrice = (
  //   await axios.get(
  //     "https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true"
  //   )
  // ).data.wbnb.usd;
  let getReserves = await pancakeLPinstance.methods.getReserves().call();
  let reserve0 = parseFloat(await getReserves["_reserve0"]);
  let reserve1 = parseFloat(await getReserves["_reserve1"]);
  let bnbPerTEN = reserve1 / reserve0;
  const tenfinalPrice = bnbPerTEN * bnbPrice;
  return tenfinalPrice;
};

export const getWeb3Val = async () => {
  // Check if MetaMask is installed
  if (!window.ethereum) {
    window.alert("Please install MetaMask first.");
    return;
  }
  if (!web3) {
    // Request account access if needed
    try {
      await window.ethereum.enable();
      // We don't know window.web3 version, so we use our own instance of Web3
      // with the injected provider given by MetaMask
      web3 = new Web3(window.ethereum);
    } catch (error) {
      window.alert("You need to allow MetaMask.");
      return;
    }
  }
  return web3;
};

export const getPublicAddress = async () => {
  const web3 = new Web3(window.ethereum);
  try {
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      window.alert("Please activate MetaMask first.");
      return;
    } else {
      const publicaddress = coinbase.toLowerCase();
      return publicaddress;
    }
  } catch (error) {
    return null;
  }
};

export const connectToMetamask = async () => {
  const { ethereum } = window;
  if (!ethereum) {
    window.alert("Please install MetaMask first.");
    return;
  }
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts;
  } catch (error) {
    if (!!error && error.message) {
      window.alert(error.message);
    } else {
      window.alert("Something went wrong.");
    }
    return;
  }
};

export const convertToWei = (totalAmount) => {
  const web3 = new Web3();
  return web3.utils.toWei(totalAmount.toString(), "ether");
};
export const convertToEther = (totalAmount) => {
  let x = new BigNumber(totalAmount);
  // console.log(x.toString())
  //return parseFloat(web3.utils.fromWei(totalAmount.toString(), 'ether'))
  return x.div(1e18).toNumber();
};

export const handleOnDeposit = async (poolId, amount, userAddress) => {
  const approvalAmount =
    "100000000000000000000000000000000000000000000000000000000000000000000000000000";

  if (userAddress) {
    try {
      const depositAmount = parseFloat(amount);
      const tenfarmInstance = await selectInstance(
        "TENFARM",
        tenFarmAddress,
        true
      );
      const poolDetails = await tenfarmInstance.methods.poolInfo(poolId).call();
      const lpAddress = poolDetails["want"];
      let pancakeLPinstance;
      let tenTokenInstance;
      let getAllowance = await getCurrentApproval(poolId, userAddress);

      const promisify = (inner) =>
        new Promise((resolve, reject) =>
          inner((err, res) => {
            if (err) {
              reject(err);
            }

            resolve(res);
          })
        );

      if (poolId != "0") {
        pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress, true);
        if (depositAmount > getAllowance) {
          await promisify((cb) => {
            pancakeLPinstance.methods
              .approve(tenFarmAddress, approvalAmount)
              .send({ from: userAddress })
              .once("transactionHash", function (hash) {
                cb();
              });
          });
        }
      } else {
        tenTokenInstance = await selectInstance("TENTOKEN", lpAddress, true);
        if (depositAmount > getAllowance) {
          await promisify((cb) => {
            tenTokenInstance.methods
              .approve(tenFarmAddress, approvalAmount)
              .send({ from: userAddress })
              .once("transactionHash", function (hash) {
                cb();
              });
          });
        }
      }

      await promisify((cb) => {
        tenfarmInstance.methods
          .deposit(poolId, convertToWei(depositAmount))
          .send({ from: userAddress })
          .once("transactionHash", function (hash) {
            cb();
          });
      });
    } catch (err) {
      console.log(err);
    }
  }
};

export const handleOnWithdraw = async (poolId, amount, userAddress) => {
  if (userAddress) {
    try {
      const withdrawAmount = parseFloat(amount);
      const tenfarmInstance = await selectInstance(
        "TENFARM",
        tenFarmAddress,
        true
      );
      let getCurrentDeposit = await getCurrentLpDeposit(userAddress, poolId);
      if (withdrawAmount <= parseFloat(getCurrentDeposit)) {
        const promisify = (inner) =>
          new Promise((resolve, reject) =>
            inner((err, res) => {
              if (err) {
                reject(err);
              }

              resolve(res);
            })
          );

        await promisify((cb) => {
          tenfarmInstance.methods
            .withdraw(poolId, convertToWei(amount))
            .send({ from: userAddress })
            .once("transactionHash", function (hash) {
              cb();
            });
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
};

const getFinalBalance = (val) => {
  const newVal = new BigNumber(val).toString();
  //const finalValue = newVal.substring(0, newVal.length);
  return newVal;
};

const getLPBalance = async (currentUserAddress, poolId, typeOfPool) => {
  try {
    const userAddress = currentUserAddress;
    const tenfarmInstance = await selectInstance("TENFARM", tenFarmAddress);
    const poolDetails = await tenfarmInstance.methods.poolInfo(poolId).call();
    const lpAddress = poolDetails["want"];
    let balance = "";
    if (typeOfPool === "PCS") {
      const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      const balanceVal = await pancakeLPinstance.methods
        .balanceOf(userAddress)
        .call();
      // console.log("This is the balance");
      // console.log(balanceVal);
      let x = new BigNumber(balanceVal)
      balance =  x.div(1e18).toString()
    } else if (typeOfPool === "TEN") {
      const tenTokenInstance = await selectInstance("TENTOKEN", lpAddress);
      const balanceVal = await tenTokenInstance.methods
        .balanceOf(userAddress)
        .call();
        let x = new BigNumber(balanceVal)
        balance =  x.div(1e18).toString()
    }
    console.log(convertToEther(470639659033),typeof(convertToEther(470639659033)))
    console.log("testing---->",getFinalBalance(convertToEther(470639659033)))
    console.log("testing===>",getFinalBalance(convertToEther(470639659033)).toFixed(2))
    const finalBalance = getFinalBalance(balance);
    return finalBalance;
  } catch (err) {
    console.log(err);
  }
};

const getCurrentLpDeposit = async (currentUserAddress, poolId) => {
  try {
    const userAddress = currentUserAddress;
    const tenfarmInstance = await selectInstance("TENFARM", tenFarmAddress);
    let currentLPdeposit = await tenfarmInstance.methods
      .userInfo(poolId, userAddress)
      .call();
    const currentLPdeposits = convertToEther(currentLPdeposit["shares"]);
    const newCurrentLpDeposit = getFinalBalance(currentLPdeposits);
    return newCurrentLpDeposit;
  } catch (err) {
    console.log(err);
  }
};

// const getCurrentBalance = async (tenPoolId, userAddress, typeOfTenPool) => {
//   let result = 0;
//   const tenFarm = await selectInstance("TENFARM", tenFarmAddress);
//   const tenVaultAddress = (await tenFarm.methods.poolInfo(tenPoolId).call())[
//     "strat"
//   ];
//   const tenStrategyPoolContract = await selectInstance(
//     typeOfTenPool,
//     tenVaultAddress
//   );
//   const tenVaultId = await tenStrategyPoolContract.methods.pid().call();

//   const tenVaultFarmContractAddress = await tenStrategyPoolContract.methods
//     .farmContractAddress()
//     .call();
//   const autofarmInstance = await selectInstance(
//     "AUTOFARM",
//     tenVaultFarmContractAddress
//   );
//   const poolDetailsOfAutoFarm = await autofarmInstance.methods
//     .poolInfo(tenVaultId)
//     .call();
//   const stratAddressOfAutoFarmPool = poolDetailsOfAutoFarm["strat"];

//   if (typeOfTenPool === "PCS") {
//     const autoStrategyPoolContract = await selectInstance(
//       "AUTOPCS",
//       stratAddressOfAutoFarmPool
//     );
//     const autoVaultId = await autoStrategyPoolContract.methods.pid().call();

//     let masterchefAddress = await autoStrategyPoolContract.methods
//       .farmContractAddress()
//       .call();
//     const masterChefInstance = await selectInstance(
//       "MASTERCHEF",
//       masterchefAddress
//     );
//     const masterchefUserInfo = await masterChefInstance.methods
//       .userInfo(autoVaultId, stratAddressOfAutoFarmPool)
//       .call();

//     const auto_s_pcsDeposit = masterchefUserInfo["amount"];
//     let shareTotalAuto = await autoStrategyPoolContract.methods
//       .sharesTotal()
//       .call();
//     shareTotalAuto = parseFloat(shareTotalAuto);

//     let tenshare_in_auto = await autofarmInstance.methods
//       .userInfo(tenVaultId, tenVaultAddress)
//       .call();
//     let share = tenshare_in_auto["shares"];
//     share = parseFloat(share);

//     const tenShare = share / shareTotalAuto;
//     result += tenShare * auto_s_pcsDeposit;
//     const userShare = await tenFarm.methods
//       .userInfo(tenPoolId, userAddress)
//       .call();
//     const userShares = parseFloat(userShare["shares"]);
//     const shareTotalTen = await tenStrategyPoolContract.methods
//       .sharesTotal()
//       .call();
//     const newuserShares = userShares / shareTotalTen;
//     result *= newuserShares;
//     result = result / Math.pow(10, 18);
//     return result;
//   }
// };
const fetchLiquidityPoolData = async (userAddress, poolId) => {
  try {
    var obj = {};
    const autoAPiData = (
      await axios.get("https://static.autofarm.network/bsc/farm_data.json")
    ).data;
    let pools = autoAPiData["pools"];

    const tenfarmInstance = await selectInstance("TENFARM", tenFarmAddress);
    let poolDetails = await tenfarmInstance.methods.poolInfo(poolId).call();
    let strategyInstance;
    let tvl = 0;
    let poolAllocPoint;
    let tenPerBlock;
    let tokenYield;
    let tokenYieldPerDay;
    let tokenType;
    let farmName;
    let autoFarmApy = 0;
    let getLpTokenLink;
    let assetPrice = 0;
    let tokenTypeBoolean = true;
    let pancakeLPinstance;
    let currentBalance;
    let LPbalance;
    // console.log(tokenList[poolId][1]);
    if (tokenList[poolId][0] !== "TENFI-BNB" && tokenList[poolId][1] === "PCS") {
      const lpAddress = poolDetails["want"];
      pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      const token = (
        await axios.get("https://api.pancakeswap.info/api/v2/tokens")
      ).data;
      let getReserves = await pancakeLPinstance.methods.getReserves().call();
      let reserve0 = parseFloat(await getReserves["_reserve0"]);
      let reserve1 = parseFloat(await getReserves["_reserve1"]);
      let totalLpSupply = await pancakeLPinstance.methods.totalSupply().call();
      let token0Address = await pancakeLPinstance.methods.token0().call();
      let token1Address = await pancakeLPinstance.methods.token1().call();
      let reserve0tokenPrice = parseFloat(token.data[token0Address].price)
      let reserve1tokenPrice = parseFloat(token.data[token1Address].price)
      tokenType = "LP";
      tokenTypeBoolean = true;
      farmName = "PCS";
      strategyInstance = await selectInstance("PCS", poolDetails["strat"]);
      autoFarmApy = pools[tokenList[poolId][2]]['APY'];
      getLpTokenLink = `https://exchange.pancakeswap.finance/#/add/${token0Address}/${token1Address}`;
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      assetPrice =
        (reserve0 * reserve0tokenPrice + reserve1 * reserve1tokenPrice) /
        totalLpSupply;
      tvl = new BigNumber(tvl).div(1e18).multipliedBy(assetPrice).toFixed(6);
      console.log("tvl-----", tvl);
      tenPerBlock = await tenfarmInstance.methods.TENFIPerBlock().call();
      tenPerBlock = convertToEther(tenPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await tenfarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        tvl > 0
          ? ((tenPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getTenPrice())) /
              tvl) *
            365 *
            100
          : (tenPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getTenPrice()));
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = 0;
        LPbalance = await getLPBalance(userAddress, poolId, "PCS");
      }
    } else if (
      tokenList[poolId][1] === "TENFI" &&
      tokenList[poolId][0] === "TENFI-BNB"
    ) {
      const lpAddress = poolDetails["want"];
      pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      tokenType = "LP";
      farmName = "TEN";
      getLpTokenLink = `https://exchange.pancakeswap.finance/#/add/BNB/${tenAddress}`;
      strategyInstance = await selectInstance("TEN", poolDetails["strat"]);
      tvl = new BigNumber(
        await strategyInstance.methods.wantLockedTotal().call()
      ).toNumber();
      console.log("tvl", tvl);
      tenPerBlock = convertToEther(
        await tenfarmInstance.methods.TENFIPerBlock().call()
      );
      console.log("ten per block--", tenPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];

      let getReserves = await pancakeLPinstance.methods.getReserves().call();
      let reserve0 = parseFloat(await getReserves["_reserve0"]);
      let reserve1 = parseFloat(await getReserves["_reserve1"]);
      let totalLpSupply = await pancakeLPinstance.methods.totalSupply().call();
      const token0price = await getTenPrice();

      const pancakeLPinstance3 = await selectInstance('PANCAKELP', '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16');
      let reserveOfBUSDBNB = await pancakeLPinstance3.methods.getReserves().call();
      let getBNBReserve= await reserveOfBUSDBNB['_reserve0'];
      let getUSDReserve= await reserveOfBUSDBNB['_reserve1'];
      const token1price= getUSDReserve/getBNBReserve;
      // const token1price = (
      //   await axios.get(
      //     "https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true"
      //   )
      // ).data.wbnb.usd;
      assetPrice = (
        (reserve0 * token0price + reserve1 * token1price) /
        totalLpSupply
      ).toFixed(4);
      console.log("asset price ----", assetPrice);
      tokenTypeBoolean = true;
      tvl = new BigNumber(tvl).div(1e18).multipliedBy(assetPrice).toFixed(6);
      let totalAllocPoint = await tenfarmInstance.methods
        .totalAllocPoint()
        .call();
      const tenPrice = await getTenPrice();
      console.log("tvl-----", tvl);
      tokenYield =
        tvl > 0
          ? ((tenPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getTenPrice())) /
              tvl) *
            365 *
            100
          : (tenPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getTenPrice()));

      console.log("token yield", tokenYield);
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = 0;
        LPbalance = await getLPBalance(userAddress, poolId, "PCS");
      }
    } else if (
      tokenList[poolId][1] === "TENFI" &&
      tokenList[poolId][0] === "TENFI"
    ) {
      const lpAddress = poolDetails["want"];
      pancakeLPinstance = await selectInstance("TENTOKEN", lpAddress);
      tokenType = "";
      farmName = "TEN";
      getLpTokenLink = null;
      strategyInstance = await selectInstance("TEN", poolDetails["strat"]);
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      tenPerBlock = await tenfarmInstance.methods.TENFIPerBlock().call();
      assetPrice = await getTenPrice();
      tokenTypeBoolean = false;
      tvl = new BigNumber(tvl).div(1e18).multipliedBy(assetPrice).toFixed(6);
      tenPerBlock = convertToEther(tenPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await tenfarmInstance.methods
        .totalAllocPoint()
        .call();
        tokenYield =
        tvl > 0
          ? ((tenPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getTenPrice())) /
              tvl) *
            365 *
            100
          : (tenPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getTenPrice()));
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = 0;
        LPbalance = await getLPBalance(userAddress, poolId, "TEN");
      }
    }
    if (userAddress != null) {
      // console.log("testing---------")
      obj["id"] = poolId;
      obj["liquidBalance"] = LPbalance;
      obj["currentLpDeposit"] = await getCurrentLpDeposit(userAddress, poolId);
      obj["pendingTenEarnings"] = await getPendingTENClaim(userAddress, poolId);
      obj["token"] = tokenList[poolId][0];
      obj["tokenTvl"] = tvl;
      obj["tokenYield"] = tokenYield;
      obj["dailyPercentage"] = tokenYieldPerDay;
      obj["totalEarned"] =
        `${parseFloat(currentBalance).toFixed(2)}` + tokenType;
      obj["currentBalance"] = parseFloat(currentBalance) * assetPrice;
      obj["rewardToken"] = await getPendingTENClaim(userAddress, poolId);
      obj["reward"] = obj["rewardToken"] * (await getTenPrice());
      obj["assetTokenPrice"] = assetPrice;
      obj["farmName"] = farmName;
      obj[
        "farmContract"
      ] = `https://bscscan.com/address/${tenFarmAddress}#code`;
      obj[
        "vaultContractt"
      ] = `https://bscscan.com/address/${poolDetails["strat"]}#code`;
      obj["farmApy"] = autoFarmApy * 100;
      obj["optimalCompoundsPerYear"] = "0";
      obj["tenApr"] = tokenYield;
      console.log("farm apy", tokenYield);
      obj["totalApy"] = tokenYield + autoFarmApy * 100;
      obj["getLpToken"] = getLpTokenLink;
      obj["tokenType"] = tokenTypeBoolean;
      obj[
        "currentPoolTokenApproval"
      ] = await pancakeLPinstance.methods
        .allowance(userAddress, tenFarmAddress)
        .call();
    } else {
      obj["id"] = poolId;
      obj["liquidBalance"] = "0.0000";
      obj["currentLpDeposit"] = "0.0000";
      obj["pendingTenEarnings"] = "0.0000";
      obj["token"] = tokenList[poolId][0];
      obj["tokenTvl"] = tvl;
      obj["tokenYield"] = tokenYield;
      obj["dailyPercentage"] = tokenYieldPerDay;
      obj["currentBalance"] = "0.0000";
      obj["totalEarned"] = "0 " + tokenType;
      obj["reward"] = "0";
      obj["rewardToken"] = "0.0000";
      obj["assetTokenPrice"] = assetPrice;
      obj["farmName"] = farmName;
      obj[
        "farmContract"
      ] = `https://bscscan.com/address/${tenFarmAddress}#code`;
      obj[
        "vaultContractt"
      ] = `https://bscscan.com/address/${poolDetails["strat"]}#code`;
      obj["farmApy"] = autoFarmApy * 100;
      obj["optimalCompoundsPerYear"] = "0";
      obj["tenApr"] = tokenYield;
      obj["totalApy"] = tokenYield + autoFarmApy * 100;
      obj["getLpToken"] = getLpTokenLink;
      obj["tokenType"] = tokenTypeBoolean;
      obj["currentPoolTokenApproval"] = "0";
    }
    return obj;
  } catch (err) {
    console.log(err);
  }
};

export const getPendingTENClaim = async (currentUserAddress, poolId) => {
  try {
    const tenfarmInstance = await selectInstance(
      "TENFARM",
      tenFarmAddress,
      true
    );
    const userAddress = currentUserAddress;
    var currentPendingTen = await tenfarmInstance.methods
      .pendingTENFI(poolId, userAddress)
      .call();
    currentPendingTen = convertToEther(currentPendingTen);
    return currentPendingTen;
  } catch (err) {
    console.log(err);
  }
};

export const harvestTenFiLpTokens = async (id, userAddress) => {
  try {
    await handleOnWithdraw(id, 0, userAddress);
  } catch (err) {
    console.log(err);
  }
};

export const harvestAllTenFiLpTokens = async (userAddress) => {
  try {
    const poolLength = await getPoolLength();
    for (let i = 0; i < poolLength; i++) {
      await handleOnWithdraw(i, 0, userAddress);
    }
  } catch (err) {
    console.log(err);
  }
};

const getPoolLength = async () => {
  try {
    const tenfarmInstance = await selectInstance("TENFARM", tenFarmAddress);
    console.log("tenfarmInstance==>", tenfarmInstance);
    const poolLength = await tenfarmInstance.methods.poolLength().call();
    console.log("poolLength==>", poolLength);
    return poolLength;
  } catch (err) {
    console.log(err);
  }
};

export const fetchAssetsPoolData = async (userAddress) => {
  try {
    const poolLength = await getPoolLength();
    let result = [];
    let lpStatusFunction = [];
    for (let i = 0; i < poolLength; i++) {
      const lpStatus = fetchLiquidityPoolData(userAddress, i);
      lpStatusFunction.push(lpStatus);
    }
    result = await Promise.all(lpStatusFunction);
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const fetchPlatformData = async (userAddress) => {
  try {
    const poolDetails = await fetchAssetsPoolData(userAddress);
    const poolLength = poolDetails.length;
    let totalTvl = 0;
    let myPortfolioCurrentApy = 0;
    let myPortfolioRewards = 0;
    let maxSupply = 0;
    let totalBalance = 0;
    poolDetails.forEach((element) => {
      totalTvl += element["tokenTvl"];
      myPortfolioCurrentApy += element["tenApr"];
      myPortfolioRewards += element["reward"];
      totalBalance += element["currentBalance"];
    });

    const tenTokenInstance = await selectInstance("TENTOKEN", tenAddress);
    const tenFarmInstance = await selectInstance("TENFARM", tenFarmAddress);
    let tenTotalSupply = parseFloat(
      await tenTokenInstance.methods.totalSupply().call()
    );
    maxSupply = convertToEther(
      await tenFarmInstance.methods.TENFIMaxSupply().call()
    );
    let obj = {
      circulatingSupply: convertToEther(tenTotalSupply),
      maxSupply: maxSupply,
      totalTvl: totalTvl,
      myPortfolioCurrentApy: myPortfolioCurrentApy / poolLength,
      myPortfolioRewards: myPortfolioRewards,
      totalBalance: totalBalance,
      // marketCap: convertToEther(tenTotalSupply) * (await getTenPrice()),
      // totalProfitGenerated:
      //   convertToEther(tenTotalSupply) * (await getTenPrice()),
      // perDayProfitGenerated:
      //   convertToEther(await tenFarmInstance.methods.TENFIPerBlock().call()) *
      //   (await getTenPrice()),
    };
    return obj;
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentApproval = async (poolId, userAddress) => {
  try {
    const tenfarmInstance = await selectInstance(
      "TENFARM",
      tenFarmAddress,
      true
    );
    const poolDetails = await tenfarmInstance.methods.poolInfo(poolId).call();
    const lpAddress = poolDetails["want"];
    if (poolId != 0) {
      const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      var getAllowance = await pancakeLPinstance.methods
        .allowance(userAddress, tenFarmAddress)
        .call();
      getAllowance = convertToEther(getAllowance);
      return getAllowance;
    } else {
      const tenTokenInstance = await selectInstance(
        "TENTOKEN",
        lpAddress,
        true
      );
      var getAllowance = await tenTokenInstance.methods
        .allowance(userAddress, tenFarmAddress)
        .call();
      getAllowance = convertToEther(getAllowance);
      return getAllowance;
    }
  } catch (err) {
    console.log(err);
  }
};

export const selectInstance = async (type, contractAddress, write = false) => {
  let web3 = new Web3();
  if (write) {
    const walletType = localStorage.getItem("walletType");
    if (!!walletType) {
      web3 = await getWeb3Instance(walletType);
    } else {
      web3 = new Web3("https://bsc-dataseed.binance.org/");
    }
    web3.eth.net.getId((err, netId) => {
      switch (netId) {
        case "1":
          console.log("This is mainnet");
          break;
        case "97":
          console.log("This is the deprecated Morden test network.");
          break;
        case "3":
          console.log("This is the ropsten test network.");
          break;
        default:
          web3 = new Web3("https://bsc-dataseed.binance.org/");
      }
    });
  } else {
    web3 = new Web3("https://bsc-dataseed.binance.org/");
  }

  switch (type) {
    case "TENFARM":
      return new web3.eth.Contract(tenFarmAbi, contractAddress);
    case "TENTOKEN":
      return new web3.eth.Contract(tenTokenAbi, contractAddress);
    case "PCS":
      return new web3.eth.Contract(tenStrategyPcsAbi, contractAddress);
    case "TEN":
      return new web3.eth.Contract(tenStrategyTenAbi, contractAddress);
    case "PANCAKELP":
      return new web3.eth.Contract(pancakeLPabi, contractAddress);
    case "MASTERCHEF":
      return new web3.eth.Contract(masterchefAbi, contractAddress);
    default:
      return null;
  }
};
