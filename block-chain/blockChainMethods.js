import axios from "axios";
import Web3 from "web3";
import {
  aquaAbi,
  aquaAddress,
  aquaFarmAbi,
  aquaFarmAddress,
  aquaStrategyAquaAbi,
  aquaStrategyBeltAbi,
  aquaStrategyPcsAbi,
  pancakeLPabi,
} from "./abi";
let web3;
let aquaPrice = 2700;
let tokenList = {
  0: { 0: "BUSD-USDT", 1: "PCS" },
  1: { 0: "4Belt", 1: "BELT" },
  2: { 0: "AQUA-BNB", 1: "AQUA" },
  3: { 0: "AQUA", 1: "AQUA" },
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
  const web3 = new Web3(window.ethereum);
  return web3.utils.toWei(totalAmount.toString(), "ether");
};
export const convertToEther = (totalAmount) => {
  const web3 = new Web3(window.ethereum);
  return parseFloat(web3.utils.fromWei(totalAmount.toString(), "ether"));
};

export const handleDeposit = async (poolId, amount) => {
  try {
    const web3 = new Web3(window.ethereum);
    const depositAmount = parseFloat(amount);
    console.log(depositAmount);
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    console.log(aquafarmInstance);
    const poolDetails = await aquafarmInstance.methods.poolInfo(poolId).call();
    console.log(poolDetails);
    const lpAddress = poolDetails["want"];
    const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
    const coinbase = await web3.eth.getCoinbase();
    let getAllowance = await getCurrentApproval(poolId);
    if (depositAmount > getAllowance) {
      await pancakeLPinstance.methods
        .approve(aquaFarmAddress, convertToWei(depositAmount))
        .send({ from: coinbase });
    }
    await aquafarmInstance.methods
      .deposit(poolId, convertToWei(depositAmount))
      .send({ from: coinbase });
  } catch (err) {
    console.log(err);
  }
};

export const handleWithdraw = async (poolId, amount) => {
  const web3 = new Web3(window.ethereum);
  const withdrawAmount = parseFloat(amount);
  const coinbase = await web3.eth.getCoinbase();
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  if (withdrawAmount <= (await getCurrentLpDeposit(coinbase, poolId)))
    await aquafarmInstance.methods
      .withdraw(poolId, convertToWei(withdrawAmount))
      .send({ from: coinbase });
};

export const getLPbalance = async (currentUserAddress, poolId) => {
  const userAddress = currentUserAddress;
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  const poolDetails = await aquafarmInstance.methods.poolInfo(poolId).call();
  const lpAddress = poolDetails["want"];
  const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
  var balance = await pancakeLPinstance.methods.balanceOf(userAddress).call();
  balance = convertToEther(balance);
  return balance;
};

export const getCurrentLpDeposit = async (currentUserAddress, poolId) => {
  const userAddress = currentUserAddress;
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  var currentLPdeposit = await aquafarmInstance.methods
    .stakedWantTokens(poolId, userAddress)
    .call();
  currentLPdeposit = convertToEther(currentLPdeposit);
  return currentLPdeposit;
};

export const getPoolInfo = async (poolId) => {
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  var pooldetails = await aquafarmInstance.methods.poolInfo(poolId).call();
  return pooldetails;
};

export const getFarmTotalAllocPoint = async () => {
  try {
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    var totalallocpoint = await aquafarmInstance.methods
      .totalAllocPoint()
      .call();
    return totalallocpoint;
  } catch (err) {
    console.log(err);
  }
};

export const getUserLpStatus = async (userAddress, poolId) => {
  try {
    var obj = {};
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    let poolDetails = await aquafarmInstance.methods.poolInfo(poolId).call();
    let strategyInstance;
    let tvl = 0;
    let poolAllocPoint;
    let aquaPerBlock;
    let tokenYield;
    let tokenYieldPerDay;
    let tokenType;
    let farmName;
    let getLpTokenLink;
    let assetPrice = 0;
    let tokenTypeBoolean = true;
    let currentApproval;
    if (tokenList[poolId][1] === "PCS") {
      const lpAddress = poolDetails["want"];
      const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      const token = (
        await axios.get("https://api.pancakeswap.info/api/v2/tokens")
      ).data;
      let getReserves = await pancakeLPinstance.methods.getReserves().call();
      let reserve0 = parseFloat(await getReserves["_reserve0"]);
      let reserve1 = parseFloat(await getReserves["_reserve1"]);
      let totalLpSupply = await pancakeLPinstance.methods.totalSupply().call();
      let token0Address = await pancakeLPinstance.methods.token0().call();
      let token1Address = await pancakeLPinstance.methods.token1().call();
      let reserve0tokenPrice = parseFloat(token.data[token0Address].price);
      let reserve1tokenPrice = parseFloat(token.data[token1Address].price);
      tokenType = "LP";
      tokenTypeBoolean = true;
      farmName = "AUTO";
      strategyInstance = await selectInstance("PCS", poolDetails["strat"]);
      getLpTokenLink = `https://exchange.pancakeswap.finance/#/add/${token0Address}/${token1Address}`;
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      assetPrice =
        (reserve0 * reserve0tokenPrice + reserve1 * reserve1tokenPrice) /
        totalLpSupply;
      tvl = convertToEther(tvl) * assetPrice;
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      aquaPerBlock = convertToEther(aquaPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        ((((aquaPerBlock * 28800 * poolAllocPoint) / totalAllocPoint) *
          aquaPrice) /
          1000000 /
          12) *
        100 *
        365;
      tokenYieldPerDay = tokenYield / 365;
      currentApproval = await getCurrentApproval(poolId);
    } else if (tokenList[poolId][1] === "BELT") {
      tokenType = "BLP";
      farmName = "AUTO";
      tokenTypeBoolean = true;
      getLpTokenLink = "https://belt.fi/";
      strategyInstance = await selectInstance("4BELT", poolDetails["strat"]);
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      tvl = convertToEther(tvl) * assetPrice;
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      aquaPerBlock = convertToEther(aquaPerBlock);
      const token = (
        await axios.get("https://api.pancakeswap.info/api/v2/tokens")
      ).data;
      assetPrice = parseFloat(
        token.data["0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"].price
      );
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        ((((aquaPerBlock * 28800 * poolAllocPoint) / totalAllocPoint) *
          aquaPrice) /
          1000000 /
          12) *
        100 *
        365;
      tokenYieldPerDay = tokenYield / 365;
      currentApproval = await getCurrentApproval(poolId);
    } else if (
      tokenList[poolId][1] === "AQUA" &&
      tokenList[poolId][0] === "AQUA-BNB"
    ) {
      tokenType = "LP";
      farmName = "AQUA";
      getLpTokenLink = `https://exchange.pancakeswap.finance/#/add/BNB/${aquaAddress}`;
      strategyInstance = await selectInstance("AQUA", poolDetails["strat"]);
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      aquaPerBlock = convertToEther(aquaPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      assetPrice = 0;
      tokenTypeBoolean = true;
      tvl = convertToEther(tvl) * assetPrice;
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        ((((aquaPerBlock * 28800 * poolAllocPoint) / totalAllocPoint) *
          aquaPrice) /
          1000000 /
          12) *
        100 *
        365;
      tokenYieldPerDay = tokenYield / 365;
      currentApproval = await getCurrentApproval(poolId);
    } else if (
      tokenList[poolId][1] === "AQUA" &&
      tokenList[poolId][0] === "AQUA"
    ) {
      tokenType = "";
      farmName = "AQUA";
      getLpTokenLink = null;
      strategyInstance = await selectInstance("AQUA", poolDetails["strat"]);
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      assetPrice = 0;
      tokenTypeBoolean = false;
      tvl = convertToEther(tvl) * assetPrice;
      aquaPerBlock = convertToEther(aquaPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        ((((aquaPerBlock * 28800 * poolAllocPoint) / totalAllocPoint) *
          aquaPrice) /
          1000000 /
          12) *
        100 *
        365;
      tokenYieldPerDay = tokenYield / 365;
      currentApproval = await getCurrentApproval(poolId);
    }
    if (userAddress != null) {
      obj["id"] = poolId;
      obj["liquidBalance"] = await getLPbalance(userAddress, poolId);
      obj["currentLpDeposit"] = await getCurrentLpDeposit(userAddress, poolId);
      obj["pendingAquaEarnings"] = await getPendingAquaClaim(
        userAddress,
        poolId
      );
      obj["token"] = tokenList[poolId][0];
      obj["tokenTvl"] = tvl;
      obj["tokenYield"] = tokenYield;
      obj["dailyPercentage"] = tokenYieldPerDay;
      obj["currentBalance"] = await getCurrentLpDeposit(userAddress, poolId);
      obj["totalEarned"] = "2,3176.28 " + tokenType;
      obj["rewardToken"] = await getPendingAquaClaim(userAddress, poolId);
      obj["reward"] = obj["rewardToken"] * aquaPrice;
      obj["assetTokenPrice"] = assetPrice;
      obj["farmName"] = farmName;
      obj[
        "farmContract"
      ] = `https://bscscan.com/address/${aquaFarmAddress}#code`;
      obj[
        "vaultContractt"
      ] = `https://bscscan.com/address/${poolDetails["strat"]}#code`;
      obj["farmApy"] = "0";
      obj["optimalCompoundsPerYear"] = "0";
      obj["aquaApr"] = tokenYield;
      obj["totalApy"] = tokenYield;
      obj["getLpToken"] = getLpTokenLink;
      obj["tokenType"] = tokenTypeBoolean;
      obj["currentPoolTokenApproval"] = currentApproval;
    } else {
      obj["id"] = poolId;
      obj["liquidBalance"] = "0.0000";
      obj["currentLpDeposit"] = "0.0000";
      obj["pendingAquaEarnings"] = "0.0000";
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
      ] = `https://bscscan.com/address/${aquaFarmAddress}#code`;
      obj[
        "vaultContractt"
      ] = `https://bscscan.com/address/${poolDetails["strat"]}#code`;
      obj["farmApy"] = "0";
      obj["optimalCompoundsPerYear"] = "0";
      obj["aquaApr"] = tokenYield;
      obj["totalApy"] = tokenYield;
      obj["getLpToken"] = getLpTokenLink;
      obj["tokenType"] = tokenTypeBoolean;
      obj["currentPoolTokenApproval"] = currentApproval;
    }
    return obj;
  } catch (err) {
    console.log(err);
  }
};

export const getPendingAquaClaim = async (currentUserAddress, poolId) => {
  try {
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    const userAddress = currentUserAddress;
    var currentPendingAqua = await aquafarmInstance.methods
      .pendingAQUA(poolId, userAddress)
      .call();
    currentPendingAqua = convertToEther(currentPendingAqua);
    return currentPendingAqua;
  } catch (err) {
    console.group(err);
  }
};

export const harvestLpTokens = async (id) => {
  try {
    await handleWithdraw(id, 0);
  } catch (err) {
    console.log(err);
  }
};

export const harvestAllLpTokens = async () => {
  const poolLength = await getPoolLength();
  for (let i = 0; i < poolLength; i++) {
    await handleWithdraw(i, 0);
  }
};

export const getPoolLength = async () => {
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  const poolLength = await aquafarmInstance.methods.poolLength().call();
  return poolLength;
};

export const returnPoolData = async (userAddress) => {
  const poolLength = await getPoolLength();
  let result = [];
  for (let i = 0; i < poolLength; i++) {
    const lpStatus = await getUserLpStatus(userAddress, i);
    result.push(lpStatus);
  }
  return result;
};

export const returnPlatformData = async (userAddress) => {
  const poolDetails = await returnPoolData(userAddress);
  const poolLength = poolDetails.length;
  let totalTvl = 0;
  let myPortfolioCurrentApy = 0;
  let myPortfolioRewards = 0;
  let maxSupply = 0;
  poolDetails.forEach((element) => {
    totalTvl += element["tokenTvl"] * element["assetTokenPrice"];
    myPortfolioCurrentApy += element["aquaApr"];
    myPortfolioRewards += element["reward"];
  });
  const aquaInstance = await selectInstance("AQUATOKEN", aquaAddress);
  const aquaFarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  let aquaTotalSupply = parseFloat(
    await aquaInstance.methods.totalSupply().call()
  );
  maxSupply = convertToEther(
    await aquaFarmInstance.methods.AQUAMaxSupply().call()
  );
  let obj = {
    circulatingSupply: convertToEther(aquaTotalSupply),
    maxSupply: maxSupply,
    totalTvl: totalTvl,
    myPortfolioCurrentApy: myPortfolioCurrentApy / poolLength,
    myPortfolioRewards: myPortfolioRewards,
  };
  return obj;
};

export const getCurrentApproval = async (poolId) => {
  const web3 = new Web3(window.ethereum);
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  const poolDetails = await aquafarmInstance.methods.poolInfo(poolId).call();
  const lpAddress = poolDetails["want"];
  const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
  const coinbase = await web3.eth.getCoinbase();
  var getAllowance = await pancakeLPinstance.methods
    .allowance(coinbase, aquaFarmAddress)
    .call();
  getAllowance = convertToEther(getAllowance);
  return getAllowance;
};

export const selectInstance = async (type, contractAddress) => {
  const web3 = new Web3(window.ethereum);
  switch (type) {
    case "AQUAFARM":
      return new web3.eth.Contract(aquaFarmAbi, contractAddress);
    case "AQUATOKEN":
      return new web3.eth.Contract(aquaAbi, contractAddress);
    case "PCS":
      return new web3.eth.Contract(aquaStrategyPcsAbi, contractAddress);
    case "4BELT":
      return new web3.eth.Contract(aquaStrategyBeltAbi, contractAddress);
    case "AQUA":
      return new web3.eth.Contract(aquaStrategyAquaAbi, contractAddress);
    case "PANCAKELP":
      return new web3.eth.Contract(pancakeLPabi, contractAddress);
    default:
      return null;
  }
};
