import Layout from "../layout/Layout";

import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import MailIcon from "@material-ui/icons/Mail";

import { useFetchUser } from "../lib/auth/user";

const index = () => {
  const { user, loading } = useFetchUser();

  const initialScreen = (
    <React.Fragment>
      <p>
        {" "}
        This is a portfolio demo. This is NOT intended to be a final product
        with all content necessary to be used by final customers
      </p>
      <p>
        {" "}
        The idea for this demo is to showcase a fully operational{" "}
        <span style={{ color: "#83b0d8" }}>
          CRUD Single Page Application
        </span>{" "}
        using{" "}
        <a href="https://reactjs.org/" target="_blank">
          React
        </a>{" "}
        and{" "}
        <a href="https://nextjs.org/" target="_blank">
          NextJS
        </a>{" "}
        to harness the power of{" "}
        <span style={{ color: "#83b0d8" }}>Server Side Rendering</span> and code
        splitting optimization.
      </p>
      <p>
        {" "}
        This Web App uses{" "}
        <span style={{ color: "#83b0d8" }}>MongoDB as database,</span> provided
        by{" "}
        <a href="https://www.mongodb.com/cloud/atlas" target="_blank">
          MongoDB Atlas
        </a>{" "}
        and makes use of the NextJS internal server to handle all requests and
        also features <span style={{ color: "#83b0d8" }}>Authentication</span>{" "}
        provided by{" "}
        <a href="https://auth0.com/" target="_blank">
          Auth0
        </a>
        .
      </p>
      <p>
        {" "}
        <span style={{ color: "#83b0d8" }}>State management</span> is done using{" "}
        <a href="https://redux.js.org/" target="_blank">
          Redux
        </a>{" "}
        and <span style={{ color: "#83b0d8" }}>CSS styles</span> are performed
        using{" "}
        <a href="https://sass-lang.com/" target="_blank">
          SASS
        </a>
        . This App is deployed using{" "}
        <a href="https://zeit.co/pricing" target="_blank">
          NOW
        </a>
        .
      </p>
      <p>
        {" "}
        Even though the App is responsive to the different screen sizes, this
        App is not optimized for Mobile so bear that in mind if the experience
        is sub par.
      </p>
      <p>
        Please Signup/Login to continue this demo and for further instructions.
      </p>
    </React.Fragment>
  );

  const instructions = (
    <React.Fragment>
      <h4>{`Welcome back to the homepage ${
        user && "given_name" in user ? user.given_name : "Stranger"
      }`}</h4>
      <p>
        I hope you enjoyed the web application and feel free to contact me
        through{" "}
        <a
          href="https://www.linkedin.com/in/joaomiguelopesantos/"
          target="_blank"
        >
          <LinkedInIcon fontSize="small" />
        </a>
        ,{" "}
        <a href="https://github.com/JoMiguelSantos" target="_blank">
          <GitHubIcon fontSize="small" />
        </a>{" "}
        or{" "}
        <a href="mailto:joaomsglds@gmail.com" target="_top">
          <MailIcon fontSize="small" />
        </a>
      </p>
    </React.Fragment>
  );
  const content = (
    <div
      className="demo"
      style={{ color: "#f68616", "font-size": "1rem", padding: "2rem" }}
    >
      {!user ? initialScreen : instructions}
    </div>
  );

  return (
    <Layout user={user} loading={loading}>
      {loading ? <div>Loading...</div> : content}
    </Layout>
  );
};

export default index;
