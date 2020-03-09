import Layout from "../../layout/Layout";

import { useFetchUser } from "../../lib/auth/user";
import React, { useEffect } from "react";
import { connect } from "react-redux";

import { getApplications } from "../../store/actions";

import withAuth from "../../hoc/auth/withAuth";

import "./index.scss";

const Applications = ({ openApplications, closedApplications, dispatch }) => {
  const { user, loading } = useFetchUser({ required: true });

  // create or update user profile in the DB
  useEffect(() => {
    fetch("/api/db/applications/updateUserProfile");
  }, [user]);

  // if user refreshes the page and loses the session, state will be empty
  // if so, trigger a side effect to populate the state from the DB
  useEffect(() => {
    if (openApplications.length === 0 && closedApplications.length === 0) {
      dispatch(getApplications());
    }
    return;
  }, []);

  return (
    <Layout user={user} loading={loading}>
      <div className="introduction">
        <h4>{`Welcome ${
          user && "given_name" in user ? user.given_name : "Stranger"
        }`}</h4>
        <p>
          {" "}
          {`This is your applications space. You have currently ${openApplications.length} open job applications and ${closedApplications.length} closed job applications.`}
        </p>
        <p>
          {" "}
          You can hover over all navigation menu items but you can only switch
          page to either "Closed Applications" or "Open Applications" in this
          demo. These pages will be fully operational and whatever applications
          you create will only be accessible to you.
        </p>
        <p>
          {" "}
          If something is not behaving as expected or you found a bug, I'm sorry
          for the bad user experience and please{" "}
          <a
            className="mail-me"
            href="mailto:joaomsglds@gmail.com?Subject=Bug%20Alert"
            target="_top"
          >
            report to me by email
          </a>
          .
        </p>
      </div>
    </Layout>
  );
};

// get applications in DB using getInitialProps to fetch from the DB
Applications.getInitialProps = ({ store, isServer }) => {
  const state = store.getState();
  // only fetch data if store is empty due to a manual refresh on the page
  // which renders server side and therefore doesn't have the user authenticated
  if (state.applications.applications.length === 0 && !isServer) {
    // populate state with all applications from DB
    store.dispatch(getApplications());
  }
  return store;
};

const mapStateToProps = state => {
  return {
    //props.applications: state/reducer/key
    openApplications: state.applications.applications.filter(app => app.isOpen),
    closedApplications: state.applications.applications.filter(
      app => !app.isOpen
    )
  };
};

export default connect(mapStateToProps, null)(withAuth(Applications));
