import { Provider } from "react-redux";
import withRedux from "next-redux-wrapper";
import { initStore } from "../store";

import "./styles.scss";

const MyApp = props => {
  const { Component, pageProps, store } = props;
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
};

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {};
  return { pageProps };
};

export default withRedux(initStore)(MyApp);
