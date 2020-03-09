import Step from "../../components/Applications/Steps/Step";
import StepItem from "./Steps/StepItem";
import DeleteIcon from "@material-ui/icons/Delete";
import ArchiveIcon from "@material-ui/icons/Archive";
import Spinner from "../Spinner/Spinner";

import stepsList from "../../content/applications/forms";
import Form from "../../components/Forms/Form";
import AddCircleIcon from "@material-ui/icons/AddCircle";

import {
  patchApplicationEntry,
  postApplicationStep,
  patchApplicationStatus,
  deleteApplicationEntry
} from "../../store/actions";

import { useDispatch } from "react-redux";
import { useState } from "react";

import { capitalize } from "../../js.utils";

import "./Application.scss";

const Application = ({ application, activeStep, isSaving, closedDate }) => {
  const [isNewStep, setNewStep] = useState(false);
  const [isShown, setIsShown] = useState(false);
  const [currentFormId, setCurrentFormId] = useState();
  const [isEditApplication, setEditApplication] = useState(false);
  const dispatch = useDispatch();

  //STEPS

  // this will contain the steps that will be displayed next to the name of the application
  const steps =
    // get the steps that are stored inside a steps array
    application.steps &&
    application.steps.map(step => {
      return (
        <Step
          step={step.formId}
          key={step.formId}
          entryId={application.entryId}
          isActive={activeStep === step.formId}
        />
      );
    });

  // excludes already created steps and displays the remaining available
  const filteredStepsList = Object.keys(stepsList).filter(
    stepName => !application.steps.map(step => step.formId).includes(stepName)
  );

  //// NEW STEPS MENU
  // NEW STEPS LIST
  const addNewStepList = filteredStepsList.map(step => {
    return (
      <p
        className="steps__list--item"
        key={step}
        onClick={e => onNewStepClickHandler(e, step)}
      >
        {capitalize(step)}
      </p>
    );
  });

  // NEW STEP CLICK HANDLER
  const onNewStepClickHandler = (e, step) => {
    // this if prevents a click on the "+" Icon of triggering an error
    if (step) {
      setCurrentFormId(step);
      setIsShown(false);
      setNewStep(true);
    }
  };

  // NEW STEP SUBMIT
  const onNewStepFormSubmitHandler = (formData, entryId, formId) => {
    if (formId === "application-submitted") {
      let applicationStepData = {
        ...formData,
        formId: "application-submitted"
      };

      let applicationData = {
        isOpen: application.isOpen,
        entryId: entryId,
        title: `${formData["company-name"]}  |  ${formData["job-title"]}  |  ${formData["location"]}`,
        steps: [applicationStepData, ...application.steps]
      };

      dispatch(patchApplicationEntry(applicationData));
    } else {
      dispatch(postApplicationStep(formData, entryId, formId));
    }
    setNewStep(false);
  };

  const newStepForm = (
    <Form
      formFields={stepsList[currentFormId]}
      formId={currentFormId}
      entryId={application.entryId}
      onNewStepFormSubmit={onNewStepFormSubmitHandler}
      onCancelClick={() => setNewStep(false)}
    />
  );

  // this will render only the stepItems for the active step
  const stepItems =
    application.steps &&
    application.steps.map(step => {
      if (step.formId === activeStep) {
        return (
          <StepItem
            step={step}
            entryId={application.entryId}
            isOpen={application.isOpen}
            key={step.formId}
          />
        );
      }
    });

  const onDeleteApplicationHandler = entryId => {
    dispatch(deleteApplicationEntry(entryId));
  };

  const removeApp = (
    <div
      className="remove-application"
      onClick={() => {
        onDeleteApplicationHandler(application.entryId);
      }}
    >
      <DeleteIcon /> Remove Application
    </div>
  );

  // close if open or re open if closed
  const onToggleAppStatusClickHandler = () => {
    const applicationStatusData = {
      isOpen: !application.isOpen,
      entryId: application.entryId,
      closedDate: application.isOpen ? new Date() : application.closedDate
    };
    dispatch(patchApplicationStatus(applicationStatusData));
  };

  const toggleAppStatus = (
    <div
      className="toggle-app-status"
      onClick={() => {
        onToggleAppStatusClickHandler();
      }}
    >
      <ArchiveIcon />{" "}
      {application.isOpen ? "Close Application" : "Re-open Application"}
    </div>
  );

  console.log(!!closedDate, application);

  const content = (
    <div className="application">
      <div className="application__steps--container">
        <h2
          className="application__header"
          onMouseEnter={() => setEditApplication(true)}
          onMouseLeave={() => setEditApplication(false)}
          onClick={() => setEditApplication(!isEditApplication)}
        >
          {isEditApplication ? [removeApp, toggleAppStatus] : application.title}
        </h2>
        <div className="steps">
          <h3 className="application__steps">{steps}</h3>
          {!!closedDate && (
            <p className="application__closed-date">{`Closed Date: ${closedDate}`}</p>
          )}
          {!isNewStep && addNewStepList.length > 0 && application.isOpen && (
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

  return isSaving ? <Spinner message="Saving changes..." /> : content;
};

export default Application;
