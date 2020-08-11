import connectToDB from "../../../../database/connect";
import mongoose from "mongoose";
import auth0 from "../../../../lib/auth/auth0";

import Application from "../../../../database/Schemas/Application";

// this auth0.requireAuthentication requires users to be authenticated to access this backend path
export default auth0.requireAuthentication(async (req, res) => {
  // get user profile from Auth0 on the server side
  const { user } = await auth0.getSession(req);

  const { method } = req;

  // if no body is available then search in query for the application
  const { application } = req.body ? req.body : req.query;

  // if no entryId is sent then get all application for the user,
  // if GET is the method, else null to avoid unwanted change
  const filter =
    application && application.entryId
      ? { userId: user.sub, _id: application.entryId }
      : method === "GET"
      ? { userId: user.sub }
      : null;

  // enable defaults and return new updated document
  const options = { new: true, setDefaultsOnInsert: true, runValidators: true };

  const callback = (error, application) => {
    if (error) {
      console.log("error", error);
      mongoose.connection.close();
      res.status(500).json({ error });
    } else {
      console.log(application);
      mongoose.connection.close();
      res.status(200).json(application);
    }
  };

  //add userId to application data
  if (application) {
    application.userId = user.sub;
  }

  // connect to db
  await connectToDB();

  switch (method) {
    case "GET":
      Application.find(filter, (error, application) =>
        callback(error, application)
      );
      break;
    case "POST":
      Application.create(application, (error, application) =>
        callback(error, application)
      );
      break;
    case "PUT":
      delete application.entryId;
      Application.findOneAndUpdate(
        filter,
        application,
        options,
        (error, application) => callback(error, application)
      );
      break;
    case "PATCH":
      const applicationDB = await Application.findById(application.entryId);
      delete application.entryId;
      // patch all present keys except "steps" which will be handled separately
      for (let key in application) {
        if (key !== "steps") applicationDB[key] = application[key];
      }
      if (application.steps && application.steps.length > 0) {
        //get the keys of the steps that need change
        const stepsToChange = application.steps.map((step) => step.formId);
        applicationDB.steps.forEach((DBstep) => {
          // if part of the steps to change
          if (stepsToChange.includes(DBstep.formId)) {
            // replace each property in DBstep with value on request step
            for (let [key, value] of Object.entries(
              application.steps.find((step) => step.formId === DBstep.formId)
            )) {
              DBstep[key] = value;
            }
          }
        });
      }
      applicationDB.save((error, step) => callback(error, step));
      break;
    case "DELETE":
      Application.findOneAndRemove(filter, (error, application) =>
        callback(error, application)
      );
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});
