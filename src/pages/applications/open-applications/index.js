import Layout from "../../../layout/Layout";
import Application from "../../../components/Applications/Application";
import Form from "../../../components/Forms/Form";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import Spinner from "../../../components/Spinner/Spinner";

import { getApplications, postApplicationEntry } from "../../../store/actions";
import { newApplicationFormFields } from "../../../content/applications/forms";

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { useFetchUser } from "../../../lib/auth/user";
import withAuth from "../../../hoc/auth/withAuth";

import "./index.scss";

const OpenApplications = props => {
  const { user, loading } = useFetchUser({ required: true });
  const applications = useSelector(state =>
    state.applications.applications.filter(app => app.isOpen)
  );
  const activeSteps = useSelector(state => state.applications.activeSteps);
  const isLoading = useSelector(state => state.applications.fetching);
  const saving = useSelector(state => state.applications.saving);
  const dispatch = useDispatch();
  const [isNewApplication, setNewApplication] = useState(false);

  const applicationEntries = applications
    ? applications
        .map(app => (
          <Application
            key={app.entryId}
            application={app}
            activeStep={activeSteps[app.entryId]}
            isSaving={saving[app.entryId]}
          />
        ))
        .reverse()
    : null;

  // if user refreshes the page and loses the session, state will be empty
  // if so, trigger a side effect to populate the state from the DB
  useEffect(() => {
    applications.length === 0 && dispatch(getApplications());
    return;
  }, []);

  const onNewApplicationSubmitHandler = (formData, entryId, formId) => {
    let applicationStepData = {
      ...formData,
      formId: "application-submitted"
    };
    const applicationData = {
      isOpen: true,
      title: `${applicationStepData["company-name"]} | ${applicationStepData["job-title"]} | ${applicationStepData["location"]}`,
      steps: [applicationStepData]
    };
    dispatch(postApplicationEntry(applicationData));
    setNewApplication(false);
  };

  const addNewApplicationButton = (
    <div
      className="new_job_application"
      onClick={() => setNewApplication(true)}
    >
      <AddCircleIcon className="form__entry--add" fontSize="large" />
      <p className="new_job_application__label">New Job Application</p>
    </div>
  );

  const addNewApplicationForm = (
    <Form
      formFields={newApplicationFormFields}
      formId="application-submitted"
      entryId=""
      onNewApplicationFormSubmit={onNewApplicationSubmitHandler}
      onCancelClick={() => setNewApplication(false)}
    />
  );

  let content = (
    <React.Fragment>
      {/* if it's not in a new application state and it's not saving, 
    show the Button to add a new application */}
      {!isNewApplication &&
        !!saving &&
        !saving["new-application"] &&
        addNewApplicationButton}
      {/* if it's in a new application state, show the Form to add a new application */}
      {isNewApplication && addNewApplicationForm}
      {/* if it's not in a new application state but the application is saving, 
    show the Spinner */}
      {!!saving && saving["new-application"] && (
        <Spinner message="Saving changes..." />
      )}
      {applicationEntries}
    </React.Fragment>
  );

  const emptyState = (
    <React.Fragment>
      <div className="applications__empty-state">
        {" "}
        You currently have no open applications
      </div>
      {content}
    </React.Fragment>
  );

  if (
    (loading || (isLoading && isLoading["applications"])) &&
    !isNewApplication
  ) {
    content = <Spinner />;
  } else if (applications.length === 0) {
    content = emptyState;
  }

  return (
    <Layout user={user} loading={loading}>
      {content}
    </Layout>
  );
};

// get applications in DB using getInitialProps to fetch from the DB
OpenApplications.getInitialProps = ({ store, isServer }) => {
  const state = store.getState();
  // only fetch data if store is empty due to a manual refresh on the page
  // which renders server side and therefore doesn't have the user authenticated
  if (state.applications.applications.length === 0 && !isServer) {
    store.dispatch(getApplications());
  }
  return store;
};

export default withAuth(OpenApplications);
