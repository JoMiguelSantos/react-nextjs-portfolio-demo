import connectToDB from "../../../../database/connect";
import mongoose from "mongoose";
import auth0 from "../../../../lib/auth/auth0";

import Application from "../../../../database/Schemas/Application";
import { Db } from "mongodb";

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

  const applicationDB = await Application.findById(step.entryId);

  switch (method) {
    case "GET":
      Application.find(filter, (error, step) => callback(error, step));
      break;
    case "POST":
      delete step.entryId;
      applicationDB.steps.push(step);
      applicationDB.save((error, step) => callback(error, step));
      break;
    case "PUT":
      delete step.entryId;
      applicationDB.steps.forEach(DBstep => {
        if (DBstep.formId === step.formId) {
          for (let key in step) {
            DBstep[key] = step[key];
          }
        }
        return DBstep;
      });

      applicationDB.save((error, step) => callback(error, step));
      break;
    case "PATCH":
      delete step.entryId;
      applicationDB.steps.forEach(DBstep => {
        if (DBstep.formId === step.formId) {
          for (let key in step) {
            DBstep[key] = step[key];
          }
        }
        return DBstep;
      });
      applicationDB.save((error, step) => callback(error, step));
      break;
    case "DELETE":
      applicationDB.steps = applicationDB.steps.filter(
        DBstep => DBstep.formId !== step.formId
      );
      applicationDB.save((error, step) => callback(error, step));
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "PATCH", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});
