import Layout from "../layout/Layout";
import Link from "next/link";

import GitHubIcon from "@material-ui/icons/GitHub";
import LinkedInIcon from "@material-ui/icons/LinkedIn";
import MailIcon from "@material-ui/icons/Mail";

import { useFetchUser } from "../lib/auth/user";

import "./index.scss";

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
        <span>CRUD Single Page Application</span> using{" "}
        <a href="https://reactjs.org/" target="_blank">
          React
        </a>{" "}
        and{" "}
        <a href="https://nextjs.org/" target="_blank">
          NextJS
        </a>{" "}
        to harness the power of <span>Server Side Rendering</span> and code
        splitting optimization.
      </p>
      <p>
        {" "}
        This Web App uses <span>MongoDB as database,</span> provided by{" "}
        <a href="https://www.mongodb.com/cloud/atlas" target="_blank">
          MongoDB Atlas
        </a>{" "}
        and makes use of the NextJS internal server to handle all requests and
        also features <span>Authentication</span> provided by{" "}
        <a href="https://auth0.com/" target="_blank">
          Auth0
        </a>
        .
      </p>
      <p>
        {" "}
        <span>State management</span> is done using{" "}
        <a href="https://redux.js.org/" target="_blank">
          Redux
        </a>{" "}
        and <span>CSS styles</span> are performed using{" "}
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
      </p>
      <div className="icons">
        <a
          href="https://www.linkedin.com/in/joaomiguelopesantos/"
          target="_blank"
        >
          <LinkedInIcon fontSize="medium" />
        </a>{" "}
        <a href="https://github.com/JoMiguelSantos" target="_blank">
          <GitHubIcon fontSize="medium" />
        </a>{" "}
        <a href="mailto:joaomsglds@gmail.com" target="_top">
          <MailIcon fontSize="medium" />
        </a>
      </div>
      <div className="link-back">
        <Link href="/applications">
          <a className="back-to-applications">Back to Applications</a>
        </Link>
      </div>
    </React.Fragment>
  );
  const content = (
    <div className="demo">{!user ? initialScreen : instructions}</div>
  );

  return (
    <Layout user={user} loading={loading}>
      {loading ? <div>Loading...</div> : content}
    </Layout>
  );
};

export default index;
