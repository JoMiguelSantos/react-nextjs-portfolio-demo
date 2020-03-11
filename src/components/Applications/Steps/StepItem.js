import SavedEntry from "../../Forms/SavedEntry";
import Form from "../../Forms/Form";

import stepsList from "../../../content/applications/forms";
import {
  putApplicationStep,
  deleteApplicationStep,
  patchApplicationEntry
} from "../../../store/actions";

import { useState } from "react";
import { useDispatch } from "react-redux";

import "./Step.scss";

const StepItem = ({ step, entryId, isOpen }) => {
  const dispatch = useDispatch();
  const [isEditStep, setEditStep] = useState(false);

  const onEditStepSubmitHandler = (formData, entryId, formId) => {
    if (formId === "application-submitted") {
      let applicationStepData = {
        ...formData,
        formId: "application-submitted"
      };

      let applicationData = {
        isOpen: isOpen,
        entryId: entryId,
        title: `${formData["company-name"]} | ${formData["job-title"]} | ${formData["location"]}`,
        steps: [applicationStepData]
      };

      dispatch(patchApplicationEntry(applicationData));
    } else {
      dispatch(
        putApplicationStep({
          ...formData,
          formId: formId,
          entryId: entryId
        })
      );
    }
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
      onEditStepFormSubmit={onEditStepSubmitHandler}
      onCancelClick={() => setEditStep(false)}
    />
  );

  const onDeleteStepHandler = (entryId, formId) => {
    dispatch(deleteApplicationStep(entryId, formId));
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

export default StepItem;
