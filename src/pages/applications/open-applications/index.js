import Layout from "../../../layout/Layout";
import Application from "../../../components/Applications/Application";
import Form from "../../../components/Forms/Form";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Spinner from "../../../components/Spinner/Spinner";

import {
  newApplicationEntry,
  activeStep,
  populateApplicationsState
} from "../../../store/actions/main";
import { newApplicationFormFields } from "../../../content/applications/forms";
import {
  upsertApplication,
  getApplications
} from "../../../database/applications";

import auth0 from "../../../lib/auth/auth0";
import { connect, batch } from "react-redux";
import { useState, useEffect } from "react";
import { useFetchUser } from "../../../lib/auth/user";
import withAuth from "../../../container/auth/withAuth";

import "./index.scss";

const OpenApplications = props => {
  const { user, loading } = useFetchUser({ required: true });
  const [isNewApplication, setNewApplication] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isEmpty, setEmpty] = useState(false);

  const onNewApplicationFormSubmit = async (formData, entryId) => {
    let applicationStepData = {
      ...formData,
      formId: "application-submitted"
    };

    let applicationData = {
      isOpen: true,
      title: `${applicationStepData["company-name"]} | ${applicationStepData["job-title"]} | ${applicationStepData["location"]}`,
      steps: [applicationStepData]
    };

    // save application in applications collection and get ID from DB to replace entryId
    const upsertedApplication = await upsertApplication(applicationData);

    batch(() => {
      // define initial step as active step
      props.dispatch(
        activeStep({ [upsertedApplication._id]: "application-submitted" })
      );
      // create new application in store
      props.dispatch(newApplicationEntry(upsertedApplication));
    });

    setNewApplication(false);
    if (isEmpty) setEmpty(false);
  };

  const applicationEntries = props.applications
    ? props.applications.map(app => (
        <Application key={app.entryId} application={app} />
      ))
    : null;

  // if user refreshes the page and loses the session, state will be empty
  // if so, trigger a side effect to populate the state from the DB
  useEffect(() => {
    const populateState = async () => {
      const stateDB = await getApplications();

      if (stateDB.length === 0) setEmpty(true);

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

  let content = (
    <React.Fragment>
      {applicationEntries}
      {!isNewApplication && (
        <div
          className="new_job_application"
          onClick={() => setNewApplication(true)}
        >
          <AddCircleIcon className="form__entry--add" fontSize="large" />
          <p className="new_job_application__label">New Job Application</p>
        </div>
      )}
      {isNewApplication && (
        <Form
          formFields={newApplicationFormFields}
          formId="application-submitted"
          entryId=""
          onNewApplicationFormSubmit={(formData, entryId) =>
            onNewApplicationFormSubmit(formData, entryId)
          }
          onCancelClick={() => setNewApplication(false)}
        />
      )}
    </React.Fragment>
  );

  if (loading || isLoading) {
    content = <Spinner />;
  } else if (isEmpty) {
    content = (
      <React.Fragment>
        <div className="applications__empty-state">
          {" "}
          Create your first application
        </div>
        {content}
      </React.Fragment>
    );
  }

  return (
    <Layout user={user} loading={loading}>
      {content}
    </Layout>
  );
};

const mapStateToProps = state => {
  return {
    //props.applications: state/reducer/key
    applications: state.applications.applications.filter(app => app.isOpen)
  };
};

// get applications in DB using getInitialProps to fetch from the DB
OpenApplications.getInitialProps = async ({ store, isServer }) => {
  const state = store.getState();
  // only fetch data if store is empty due to a manual refresh on the page
  // which renders server side and therefore doesn't have the user authenticated
  if (state.applications.applications.length === 0 && !isServer) {
    const stateDB = await getApplications();

    // populate state with all applications from DB
    await store.dispatch(populateApplicationsState(stateDB));
  }
  return store;
};

export default connect(mapStateToProps, null)(withAuth(OpenApplications));
