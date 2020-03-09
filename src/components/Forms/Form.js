// https://react-hook-form.com
import { useForm } from "react-hook-form";
import { capitalize } from "../../js.utils";
import { connect } from "react-redux";

// https://material-ui.com/components/material-icons/#material-icons
import WarningIcon from "@material-ui/icons/Warning";

import "./Form.scss";

//ToDo
// validate all inputs with sensible validations for dates, numbers, etc
// create currency for salary input, most likely through a custom element with a select element for the currency
// and a number input that later will be merged when it's relevant
// find out how to integrate Select elements in react-hook-form in this script

const Input = ({
  label,
  type,
  register,
  required,
  htmlFor,
  min,
  max,
  placeholder,
  minLength,
  step,
  defaultValue
}) => {
  return (
    <React.Fragment>
      <label htmlFor={htmlFor}>{capitalize(label)}</label>
      {
        <input
          name={label}
          id={label}
          ref={register({ required })}
          type={type}
          min={min}
          max={max}
          placeholder={placeholder}
          minLength={minLength}
          step={step}
          defaultValue={defaultValue}
        />
      }
    </React.Fragment>
  );
};

const TextArea = ({
  label,
  register,
  required,
  htmlFor,
  placeholder,
  minLength,
  defaultValue
}) => (
  <React.Fragment>
    <label htmlFor={htmlFor}>{capitalize(label)}</label>
    <textarea
      name={label}
      id={label}
      ref={register({ required })}
      placeholder={placeholder}
      minLength={minLength}
      defaultValue={defaultValue}
    />
  </React.Fragment>
);

export const form = props => {
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    if (props.onEditStepFormSubmit) {
      props.onEditStepFormSubmit(data, props.entryId, props.formId);
    } else if (props.onNewStepFormSubmit) {
      props.onNewStepFormSubmit(data, props.entryId, props.formId);
    } else if (props.onNewApplicationFormSubmit) {
      props.onNewApplicationFormSubmit(data, props.entryId);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit(onSubmit)}>
      {props.formFields.map((input, index) => (
        <div className="form__box">
          {input.type === "text-area" ? (
            <TextArea
              key={input.name}
              htmlFor={input.name}
              label={input.name}
              register={register}
              required={input.required}
              className="form__text-area"
              placeholder={input.placeholder}
              minLength={input.minLength}
              defaultValue={
                props.formValues ? props.formValues[input.name] : ""
              }
            />
          ) : (
            <Input
              key={input.name}
              htmlFor={input.name}
              label={input.name}
              register={register}
              required={input.required}
              type={input.type}
              className="form__input"
              min={input.min}
              max={input.max}
              placeholder={input.placeholder}
              minLength={input.minLength}
              step={input.step}
              defaultValue={
                props.formValues ? props.formValues[input.name] : ""
              }
            />
          )}
          {/* this will show the error customized message once a user tries to submit and validation fails */}
          {errors[input.name] && (
            <span className="form__error--message">
              <WarningIcon className="form__error--icon" fontSize="small" />
              {input.errorMessage
                ? input.errorMessage
                : "This field is required"}
            </span>
          )}
        </div>
      ))}
      <button className="form__btn--submit" type="submit">
        Save
      </button>
      <button className="form__btn--cancel" onClick={props.onCancelClick}>
        Cancel
      </button>
    </form>
  );
};

export default connect()(form);
