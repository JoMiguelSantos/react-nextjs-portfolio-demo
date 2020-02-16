import fetch from "isomorphic-unfetch";

// unfetch doesn't check for HTTPresponse validity so this takes care of that
const checkStatus = response => {
  if (response.ok) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
};

const hostname = "https://reshaped-demo.now.sh";

// GET
export const getApplications = async entryId => {
  // if entryId is passed then get specific application else get all applications
  const apiUrl = entryId
    ? `${hostname}/api/db/applications?application=${entryId}}`
    : `${hostname}/api/db/applications`;
  const result = await fetch(apiUrl)
    .then(checkStatus)
    .then(r => r.json());

  return result;
};

export const getApplicationSteps = async (entryId, formId) => {
  // if entryId is passed then get specific application else get all applications
  const apiUrl =
    entryId && formId
      ? `${hostname}/api/db/applications/steps?entryId=${entryId}&formId=${formId}}`
      : "";
  const result = await fetch(apiUrl)
    .then(checkStatus)
    .then(r => r.json());

  return result;
};

// POST
export const upsertApplication = async data => {
  const result = await fetch(`${hostname}/api/db/applications`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ application: data })
  })
    .then(checkStatus)
    .then(r => {
      return r.json();
    });

  return result;
};

export const upsertApplicationStep = async (step, entryId, formId) => {
  const result = await fetch(`${hostname}/api/db/applications/steps`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      step: { ...step, entryId: entryId, formId: formId }
    })
  })
    .then(checkStatus)
    .then(r => {
      return r.json();
    });

  return result;
};

//DELETE
export const deleteApplication = async entryId => {
  const result = await fetch(`${hostname}/api/db/applications`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ application: { entryId } })
  })
    .then(checkStatus)
    .then(r => console.log("successfully deleted " + r.text()));

  return result;
};

export const deleteApplicationStep = async (entryId, formId) => {
  const result = await fetch(`${hostname}/api/db/applications/steps`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ step: { entryId, formId } })
  })
    .then(checkStatus)
    .then(r => console.log("successfully deleted " + r.text()));

  return result;
};
