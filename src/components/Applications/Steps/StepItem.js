import SavedEntry from "../../Forms/SavedEntry";
import Form from "../../Forms/Form";

import {
  newPhoneScreeningFormFields,
  newPhoneInterviewFormFields,
  newOnSiteInterviewFormFields,
  newTechnicalTestFormFields,
  newJobOfferFormFields,
  newApplicationFormFields
} from "../../../content/applications/forms";
import {
  editApplicationStep,
  removeApplicationStep,
  editApplicationEntry,
  activeStep
} from "../../../store/actions/main";
import {
  upsertApplicationStep,
  deleteApplicationStep,
  upsertApplication
} from "../../../database/applications";

import { connect, batch } from "react-redux";
import { useState } from "react";

import "./Step.scss";

const StepItem = ({
  step,
  entryId,
  isOpen,
  setAppLoading,
  applications,
  dispatch
}) => {
  const [isEditStep, setEditStep] = useState(false);

  // export this from steps perhaps to both App and StepItem
  let stepsList = {
    "application-submitted": newApplicationFormFields,
    "phone-screening": newPhoneScreeningFormFields,
    "phone-interview": newPhoneInterviewFormFields,
    "onsite-interview": newOnSiteInterviewFormFields,
    "technical-test": newTechnicalTestFormFields,
    "job-offer": newJobOfferFormFields
  };

  // EDIT STEP SUBMIT
  const onEditStepFormSubmit = async (formData, entryId, formId) => {
    setAppLoading(true);
    if (formId === "application-submitted") {
      let applicationStepData = {
        ...formData,
        formId: "application-submitted"
      };

      const applicationToEdit =
        applications && applications.filter(app => app.entryId === entryId)[0];

      let applicationData = {
        isOpen: isOpen,
        entryId: entryId,
        title: `${formData["company-name"]} | ${formData["job-title"]} | ${formData["location"]}`,
        steps:
          applicationToEdit.steps &&
          applicationToEdit.steps.map(appStep => {
            if (appStep.formId === formId) {
              return applicationStepData;
            }
            return appStep;
          })
      };

      await upsertApplication(applicationData);
      await dispatch(editApplicationEntry(applicationData));
    } else {
      await upsertApplicationStep(formData, entryId, formId);
      await dispatch(
        editApplicationStep({
          ...formData,
          formId: formId,
          entryId: entryId
        })
      );
    }
    setAppLoading(false);
    setEditStep(false);
  };

  // this filters the values of the current step being edited
  // and the keys from the current form and creates a prefilled form values
  const allowedKeys = stepsList[step.formId].map(field => field.name);
  const formValues = Object.keys(step)
    .filter(key => allowedKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = step[key];
      return obj;
    }, {});

  const editStepForm = isEditStep && (
    <Form
      formFields={stepsList[step.formId]}
      formValues={formValues}
      formId={step.formId}
      entryId={entryId}
      onEditStepFormSubmit={onEditStepFormSubmit}
      onCancelClick={() => setEditStep(false)}
    />
  );

  const onDeleteStepHandler = async (entryId, formId) => {
    setAppLoading(true);
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
      lastStep && dispatch(activeStep({ [entryId]: lastStep.formId }));
      // remove the step from the application in the store
      dispatch(
        removeApplicationStep({
          entryId: entryId,
          formId: formId
        })
      );
    });
    setAppLoading(false);
  };

  const savedEntry = (
    <div className="application__steps--items">
      <SavedEntry
        {...step}
        entryId={entryId}
        onDeleteClick={() => onDeleteStepHandler(entryId, step.formId)}
        onEditClick={() => {
          setEditStep(true);
        }}
        pageIdentifier="applications"
      />
    </div>
  );

  return (isEditStep && editStepForm) || (!isEditStep && savedEntry);
};

const mapStateToProps = state => {
  return {
    applications: state.applications.applications
  };
};

export default connect(mapStateToProps, null)(StepItem);
