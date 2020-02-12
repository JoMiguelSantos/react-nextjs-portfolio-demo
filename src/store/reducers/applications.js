import { updateObject } from "../../js.utils";
import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  applications: [],
  activeSteps: {}
};

const newApplicationEntry = (state, action) => {
  const { _id, ...rest } = action.payload;

  const application = {
    entryId: _id,
    ...rest
  };

  return updateObject(state, {
    applications: state.applications.concat(application)
  });
};

const editApplicationEntry = (state, action) => {
  return updateObject(state, {
    applications: state.applications.map(app => {
      if (app.entryId === action.payload.entryId) {
        return action.payload;
      }
      return app;
    })
  });
};

const closeApplicationEntry = (state, action) => {
  return updateObject(state, {
    applications: state.applications.map(app => {
      if (app.entryId === action.payload.entryId) {
        return { ...app, isOpen: action.payload.isOpen };
      }
      return app;
    })
  });
};

const removeApplicationEntry = (state, action) => {
  return updateObject(state, {
    applications: state.applications.filter(app => {
      return app.entryId !== action.payload.entryId;
    })
  });
};

const newApplicationStep = (state, action) => {
  const updatedState = state.applications.map(application => {
    // Find the item with the matching id
    if (application.entryId === action.payload.entryId) {
      // remove unnecessary entryId from step
      delete action.payload.entryId;
      // Return a new object
      return {
        ...application, // copy the existing item
        steps: application.steps.concat(action.payload) // add the step to the list of steps
      };
    }
    // Leave every other item unchanged
    return application;
  });

  return updateObject(state, {
    applications: updatedState
  });
};

const editApplicationStep = (state, action) => {
  const updatedState = state.applications.map(application => {
    // Find the item with the matching id
    if (application.entryId === action.payload.entryId) {
      // Return a new object
      return {
        ...application,
        steps: application.steps.map(step => {
          if (step.formId === action.payload.formId) {
            delete action.payload.entryId;
            return action.payload;
          }
          return step;
        })
      };
    }
    // Leave every other item unchanged
    return application;
  });

  return updateObject(state, {
    applications: updatedState
  });
};

const removeApplicationStep = (state, action) => {
  const updatedState = state.applications.map(application => {
    // Find the item with the matching id
    if (application.entryId === action.payload.entryId) {
      // Return a new object
      return {
        ...application,
        steps: application.steps.filter(step => {
          return step.formId !== action.payload.formId;
        })
      };
    }
    // Leave every other item unchanged
    return application;
  });

  return updateObject(state, {
    applications: updatedState
  });
};

const activeStep = (state, action) => {
  return updateObject(state, {
    activeSteps: updateObject(state.activeSteps, action.payload)
  });
};

const populateApplicationsState = (state, action) => {
  const activeSteps = action.payload.map(app => {
    const step = app.steps.slice(-1)[0];
    return step ? { [app._id]: step.formId } : null;
  });

  return updateObject(state, {
    applications: action.payload.map(app => {
      // I know, not immutably but since it's the inital state and
      // I'm not mutating state itself it should be fine but correct me if needed
      app.entryId = app._id;
      delete app._id;
      return app;
    }),
    activeSteps: Object.assign({}, ...activeSteps)
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_APPLICATION_ENTRY:
      return newApplicationEntry(state, action);
    case actionTypes.EDIT_APPLICATION_ENTRY:
      return editApplicationEntry(state, action);
    case actionTypes.CLOSE_APPLICATION_ENTRY:
      return closeApplicationEntry(state, action);
    case actionTypes.REMOVE_APPLICATION_ENTRY:
      return removeApplicationEntry(state, action);
    case actionTypes.POPULATE_APPLICATIONS_STATE:
      return populateApplicationsState(state, action);
    case actionTypes.ADD_APPLICATION_STEP:
      return newApplicationStep(state, action);
    case actionTypes.EDIT_APPLICATION_STEP:
      return editApplicationStep(state, action);
    case actionTypes.REMOVE_APPLICATION_STEP:
      return removeApplicationStep(state, action);
    case actionTypes.ACTIVE_STEP:
      return activeStep(state, action);
    default:
      return state;
  }
};

export default reducer;
