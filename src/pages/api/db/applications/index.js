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

  // if no entryId is sent then get all application for the user
  const filter =
    application && "entryId" in application
      ? { userId: user.sub, _id: application.entryId }
      : { userId: user.sub };

  // enable upsert, defaults and return new updated document
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

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
      console.log("getting");
      Application.find(filter, (error, application) =>
        callback(error, application)
      );
      break;
    case "POST":
      //upsert an application
      console.log("upserting");
      // then it means it's an update
      if ("entryId" in application) {
        delete application.entryId;
        Application.findOneAndUpdate(
          filter,
          application,
          options,
          (error, application) => callback(error, application)
        );
        // else it means it's a new application
      } else {
        Application.create(application, (error, application) =>
          callback(error, application)
        );
      }
      break;
    case "DELETE":
      Application.findOneAndRemove(filter, (error, application) =>
        callback(error, application)
      );
      break;
    default:
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});
