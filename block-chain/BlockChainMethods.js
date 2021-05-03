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
  autofarmAbi,
  autoFarmBeltStrat,
  autoFarmPCSStrat,
  beltLPAbi,
  masterbeltAbi,
  masterchefAbi,
  pancakeLPabi,
} from "./abi";
let web3;
let tokenList = {
  0: { 0: "MINE-BNB", 1: "PCS" },
  1: { 0: "AQUA-BNB", 1: "AQUA" },
  2: { 0: "AQUA", 1: "AQUA" },
  3: { 0: "BUSD-USDC", 1: "PCS" },
};

export const getAquaPrice = async () => {
  const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
  let poolDetails = await aquafarmInstance.methods.poolInfo("0").call();
  // console.log("Below is the pool details");
  // console.log( poolDetails);
  const lpAddress = poolDetails["want"];
  const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
  const bnbPrice = (
    await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true"
    )
  ).data.wbnb.usd;
  let getReserves = await pancakeLPinstance.methods.getReserves().call();
  let reserve0 = parseFloat(await getReserves["_reserve0"]);
  let reserve1 = parseFloat(await getReserves["_reserve1"]);
  let bnbPerAQUA = reserve1 / reserve0;
  const aquafinalPrice = bnbPerAQUA * bnbPrice;
  // console.log(aquafinalPrice);
  return aquafinalPrice;
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
const decimalAdjust = (dataValue) => {
  const exp = -17;
  let value = dataValue;
  value = value.toString().split("e");
  value = Math["floor"](
    +(value[0] + "e" + (value[1] ? +value[1] - exp : -exp))
  );
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
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
  // console.log("Idhar hai convert to ether")
  // console.log(parseFloat(web3.utils.fromWei(totalAmount.toString(), 'ether')));
  return parseFloat(web3.utils.fromWei(totalAmount.toString(), "ether"));
};

export const handleDeposit = async (poolId, amount, userAddress) => {
  //await getCurrentBalance('1','0xef77328e50c45cb371217777e8257e27f0b94f96',"4BELT");
  // console.log(await returnPlatformData(null));
  // console.log("data above ---------------------------")
  const approvalAmount =
    "100000000000000000000000000000000000000000000000000000000000000000000000000000";

  if (userAddress) {
    try {
      const depositAmount = parseFloat(amount);
      const aquafarmInstance = await selectInstance(
        "AQUAFARM",
        aquaFarmAddress
      );
      const poolDetails = await aquafarmInstance.methods
        .poolInfo(poolId)
        .call();
      const lpAddress = poolDetails["want"];
      const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      let getAllowance = await getCurrentApproval(poolId, userAddress);
      if (depositAmount > getAllowance) {
        await pancakeLPinstance.methods
          .approve(aquaFarmAddress, approvalAmount)
          .send({ from: userAddress });
      }
      await aquafarmInstance.methods
        .deposit(poolId, convertToWei(depositAmount))
        .send({ from: userAddress });
    } catch (err) {
      console.log(err);
    }
  }
};

export const handleWithdraw = async (poolId, amount, userAddress) => {
  if (userAddress) {
    try {
      const withdrawAmount = parseFloat(amount);
      const aquafarmInstance = await selectInstance(
        "AQUAFARM",
        aquaFarmAddress
      );
      let getCurrentDeposit = await getCurrentLpDeposit(userAddress, poolId);
      if (withdrawAmount <= parseFloat(getCurrentDeposit))
        await aquafarmInstance.methods
          .withdraw(poolId, convertToWei(withdrawAmount))
          .send({ from: userAddress });
    } catch (err) {
      console.log(err);
    }
  }
};

const getFinalBalance = (val) => {
  const newVal = parseFloat(val).toString();
  const finalValue = newVal.substring(0, newVal.length - 1);
  return `${finalValue}0`;
};

const getLPbalance = async (currentUserAddress, poolId, typeOfPool) => {
  try {
    const userAddress = currentUserAddress;
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    const poolDetails = await aquafarmInstance.methods.poolInfo(poolId).call();
    console.log(poolDetails);
    const lpAddress = poolDetails["want"];
    console.log(lpAddress);
    console.log(poolId);
    let balance = "";
    if (typeOfPool === "PCS") {
      const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      const balanceVal = await pancakeLPinstance.methods
        .balanceOf(userAddress)
        .call();
      // console.log("This is the balance");
      // console.log(balanceVal);
      balance = convertToEther(balanceVal);
    } else if (typeOfPool === "4BELT") {
      const beltInstance = await selectInstance("BELTLP", lpAddress);
      const balanceVal = await beltInstance.methods
        .balanceOf(userAddress)
        .call();
      balance = convertToEther(balanceVal);
    } else if (typeOfPool === "AQUA") {
      const aquaInstance = await selectInstance("AQUATOKEN", lpAddress);
      const balanceVal = await aquaInstance.methods
        .balanceOf(userAddress)
        .call();
      balance = convertToEther(balanceVal);
    }
    const finalBalance = getFinalBalance(balance);
    return finalBalance;
  } catch (err) {
    console.log(err);
  }
};

const getCurrentLpDeposit = async (currentUserAddress, poolId) => {
  try {
    const userAddress = currentUserAddress;
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    let currentLPdeposit = await aquafarmInstance.methods
      .userInfo(poolId, userAddress)
      .call();
    const currentLPdeposits = convertToEther(currentLPdeposit["shares"]);
    const newCurrentLpDeposit = getFinalBalance(currentLPdeposits);
    return newCurrentLpDeposit;
  } catch (err) {
    console.log(err);
  }
};

const getCurrentBalance = async (aquaPoolId, userAddress, typeOfAquaPool) => {
  let result = 0;
  const aquaFarm = await selectInstance("AQUAFARM", aquaFarmAddress);
  const aquaVaultAddress = (await aquaFarm.methods.poolInfo(aquaPoolId).call())[
    "strat"
  ];
  const aquaStrategyPoolContract = await selectInstance(
    typeOfAquaPool,
    aquaVaultAddress
  );
  const aquaVaultId = await aquaStrategyPoolContract.methods.pid().call();

  const aquaVaultFarmContractAddress = await aquaStrategyPoolContract.methods
    .farmContractAddress()
    .call();
  const autofarmInstance = await selectInstance(
    "AUTOFARM",
    aquaVaultFarmContractAddress
  );
  const poolDetailsOfAutoFarm = await autofarmInstance.methods
    .poolInfo(aquaVaultId)
    .call();
  const stratAddressOfAutoFarmPool = poolDetailsOfAutoFarm["strat"];

  if (typeOfAquaPool === "PCS") {
    const autoStrategyPoolContract = await selectInstance(
      "AUTOPCS",
      stratAddressOfAutoFarmPool
    );
    const autoVaultId = await autoStrategyPoolContract.methods.pid().call();

    let masterchefAddress = await autoStrategyPoolContract.methods
      .farmContractAddress()
      .call();
    const masterChefInstance = await selectInstance(
      "MASTERCHEF",
      masterchefAddress
    );
    const masterchefUserInfo = await masterChefInstance.methods
      .userInfo(autoVaultId, stratAddressOfAutoFarmPool)
      .call();

    const auto_s_pcsDeposit = masterchefUserInfo["amount"];
    let shareTotalAuto = await autoStrategyPoolContract.methods
      .sharesTotal()
      .call();
    shareTotalAuto = parseFloat(shareTotalAuto);

    let aquashare_in_auto = await autofarmInstance.methods
      .userInfo(aquaVaultId, aquaVaultAddress)
      .call();
    let share = aquashare_in_auto["shares"];
    share = parseFloat(share);

    const aquaShare = share / shareTotalAuto;
    result += aquaShare * auto_s_pcsDeposit;
    const userShare = await aquaFarm.methods
      .userInfo(aquaPoolId, userAddress)
      .call();
    const userShares = parseFloat(userShare["shares"]);
    const shareTotalAqua = await aquaStrategyPoolContract.methods
      .sharesTotal()
      .call();
    const newuserShares = userShares / shareTotalAqua;
    result *= newuserShares;
    result = result / Math.pow(10, 18);
    return result;
  } else if (typeOfAquaPool === "4BELT") {
    const autoStrategyPoolContract = await selectInstance(
      "AUTO4BELT",
      stratAddressOfAutoFarmPool
    );
    const autoVaultId = await autoStrategyPoolContract.methods.pid().call();

    const masterBelt = await autoStrategyPoolContract.methods
      .farmContractAddress()
      .call();
    const masterBeltInstance = await selectInstance("MASTERBELT", masterBelt);
    const masterBeltUserInfo = await masterBeltInstance.methods
      .userInfo(autoVaultId, stratAddressOfAutoFarmPool)
      .call();

    let auto_s_4beltDeposit = masterBeltUserInfo["shares"];
    let shareTotalAuto = await autoStrategyPoolContract.methods
      .sharesTotal()
      .call();
    shareTotalAuto = parseFloat(shareTotalAuto);

    let aquashare_in_auto = await autofarmInstance.methods
      .userInfo(aquaVaultId, aquaVaultAddress)
      .call();
    let share = aquashare_in_auto["shares"];
    share = parseFloat(share);

    const aquaShare = share / shareTotalAuto;
    result += aquaShare * auto_s_4beltDeposit;
    let userShare = await aquaFarm.methods
      .userInfo(aquaPoolId, userAddress)
      .call();
    const userShares = parseFloat(userShare["shares"]);
    const shareTotalAqua = await aquaStrategyPoolContract.methods
      .sharesTotal()
      .call();
    const newuserShares = userShares / shareTotalAqua;
    result *= newuserShares;
    result = result / Math.pow(10, 18);
    return result;
  }
};
const getUserLpStatus = async (userAddress, poolId) => {
  try {
    var obj = {};
    const autoAPiData = (
      await axios.get("https://static.autofarm.network/bsc/farm_data.json")
    ).data;
    let pools = autoAPiData["pools"];

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
    let autoFarmApy = 0;
    let getLpTokenLink;
    let assetPrice = 0;
    let tokenTypeBoolean = true;
    let pancakeLPinstance;
    let currentBalance;
    let LPbalance;
    // console.log(tokenList[poolId][1]);
    if (tokenList[poolId][1] === "PCS") {
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
      let reserve0tokenPrice = parseFloat(token.data[token0Address].price);
      let reserve1tokenPrice = parseFloat(token.data[token1Address].price);
      tokenType = "LP";
      tokenTypeBoolean = true;
      farmName = "AUTO";
      strategyInstance = await selectInstance("PCS", poolDetails["strat"]);
      let autoPoolId = await strategyInstance.methods.pid().call();
      autoFarmApy = pools[autoPoolId]["APY_total"];
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
        tvl > 0
          ? ((aquaPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getAquaPrice())) /
              tvl) *
            365 *
            100
          : aquaPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getAquaPrice()) *
            365 *
            100;
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = await getCurrentBalance(poolId, userAddress, "PCS");
        LPbalance = await getLPbalance(userAddress, poolId, "PCS");
      }
    } else if (tokenList[poolId][1] === "4BELT") {
      const lpAddress = poolDetails["want"];
      pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      tokenType = "BLP";
      farmName = "AUTO";
      tokenTypeBoolean = true;
      getLpTokenLink = "https://belt.fi/";
      strategyInstance = await selectInstance("4BELT", poolDetails["strat"]);
      let autoPoolId = await strategyInstance.methods.pid().call();
      autoFarmApy = pools[autoPoolId]["APY_total"];
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      const token = (
        await axios.get("https://api.pancakeswap.info/api/v2/tokens")
      ).data;
      assetPrice = parseFloat(
        token.data["0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"].price
      );
      tvl = convertToEther(tvl) * assetPrice;
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      aquaPerBlock = convertToEther(aquaPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        tvl > 0
          ? ((aquaPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getAquaPrice())) /
              tvl) *
            365 *
            100
          : aquaPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getAquaPrice()) *
            365 *
            100;
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = await getCurrentBalance(poolId, userAddress, "4BELT");
        LPbalance = await getLPbalance(userAddress, poolId, "4BELT");
      }
    } else if (
      tokenList[poolId][1] === "AQUA" &&
      tokenList[poolId][0] === "AQUA-BNB"
    ) {
      const lpAddress = poolDetails["want"];
      pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      tokenType = "LP";
      farmName = "AQUA";
      getLpTokenLink = `https://exchange.pancakeswap.finance/#/add/BNB/${aquaAddress}`;
      strategyInstance = await selectInstance("AQUA", poolDetails["strat"]);
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      aquaPerBlock = convertToEther(aquaPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];

      let getReserves = await pancakeLPinstance.methods.getReserves().call();
      let reserve0 = parseFloat(await getReserves["_reserve0"]);
      let reserve1 = parseFloat(await getReserves["_reserve1"]);
      let totalLpSupply = await pancakeLPinstance.methods.totalSupply().call();
      const token0price = await getAquaPrice();
      const token1price = (
        await axios.get(
          "https://api.coingecko.com/api/v3/simple/price?ids=wbnb&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true"
        )
      ).data.wbnb.usd;
      assetPrice =
        (reserve0 * token0price + reserve1 * token1price) / totalLpSupply;
      tokenTypeBoolean = true;
      tvl = convertToEther(tvl) * assetPrice;
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        tvl > 0
          ? ((aquaPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getAquaPrice())) /
              tvl) *
            365 *
            100
          : aquaPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getAquaPrice()) *
            365 *
            100;
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = 0;
        LPbalance = await getLPbalance(userAddress, poolId, "PCS");
      }
    } else if (
      tokenList[poolId][1] === "AQUA" &&
      tokenList[poolId][0] === "AQUA"
    ) {
      const lpAddress = poolDetails["want"];
      pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
      tokenType = "";
      farmName = "AQUA";
      getLpTokenLink = null;
      strategyInstance = await selectInstance("AQUA", poolDetails["strat"]);
      tvl = await strategyInstance.methods.wantLockedTotal().call();
      aquaPerBlock = await aquafarmInstance.methods.AQUAPerBlock().call();
      assetPrice = await getAquaPrice();
      tokenTypeBoolean = false;
      tvl = convertToEther(tvl) * assetPrice;
      aquaPerBlock = convertToEther(aquaPerBlock);
      poolAllocPoint = poolDetails["allocPoint"];
      let totalAllocPoint = await aquafarmInstance.methods
        .totalAllocPoint()
        .call();
      tokenYield =
        tvl > 0
          ? ((aquaPerBlock *
              28800 *
              (poolAllocPoint / totalAllocPoint) *
              (await getAquaPrice())) /
              tvl) *
            365 *
            100
          : aquaPerBlock *
            28800 *
            (poolAllocPoint / totalAllocPoint) *
            (await getAquaPrice()) *
            365 *
            100;
      tokenYieldPerDay = tokenYield / 365;
      if (userAddress) {
        currentBalance = 0;
        LPbalance = await getLPbalance(userAddress, poolId, "AQUA");
      }
    }
    if (userAddress != null) {
      obj["id"] = poolId;
      obj["liquidBalance"] = LPbalance;
      obj["currentLpDeposit"] = await getCurrentLpDeposit(userAddress, poolId);
      obj["pendingAquaEarnings"] = await getPendingAquaClaim(
        userAddress,
        poolId
      );
      obj["token"] = tokenList[poolId][0];
      obj["tokenTvl"] = tvl;
      obj["tokenYield"] = tokenYield;
      obj["dailyPercentage"] = tokenYieldPerDay;
      obj["totalEarned"] =
        `${parseFloat(currentBalance).toFixed(2)}` + tokenType;
      obj["currentBalance"] = parseFloat(currentBalance) * assetPrice;
      obj["rewardToken"] = await getPendingAquaClaim(userAddress, poolId);
      obj["reward"] = obj["rewardToken"] * (await getAquaPrice());
      obj["assetTokenPrice"] = assetPrice;
      obj["farmName"] = farmName;
      obj[
        "farmContract"
      ] = `https://bscscan.com/address/${aquaFarmAddress}#code`;
      obj[
        "vaultContractt"
      ] = `https://bscscan.com/address/${poolDetails["strat"]}#code`;
      obj["farmApy"] = autoFarmApy * 100;
      obj["optimalCompoundsPerYear"] = "0";
      obj["aquaApr"] = tokenYield;
      obj["totalApy"] = tokenYield + autoFarmApy * 100;
      obj["getLpToken"] = getLpTokenLink;
      obj["tokenType"] = tokenTypeBoolean;
      obj[
        "currentPoolTokenApproval"
      ] = await pancakeLPinstance.methods
        .allowance(userAddress, aquaFarmAddress)
        .call();
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
      obj["farmApy"] = autoFarmApy * 100;
      obj["optimalCompoundsPerYear"] = "0";
      obj["aquaApr"] = tokenYield;
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
    console.log(err);
  }
};

export const harvestLpTokens = async (id, userAddress) => {
  try {
    await handleWithdraw(id, 0, userAddress);
  } catch (err) {
    console.log(err);
  }
};

export const harvestAllLpTokens = async (userAddress) => {
  try {
    const poolLength = await getPoolLength();
    for (let i = 0; i < poolLength; i++) {
      await handleWithdraw(i, 0, userAddress);
    }
  } catch (err) {
    console.log(err);
  }
};

const getPoolLength = async () => {
  try {
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    const poolLength = await aquafarmInstance.methods.poolLength().call();
    console.log(poolLength);
    return poolLength;
  } catch (err) {
    console.log(err);
  }
};

export const returnPoolData = async (userAddress) => {
  try {
    console.log(userAddress);
    const poolLength = await getPoolLength();
    let result = [];
    for (let i = 0; i < poolLength; i++) {
      const lpStatus = await getUserLpStatus(userAddress, i);
      result.push(lpStatus);
    }
    return result;
  } catch (err) {
    console.log(err);
  }
};

export const returnPlatformData = async (userAddress) => {
  try {
    const poolDetails = await returnPoolData(userAddress);
    const poolLength = poolDetails.length;
    let totalTvl = 0;
    let myPortfolioCurrentApy = 0;
    let myPortfolioRewards = 0;
    let maxSupply = 0;
    let totalBalance = 0;
    poolDetails.forEach((element) => {
      totalTvl += element["tokenTvl"];
      myPortfolioCurrentApy += element["aquaApr"];
      myPortfolioRewards += element["reward"];
      totalBalance += element["currentBalance"];
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
      totalBalance: totalBalance,
      marketCap: convertToEther(aquaTotalSupply) * (await getAquaPrice()),
      totalProfitGenerated:
        convertToEther(aquaTotalSupply) * (await getAquaPrice()),
      perDayProfitGenerated:
        convertToEther(await aquaFarmInstance.methods.AQUAPerBlock().call()) *
        (await getAquaPrice()),
    };
    return obj;
  } catch (err) {
    console.log(err);
  }
};

export const getCurrentApproval = async (poolId, userAddress) => {
  try {
    const aquafarmInstance = await selectInstance("AQUAFARM", aquaFarmAddress);
    const poolDetails = await aquafarmInstance.methods.poolInfo(poolId).call();
    const lpAddress = poolDetails["want"];
    const pancakeLPinstance = await selectInstance("PANCAKELP", lpAddress);
    var getAllowance = await pancakeLPinstance.methods
      .allowance(userAddress, aquaFarmAddress)
      .call();
    getAllowance = convertToEther(getAllowance);
    return getAllowance;
  } catch (err) {
    console.log(err);
  }
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
    case "BELTLP":
      return new web3.eth.Contract(beltLPAbi, contractAddress);
    case "MASTERCHEF":
      return new web3.eth.Contract(masterchefAbi, contractAddress);
    case "MASTERBELT":
      return new web3.eth.Contract(masterbeltAbi, contractAddress);
    case "AUTOFARM":
      return new web3.eth.Contract(autofarmAbi, contractAddress);
    case "AUTOPCS":
      return new web3.eth.Contract(autoFarmPCSStrat, contractAddress);
    case "AUTO4BELT":
      return new web3.eth.Contract(autoFarmBeltStrat, contractAddress);
    default:
      return null;
  }
};
