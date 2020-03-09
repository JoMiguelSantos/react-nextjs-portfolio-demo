import auth0 from "../../lib/auth/auth0";
import { Component } from "react";

export default function withAuth(InnerComponent) {
  return class Authenticated extends Component {
    static async getInitialProps({ req, res }) {
      if (typeof window === "undefined") {
        const session = await auth0.getSession(req);

        if (!session || !session.user) {
          res.writeHead(302, {
            Location: "/api/auth/login"
          });
          res.end();
          return;
        }

        return { user: session.user };
      }
    }
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <React.Fragment>
          {<InnerComponent {...this.props} user={this.props.user} />}
        </React.Fragment>
      );
    }
  };
}
