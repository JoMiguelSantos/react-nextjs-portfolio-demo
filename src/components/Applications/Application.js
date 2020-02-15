import Step from "../../components/Applications/Steps/Step";
import SavedEntry from "../Forms/SavedEntry";
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
  editApplicationStep,
  removeApplicationStep,
  editApplicationEntry,
  closeApplicationEntry,
  removeApplicationEntry,
  activeStep
} from "../../store/actions/main";
import {
  deleteApplicationStep,
  upsertApplicationStep,
  upsertApplication,
  deleteApplication
} from "../../database/applications";
import { connect, batch } from "react-redux";
import { useState, useEffect } from "react";

import { capitalize } from "../../js.utils";

import "./Application.scss";

//ToDo
// add tooltip to explain the different steps definitions like the difference between
// a phone screening and a phone interview

const Application = props => {
  const [isNewStep, setNewStep] = useState(false);
  const [isEditStep, setEditStep] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [currentFormId, setCurrentFormId] = useState();
  const [currentStep, setCurrentStep] = useState();
  const [isRemoveApplication, setRemoveApplication] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const applications = props.applications;

  //STEPS
  // this is the list of steps available to choose from in the beginning
  let stepsList = {
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
              <Step step={step.formId} key={step.formId} entryId={props.application.entryId} />
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

  //// EDIT STEPS MENU

  // EDIT STEP SUBMIT
  const onEditStepFormSubmit = async (formData, entryId, formId) => {
    setLoading(true);
    if (formId === "application-submitted") {
      let applicationStepData = {
        ...formData,
        formId: "application-submitted"
      };

      const applicationToEdit =
        applications && applications.filter(app => app.entryId === entryId)[0];

      let applicationData = {
        isOpen: props.application.isOpen,
        entryId: entryId,
        title: `${formData["company-name"]} | ${formData["job-title"]} | ${formData["location"]}`,
        steps:
          applicationToEdit.steps &&
          applicationToEdit.steps.map(step => {
            if (step.formId === formId) {
              return applicationStepData;
            }
            return step;
          })
      };

      await upsertApplication(applicationData);
      await props.dispatch(editApplicationEntry(applicationData));
    } else {
      await upsertApplicationStep(formData, entryId, formId);
      await props.dispatch(
        editApplicationStep({
          ...formData,
          formId: formId,
          entryId: entryId
        })
      );
    }
    setLoading(false);
    setEditStep(false);
  };

  const onEditStepHandler = (entryId, formId, step) => {
    setCurrentFormId(formId);
    setEditStep(true);
    setCurrentStep(step);
  };

  // this filters the values of the current step being edited
  // and the keys from the current form and creates a prefilled form values
  const allowedKeys =
    currentFormId && stepsList[currentFormId].map(field => field.name);
  const formValues =
    currentStep &&
    Object.keys(currentStep)
      .filter(key => allowedKeys.includes(key))
      .reduce((obj, key) => {
        obj[key] = currentStep[key];
        return obj;
      }, {});

  const editStepForm = isEditStep && (
    <Form
      formFields={stepsList[currentFormId]}
      formValues={formValues}
      formId={currentFormId}
      entryId={props.application.entryId}
      onEditStepFormSubmit={onEditStepFormSubmit}
      onCancelClick={() => setEditStep(false)}
    />
  );

  // STEP ITEMS
  const onDeleteStepHandler = async (entryId, formId) => {
    setLoading(true);
    // remove step from application in DB
    await deleteApplicationStep(entryId, formId);

    // select the last step that isn't the deleted one (state is still the old one at this point)
    const lastStep =
      applications.filter(el => el.entryId === entryId)[0].steps &&
      applications
        .filter(el => el.entryId === entryId)[0]
        .steps.filter(el => el.formId !== formId)
        .slice(-1)[0];

    // dispatches both actions at the same time
    batch(() => {
      // turn the last step active
      lastStep && props.dispatch(activeStep({ [entryId]: lastStep.formId }));
      // remove the step from the application in the store
      props.dispatch(
        removeApplicationStep({
          entryId: entryId,
          formId: formId
        })
      );
    });
    setLoading(false);
  };

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
                <SavedEntry
                  {...step}
                  entryId={application.entryId}
                  key={step.formId}
                  onDeleteClick={() =>
                    onDeleteStepHandler(application.entryId, step.formId)
                  }
                  onEditClick={() => {
                    onEditStepHandler(application.entryId, step.formId, step);
                  }}
                  pageIdentifier="applications"
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
        {isEditStep && editStepForm}
        {!isNewStep && !isEditStep && (
          <div className="application__steps--items">{stepItems}</div>
        )}
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
