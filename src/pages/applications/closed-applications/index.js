import Layout from "../../../layout/Layout";
import Application from "../../../components/Applications/Application";
import Spinner from "../../../components/Spinner/Spinner";

import { getApplications } from "../../../store/actions";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFetchUser } from "../../../lib/auth/user";
import withAuth from "../../../hoc/auth/withAuth";

import "./index.scss";

const ClosedApplications = props => {
  const isLoading = useSelector(state => state.applications.fetching);
  const saving = useSelector(state => state.applications.saving);
  const activeSteps = useSelector(state => state.applications.activeSteps);
  const applications = useSelector(state =>
    state.applications.applications.filter(app => !app.isOpen)
  );
  const dispatch = useDispatch();
  const { user, loading } = useFetchUser({ required: true });

  const applicationEntries = applications
    ? applications.map(app => (
        <Application
          application={app}
          isSaving={saving[app.entryId]}
          activeStep={activeSteps[app.entryId]}
        />
      ))
    : null;

  // if user refreshes the page and loses the session, state will be empty
  // if so, trigger a side effect to populate the state from the DB
  useEffect(() => {
    applications.length === 0 && dispatch(getApplications());
    return;
  }, []);

  const content = (
    <React.Fragment>
      {applicationEntries.length > 0 ? (
        applicationEntries
      ) : (
        <p className="applications__empty-state">
          You currently have no closed applications
        </p>
      )}
    </React.Fragment>
  );

  return (
    <Layout user={user} loading={loading}>
      {loading || (isLoading && isLoading["applications"]) ? (
        <Spinner />
      ) : (
        content
      )}
    </Layout>
  );
};

// get applications in DB using getInitialProps to fetch from the DB
ClosedApplications.getInitialProps = async ({ store, isServer }) => {
  const state = store.getState();
  // only fetch data if store is empty
  if (state.applications.applications.length === 0 && !isServer) {
    // populate state with all applications from DB
    store.dispatch(getApplications());
  }
  return store;
};

export default withAuth(ClosedApplications);
