import Layout from "components/Layout";
import Container from "components/Container";
import HomeSummaryCard from "components/HomeSummaryCard";
import AssetsFilterField from "components/Assets/AssetsFilterField";
import AssetsSection from "components/Assets/AssetsSection";
import React from "react";
import AssetListItemBody from "../components/Assets/AssetListItemBody";
import AssetList from "../components/Assets/AssetList";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import PromotionBanner from "../components/PromotionBanner";
import styles from "../styles/modules/Home.module.scss";
import { Provider } from "react-redux";
import store from "../redux/store";

export default function Home() {
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
  return (
    <Provider store={store}>
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
                  <HomeSummaryCard
                    title="Your Summary"
                    items={rewards}
                    danger
                  />
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
    </Provider>
  );
}
