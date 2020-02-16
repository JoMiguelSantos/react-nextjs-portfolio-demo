import Step from "../../components/Applications/Steps/Step";
import StepItem from "./Steps/StepItem";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import Spinner from "../Spinner/Spinner";

import {
  newPhoneScreeningFormFields,
  newPhoneInterviewFormFields,
  newOnSiteInterviewFormFields,
  newTechnicalTestFormFields,
  newJobOfferFormFields,
  newApplicationFormFields
} from "../../content/applications/forms";
import Form from "../../components/Forms/Form";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import {
  newApplicationStep,
  editApplicationEntry,
  closeApplicationEntry,
  removeApplicationEntry,
  activeStep
} from "../../store/actions/main";
import {
  upsertApplicationStep,
  upsertApplication,
  deleteApplication
} from "../../database/applications";
import { connect, batch } from "react-redux";
import { useState } from "react";

import { capitalize } from "../../js.utils";

import "./Application.scss";

const Application = props => {
  const [isNewStep, setNewStep] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [currentFormId, setCurrentFormId] = useState();
  const [isRemoveApplication, setRemoveApplication] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const applications = props.applications;

  //STEPS
  // this is the list of steps available to choose from in the beginning
  const stepsList = {
    "application-submitted": newApplicationFormFields,
    "phone-screening": newPhoneScreeningFormFields,
    "phone-interview": newPhoneInterviewFormFields,
    "onsite-interview": newOnSiteInterviewFormFields,
    "technical-test": newTechnicalTestFormFields,
    "job-offer": newJobOfferFormFields
  };

  // this will store the current steps of each application
  let stepsAppList = [];

  // this will contain the steps that will be displayed next to the name of the application
  const steps = [];
  // unwrapping state/db steps
  applications &&
    applications.map(application => {
      if (application.entryId === props.application.entryId) {
        // get the steps that are stored inside a steps array
        application.steps &&
          application.steps.map(step => {
            steps.push(
              <Step
                step={step.formId}
                key={step.formId}
                entryId={props.application.entryId}
              />
            );
            // getting the already present steps to avoid repetitive steps
            stepsAppList.push(step.formId);
          });
      }
    });

  // excludes already created steps and displays the remaining available
  const filteredStepsList = Object.keys(stepsList).filter(
    step => !stepsAppList.includes(step)
  );

  //// NEW STEPS MENU
  const onNewStepHandler = (e, step) => {
    // this if prevents a click on the "+" Icon of triggering an error
    if (step) {
      setCurrentFormId(step);
      setIsShown(false);
      setNewStep(true);
    }
  };

  const addNewStepList = filteredStepsList.map(step => {
    return (
      <p
        className="steps__list--item"
        key={step}
        onClick={e => onNewStepHandler(e, step)}
      >
        {capitalize(step)}
      </p>
    );
  });

  // NEW STEP SUBMIT
  const onNewStepFormSubmit = async (formData, entryId, formId) => {
    setLoading(true);
    if (formId === "application-submitted") {
      const currentSteps = applications.filter(
        app => app.entryId === entryId
      )[0].steps;

      let applicationStepData = {
        ...formData,
        formId: "application-submitted"
      };

      let applicationData = {
        isOpen: props.application.isOpen,
        entryId: entryId,
        title: `${formData["company-name"]}  |  ${formData["job-title"]}  |  ${formData["location"]}`,
        steps: [applicationStepData, ...currentSteps]
      };
      await upsertApplication(applicationData);
      batch(() => {
        props.dispatch(activeStep({ [entryId]: formId }));
        props.dispatch(editApplicationEntry(applicationData));
      });
    } else {
      await upsertApplicationStep(formData, entryId, formId);
      // add step to application in applications collection in DB using the entryId
      batch(() => {
        props.dispatch(activeStep({ [entryId]: formId }));
        props.dispatch(
          newApplicationStep({
            ...formData,
            formId: formId,
            entryId: entryId
          })
        );
      });
    }
    setLoading(false);
    setNewStep(false);
  };

  const newStepForm = (
    <Form
      formFields={stepsList[currentFormId]}
      formId={currentFormId}
      entryId={props.application.entryId}
      onNewStepFormSubmit={onNewStepFormSubmit}
      onCancelClick={() => setNewStep(false)}
    />
  );

  // this will check if the current active step in each application is the same as being evaluated
  const applicationStepActive = (step, entryId) => {
    return step.formId === props.activeSteps[entryId];
  };

  // this will render only the stepItems for the active step
  const stepItems =
    applications &&
    applications.map(application => {
      if (application.entryId === props.application.entryId) {
        const step =
          application.steps &&
          application.steps.map(step => {
            if (applicationStepActive(step, application.entryId)) {
              return (
                <StepItem
                  step={step}
                  entryId={application.entryId}
                  isOpen={application.isOpen}
                  key={step.formId}
                  setAppLoading={setLoading}
                />
              );
            }
          });
        return step;
      }
    });

  const onDeleteApplicationHandler = async entryId => {
    setLoading(true);
    await deleteApplication(entryId);
    await props.dispatch(removeApplicationEntry({ entryId }));
    setLoading(false);
  };

  const removeApp = (
    <div
      className="remove-application"
      onClick={() => {
        onDeleteApplicationHandler(props.application.entryId);
      }}
    >
      <DeleteIcon /> Remove Application
    </div>
  );

  const onAppStatusChangeHandler = async entryId => {
    setLoading(true);
    const applicationCloseData = {
      isOpen: !props.application.isOpen,
      entryId: entryId
    };
    await upsertApplication(applicationCloseData);
    await props.dispatch(closeApplicationEntry(applicationCloseData));
    setLoading(false);
  };

  const appStatusChange = (
    <div
      className="app-status-change"
      onClick={() => {
        onAppStatusChangeHandler(props.application.entryId);
      }}
    >
      <ArchiveIcon />{" "}
      {props.application.isOpen ? "Close Application" : "Re-open Application"}
    </div>
  );

  const content = (
    <div className="application">
      <div className="application__steps--container">
        <h2
          className="application__header"
          onMouseEnter={() => setRemoveApplication(true)}
          onMouseLeave={() => setRemoveApplication(false)}
          onClick={() => setRemoveApplication(!isRemoveApplication)}
        >
          {isRemoveApplication
            ? [removeApp, appStatusChange]
            : props.application.title}
        </h2>
        <div className="steps">
          <h3 className="application__steps">{steps}</h3>
          {!isNewStep && addNewStepList.length > 0 && props.application.isOpen && (
            <div
              className="application__new-step"
              onMouseEnter={() => setIsShown(true)}
              onMouseLeave={() => setIsShown(false)}
              onClick={() => setIsShown(!isShown)}
            >
              <AddCircleIcon className="form__entry--add" fontSize="large" />
              {!isShown && (
                <p className="application__new-step--label">New Step</p>
              )}
              {isShown && <div className="steps__list">{addNewStepList}</div>}
            </div>
          )}
        </div>
      </div>
      <div className="application__display">
        {isNewStep && newStepForm}
        {!isNewStep && stepItems}
      </div>
    </div>
  );

  return isLoading ? <Spinner message="Saving changes..." /> : content;
};

const mapStateToProps = state => {
  return {
    applications: state.applications.applications,
    activeSteps: state.applications.activeSteps
  };
};

export default connect(mapStateToProps, null)(Application);
