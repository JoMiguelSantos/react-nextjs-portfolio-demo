import connectToDB from "../../../../database/connect";
import mongoose from "mongoose";
import auth0 from "../../../../lib/auth/auth0";

import { arraysMatch } from "../../../../js.utils";
import Application from "../../../../database/Schemas/Application";

// this auth0.requireAuthentication requires users to be authenticated to access this backend path
export default auth0.requireAuthentication(async (req, res) => {
  // connect to db
  await connectToDB();
  // get user profile from Auth0 on the server side
  const { user } = await auth0.getSession(req);

  const { method } = req;

  // if no body is available then search in query for the application
  const { step } = req.body ? req.body : req.query;

  // if no entryId is sent then get all step for the user
  const filter =
    step.entryId && step.formId
      ? { userId: user.sub, _id: step.entryId, "steps.formId": step.formId }
      : { userId: user.sub, _id: step.entryId };

  const callback = (error, step) => {
    if (error) {
      console.log("error", error);
      mongoose.connection.close();
      res.status(500).json({ error });
    } else {
      console.log(step);
      mongoose.connection.close();
      res.status(200).json(step);
    }
  };

  //   delete step.entryId
  console.log(step);
  switch (method) {
    case "GET":
      console.log("getting");
      Application.find(filter, (error, step) => callback(error, step));
      break;
    case "POST":
      console.log("upserting");
      // find application using entryId
      const applicationUpsert = await Application.findById(step.entryId);
      const stepsUpsert = applicationUpsert.steps.map(DBstep => {
        if (DBstep.formId === step.formId) {
          delete step.entryId;
          return step;
        }
        return DBstep;
      });
      // if step already exists then update
      // else push the new step into the array
      arraysMatch(applicationUpsert.steps, stepsUpsert)
        ? applicationUpsert.steps.push(step)
        : (applicationUpsert.steps = stepsUpsert);
      applicationUpsert.save((error, step) => callback(error, step));
      break;
    case "DELETE":
      const applicationStepDelete = await Application.findById(step.entryId);
      const stepsToDelete = applicationStepDelete.steps.filter(
        DBstep => DBstep.formId !== step.formId
      );
      applicationStepDelete.steps = stepsToDelete;
      applicationStepDelete.save((error, step) => callback(error, step));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});
