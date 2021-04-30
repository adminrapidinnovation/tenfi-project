import "styles/globals.scss";
import withRedux from "next-redux-wrapper";
import makeStore from "../redux/store";

function TenFiApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default withRedux(makeStore)(TenFiApp);
