import * as actionTypes from "./actionTypes";
import fetch from "isomorphic-unfetch";
import { checkStatus } from "../../js.utils";
import { batch } from "react-redux";

const hostname = "https://reshaped-demo.now.sh";

//// UTILS
export const isFetching = application => {
  return {
    type: actionTypes.IS_FETCHING,
    payload: application
  };
};

export const isSaving = application => {
  return {
    type: actionTypes.IS_SAVING,
    payload: application
  };
};

//// APPLICATIONS
export const populateApplicationsState = applications => {
  return {
    type: actionTypes.POPULATE_APPLICATIONS_STATE,
    payload: applications
  };
};

export const getApplications = () => {
  return dispatch => {
    dispatch(isFetching({ applications: true }));
    fetch(`${hostname}/api/db/applications`)
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }
        batch(() => {
          dispatch(populateApplicationsState(res));
          dispatch(isFetching({ applications: false }));
        });
      });
  };
};

export const addApplicationEntry = application => {
  return {
    type: actionTypes.ADD_APPLICATION_ENTRY,
    payload: application
  };
};

export const postApplicationEntry = application => {
  return dispatch => {
    dispatch(isSaving({ "new-application": true }));
    fetch(`${hostname}/api/db/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ application })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }

        res.entryId = res._id;
        delete res._id;
        batch(() => {
          // define initial step as active step
          dispatch(activeStep({ [res.entryId]: "application-submitted" }));
          // create new application in store
          dispatch(addApplicationEntry(res));
          dispatch(isSaving({ "new-application": false }));
        });
      });
  };
};

export const editApplicationEntry = application => {
  return {
    type: actionTypes.EDIT_APPLICATION_ENTRY,
    payload: application
  };
};

export const putApplicationEntry = application => {
  return dispatch => {
    dispatch(isSaving({ [application.entryId]: true }));
    fetch(`${hostname}/api/db/applications`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ application })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }
        res.entryId = res._id;
        delete res._id;
        batch(() => {
          // define initial step as active step
          dispatch(
            activeStep({ [application.entryId]: "application-submitted" })
          );
          // create new application in store
          dispatch(editApplicationEntry(res));
          dispatch(isSaving({ [application.entryId]: false }));
        });
      });
  };
};

export const patchApplicationEntry = application => {
  return dispatch => {
    dispatch(isSaving({ [application.entryId]: true }));
    fetch(`${hostname}/api/db/applications`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ application })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }
        batch(() => {
          dispatch(
            activeStep({ [application.entryId]: "application-submitted" })
          );
          dispatch(editApplicationEntry(res));
          dispatch(isSaving({ [application.entryId]: false }));
        });
      });
  };
};

export const toggleApplicationStatus = application => {
  return {
    type: actionTypes.TOGGLE_APPLICATION_STATUS,
    payload: application
  };
};

export const patchApplicationStatus = application => {
  return dispatch => {
    dispatch(isSaving({ [application.entryId]: true }));
    fetch(`${hostname}/api/db/applications`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ application })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(r => {
        batch(() => {
          dispatch(toggleApplicationStatus(application));
          dispatch(isSaving({ [application.entryId]: false }));
        });
      });
  };
};

export const removeApplicationEntry = application => {
  return {
    type: actionTypes.REMOVE_APPLICATION_ENTRY,
    payload: application
  };
};

export const deleteApplicationEntry = entryId => {
  return dispatch => {
    dispatch(isSaving({ [entryId]: true }));
    fetch(`${hostname}/api/db/applications`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ application: { entryId } })
    })
      .then(checkStatus)
      .then(r => {
        batch(() => {
          dispatch(removeApplicationEntry(entryId));
          dispatch(isSaving({ [entryId]: false }));
        });
      });
  };
};

//// STEPS
export const addApplicationStep = step => {
  return {
    type: actionTypes.ADD_APPLICATION_STEP,
    payload: step
  };
};

export const postApplicationStep = (step, entryId, formId) => {
  return dispatch => {
    dispatch(isSaving({ [entryId]: true }));
    fetch(`${hostname}/api/db/applications/steps`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        step: { ...step, entryId: entryId, formId: formId }
      })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }

        batch(() => {
          dispatch(activeStep({ [entryId]: formId }));
          dispatch(
            addApplicationStep({
              ...step,
              formId: formId,
              entryId: entryId
            })
          );
          dispatch(isSaving({ [entryId]: false }));
        });
      });
  };
};

export const editApplicationStep = step => {
  return {
    type: actionTypes.EDIT_APPLICATION_STEP,
    payload: step
  };
};

export const putApplicationStep = step => {
  return dispatch => {
    dispatch(isSaving({ [step.entryId]: true }));

    fetch(`${hostname}/api/db/applications/steps`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ step })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }

        batch(() => {
          dispatch(editApplicationStep(step));
          dispatch(isSaving({ [step.entryId]: false }));
        });
      });
  };
};

export const patchApplicationStep = (step, entryId, formId) => {
  return dispatch => {
    dispatch(isSaving({ [entryId]: true }));
    fetch(`${hostname}/api/db/applications/steps`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        step: { ...step, entryId: entryId, formId: formId }
      })
    })
      .then(checkStatus)
      .then(r => r.json())
      .then(res => {
        if (res.error) {
          throw res.error;
        }
        batch(() => {
          dispatch(
            editApplicationStep({
              ...step,
              formId: formId,
              entryId: entryId
            })
          );
          dispatch(isSaving({ [entryId]: false }));
        });
      });
  };
};

export const removeApplicationStep = step => {
  return {
    type: actionTypes.REMOVE_APPLICATION_STEP,
    payload: step
  };
};

export const deleteApplicationStep = (entryId, formId) => {
  return dispatch => {
    dispatch(isSaving({ [entryId]: true }));
    fetch(`${hostname}/api/db/applications/steps`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ step: { entryId, formId } })
    })
      .then(checkStatus)
      .then(r => {
        if (r.error) {
          throw r.error;
        }
        batch(() => {
          dispatch(
            removeApplicationStep({
              entryId,
              formId
            })
          );
          dispatch(isSaving({ [entryId]: false }));
        });
      });
  };
};

export const activeStep = step => {
  return {
    type: actionTypes.ACTIVE_STEP,
    payload: step
  };
};
