import * as actionTypes from "./actionTypes";

export const newApplicationStep = step => {
  return {
    type: actionTypes.ADD_APPLICATION_STEP,
    payload: step
  };
};

export const editApplicationStep = step => {
  return {
    type: actionTypes.EDIT_APPLICATION_STEP,
    payload: step
  };
};

export const removeApplicationStep = step => {
  return {
    type: actionTypes.REMOVE_APPLICATION_STEP,
    payload: step
  };
};

export const newApplicationEntry = application => {
  return {
    type: actionTypes.ADD_APPLICATION_ENTRY,
    payload: application
  };
};

export const editApplicationEntry = application => {
  return {
    type: actionTypes.EDIT_APPLICATION_ENTRY,
    payload: application
  };
};

export const closeApplicationEntry = application => {
  return {
    type: actionTypes.CLOSE_APPLICATION_ENTRY,
    payload: application
  };
};

export const removeApplicationEntry = application => {
  return {
    type: actionTypes.REMOVE_APPLICATION_ENTRY,
    payload: application
  };
};

export const activeStep = step => {
  return {
    type: actionTypes.ACTIVE_STEP,
    payload: step
  };
};

export const populateApplicationsState = applications => {
  return {
    type: actionTypes.POPULATE_APPLICATIONS_STATE,
    payload: applications
  };
};
