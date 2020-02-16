import { capitalize } from "../../../js.utils";
import { connect } from "react-redux";
import { activeStep } from "../../../store/actions/main";

import "./StepItem.scss";

const Step = props => {
  const clickHandler = (e, step) => {
    // set active step on state for specific entryId
    props.dispatch(activeStep({ [props.entryId]: step }));
  };

  const isActive = () => {
    return props.activeSteps[props.entryId] === props.step;
  };

  return (
    <div
      className={`application__step ${props.step} ${
        isActive() ? "active" : ""
      }`}
      onClick={e => clickHandler(e, props.step)}
    >
      {capitalize(props.step)}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeSteps: state.applications.activeSteps
  };
};

export default connect(mapStateToProps, null)(Step);
