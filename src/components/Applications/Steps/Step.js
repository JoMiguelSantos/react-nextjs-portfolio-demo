import { capitalize } from "../../../js.utils";
import { useDispatch } from "react-redux";
import { activeStep } from "../../../store/actions";

import "./StepItem.scss";

const Step = ({ isActive, entryId, step }) => {
  const dispatch = useDispatch();

  const clickHandler = (e, step) => {
    // set active step on state for specific entryId
    dispatch(activeStep({ [entryId]: step }));
  };

  return (
    <div
      className={`application__step ${step} ${isActive ? "active" : ""}`}
      onClick={e => clickHandler(e, step)}
    >
      {capitalize(step)}
    </div>
  );
};

export default Step;
