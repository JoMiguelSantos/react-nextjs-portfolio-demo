import Head from "next/head";

import Header from "../components/Navigation/Header/Header";
import Footer from "../components/Navigation/Footer/Footer";
import NavMenu from "../components/Navigation/NavMenu/NavMenu";
import Spinner from "../components/Spinner/Spinner";
import "./Layout.scss";

const Layout = ({ user, loading = false, children }) => {
  return (
    <div className="layout">
      <Head>
        <title>reshaped</title>
        <link
          rel="icon"
          type="image/x-icon"
          href="/images/reshaped_logo.png"
        ></link>
      </Head>
      <div id="navigation">
        <Header user={user} loading={loading} />
        <NavMenu user={user} loading={loading} />
      </div>
      {loading ? <Spinner /> : <div id="content">{children}</div>}
      <Footer user={user} loading={loading} />
    </div>
  );
};

export default Layout;
