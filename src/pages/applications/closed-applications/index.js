import Layout from "../../../layout/Layout";
import Application from "../../../components/Applications/Application";
import Spinner from "../../../components/Spinner/Spinner";

import { populateApplicationsState } from "../../../store/actions/main";
import { getApplications } from "../../../database/applications";

import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useFetchUser } from "../../../lib/auth/user";

import "./index.scss";

const ClosedApplications = props => {
  const [isLoading, setLoading] = useState(true);
  const { user, loading } = useFetchUser({ required: true });

  const applicationEntries = props.applications
    ? props.applications.map(app => <Application application={app} />)
    : null;

  // if user refreshes the page and loses the session, state will be empty
  // if so, trigger a side effect to populate the state from the DB
  useEffect(() => {
    const populateState = async () => {
      const stateDB = await getApplications();

      // populate state with all applications from DB
      await props.dispatch(populateApplicationsState(stateDB));
      setLoading(false);
    };
    if (props.applications.length === 0) {
      populateState();
    } else {
      setLoading(false);
    }
    return;
  }, []);

  const content = (
    <React.Fragment>
      {applicationEntries ? (
        applicationEntries
      ) : (
        <p>You currently have no closed applications</p>
      )}
    </React.Fragment>
  );

  return (
    <Layout user={user} loading={loading}>
      {loading || isLoading ? <Spinner /> : content}
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    applications: state.applications.applications.filter(app => !app.isOpen)
  };
};

// get applications in DB using getInitialProps to fetch from the DB
ClosedApplications.getInitialProps = async ({ store, isServer }) => {
  const state = store.getState();
  // only fetch data if store is empty
  if (state.applications.applications.length === 0 && !isServer) {
    const stateDB = await getApplications();

    // populate state with all applications from DB
    await store.dispatch(populateApplicationsState(stateDB));
  }
  return store;
};

export default connect(mapStateToProps, null)(ClosedApplications);
