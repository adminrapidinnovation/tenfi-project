import Layout from "components/Layout";
import Container from "components/Container";
import HomeSummaryCard from "components/HomeSummaryCard";
import AssetsFilterField from "components/Assets/AssetsFilterField";
import AssetsSection from "components/Assets/AssetsSection";
import React, { useEffect } from "react";
import AssetListItemBody from "../components/Assets/AssetListItemBody";
import AssetList from "../components/Assets/AssetList";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import PromotionBanner from "../components/PromotionBanner";
import styles from "../styles/modules/Home.module.scss";
import { setAssets } from "redux/actions/assets.actions";
import assets from "data/assets";
import { connect } from "react-redux";
import { returnPoolData } from "block-chain/blockChainMethods";
import { isLoggedIn } from "redux/actions/user.actions";
import Web3 from "web3";

function Home(props) {
  const rewards = [
    {
      id: 1,
      term: "Total Deposit",
      value: "$0.00",
    },
    {
      id: 2,
      term: "Total TENFI Pending",
      value: "0.00000 ($0.00)",
    },
    {
      id: 3,
      term: "Average APY",
      value: "7564% (673% Daily)",
    },
  ];

  useEffect(() => {
    console.log("props", props);
    if (props.user) {
      (async () => {
        try {
          let res = await returnPoolData(
            "0x77782f17aacAE20cBd8Eb09646109CA9B0cB9Be9"
          );
          console.log(res);
          // props.handleSetAssets(assets);
          props.handleSetAssets(res);
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [props.user]);

  useEffect(() => {
    (async () => {
      try {
        const web3 = new Web3(window.ethereum);
        const coinbase = await web3?.eth.getCoinbase();
        const publicAddress = coinbase?.toLowerCase();
        console.log("user", publicAddress);
        if (publicAddress != null) props.setUserData(publicAddress, true);
      } catch (error) {
        console.log(error);
        props.setUserData(null, false);
        return;
      }
    })();
  }, []);

  return (
    <Layout className="position-relative overflow-hidden">
      <PromotionBanner />
      <Header />
      <div className={styles.container}>
        <Container>
          <div className={`text-center text-uppercase ${styles.title}`}>
            TVL $1,014,146,318
          </div>
          <div className={styles.body}>
            <div className={`row ${styles.row}`}>
              <div className={`col-12 ${styles.col}`}>
                <HomeSummaryCard title="Your Summary" items={rewards} danger />
              </div>
            </div>
          </div>
          <AssetsSection right={<AssetsFilterField />}>
            <AssetList>
              <AssetListItemBody />
            </AssetList>
          </AssetsSection>
        </Container>
      </div>
      <Footer />
    </Layout>
  );
}

const mapStatesToProps = (state) => {
  return {
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleSetAssets: (assetsArray) => dispatch(setAssets(assetsArray)),
    setUserData: (userData) => dispatch(isLoggedIn(userData)),
  };
};

export default connect(mapStatesToProps, mapDispatchToProps)(Home);
