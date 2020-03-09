import connectToDB from "../../../../database/connect";
import mongoose from "mongoose";
import auth0 from "../../../../lib/auth/auth0";

import User from "../../../../database/Schemas/User";

// this auth0.requireAuthentication requires users to be authenticated to access this backend path
export default auth0.requireAuthentication(async (req, res) => {
  // connect to db
  await connectToDB();
  // get user profile from Auth0 on the server side
  const { user } = await auth0.getSession(req);

  const { method } = req;

  const userProfile = {
    _id: user.sub,
    given_name: "given_name" in user ? user.given_name : "",
    family_name: "family_name" in user ? user.family_name : "",
    email: user.email,
    picture: user.picture
  };

  const options = { upsert: true, new: true, setDefaultsOnInsert: true };

  const errorCallback = (error, users) => {
    if (error) {
      console.log("error");
      mongoose.connection.close();
      res.status(500).json({ error });
    } else {
      mongoose.connection.close();
      res.status(200).json(users);
    }
  };

  switch (method) {
    case "GET":
      User.findOneAndUpdate(
        { _id: user.sub },
        userProfile,
        options,
        (error, users) => errorCallback(error, users)
      );
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
});
