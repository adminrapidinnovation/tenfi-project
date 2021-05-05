import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setPoolDataLoading, updatePoolData } from "redux/actions/user.actions";
import Layout from "components/Layout";
import Container from "components/Container";
import HomeSummaryCard from "components/HomeSummaryCard";
import AssetsFilterField from "components/Assets/AssetsFilterField";
import AssetsSection from "components/Assets/AssetsSection";
import AssetListItemBody from "../components/Assets/AssetListItemBody";
import AssetList from "../components/Assets/AssetList";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import PromotionBanner from "../components/PromotionBanner";
import styles from "../styles/modules/Home.module.scss";
import { returnPoolData } from "block-chain/BlockChainMethods";
import { refreshPoolData } from "global-function/globalFunction";

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

export const Home = () => {
  const selector = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    const getPoolDataVal = async () => {
      try {
        dispatch(setPoolDataLoading(true));
        const res = await returnPoolData(selector.user.address);
        if (!!res && typeof res !== "undefined") {
          dispatch(updatePoolData(res));
        }
      } catch (error) {
      } finally {
        dispatch(setPoolDataLoading(false));
      }
    };
    getPoolDataVal();
  }, [selector.user.address]);

  useEffect(() => {
    const interval = setInterval(async () => {
      refreshPoolData(selector.user.address, dispatch);
    }, 10000);
    return () => clearInterval(interval);
  }, [selector.user.address]);

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
};

export default Home;
