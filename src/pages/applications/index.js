import Layout from "../../layout/Layout";
import Spinner from "../../components/Spinner/Spinner";

import { useFetchUser } from "../../lib/auth/user";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { getApplications } from "../../store/actions";

import withAuth from "../../hoc/auth/withAuth";

import "./index.scss";

const Applications = () => {
  const { user, loading } = useFetchUser({ required: true });
  const applications = useSelector(state => state.applications.applications);
  const isLoading = useSelector(state => state.applications.fetching);
  const dispatch = useDispatch();
  // create or update user profile in the DB
  useEffect(() => {
    fetch("/api/db/applications/updateUserProfile");
  }, [user]);

  // if user refreshes the page and loses the session, state will be empty
  // if so, trigger a side effect to populate the state from the DB
  useEffect(() => {
    if (applications.length === 0) {
      dispatch(getApplications());
    }
    return;
  }, []);

  let applicationSubmittedOpenApps = 0;
  let applicationSubmittedClosedApps = 0;
  let phoneScreeningOpenApps = 0;
  let phoneScreeningClosedApps = 0;
  let phoneInterviewOpenApps = 0;
  let phoneInterviewClosedApps = 0;
  let onsiteInterviewOpenApps = 0;
  let onsiteInterviewClosedApps = 0;
  let technicalTestOpenApps = 0;
  let technicalTestClosedApps = 0;
  let technicalInterviewOpenApps = 0;
  let technicalInterviewClosedApps = 0;
  let jobOfferOpenApps = 0;
  let jobOfferClosedApps = 0;

  applications.forEach(app => {
    app.steps.forEach(step => {
      switch (app.isOpen) {
        case true:
          switch (step.formId) {
            case "application-submitted":
              applicationSubmittedOpenApps++;
              break;
            case "phone-screening":
              phoneScreeningOpenApps++;
              break;
            case "phone-interview":
              phoneInterviewOpenApps++;
              break;
            case "onsite-interview":
              onsiteInterviewOpenApps++;
              break;
            case "technical-test":
              technicalTestOpenApps++;
              break;
            case "technical-interview":
              technicalInterviewOpenApps++;
              break;
            case "job-offer":
              jobOfferOpenApps++;
              break;
            default:
              break;
          }
          break;
        case false:
          switch (step.formId) {
            case "application-submitted":
              applicationSubmittedClosedApps++;
              break;
            case "phone-screening":
              phoneScreeningClosedApps++;
              break;
            case "phone-interview":
              phoneInterviewClosedApps++;
              break;
            case "onsite-interview":
              onsiteInterviewClosedApps++;
              break;
            case "technical-test":
              technicalTestClosedApps++;
              break;
            case "technical-interview":
              technicalInterviewClosedApps++;
              break;
            case "job-offer":
              jobOfferClosedApps++;
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }
    });
  });

  const applicationSubmittedTotal =
    applicationSubmittedOpenApps + applicationSubmittedClosedApps;
  const phoneScreeningTotal = phoneScreeningOpenApps + phoneScreeningClosedApps;
  const phoneInterviewTotal = phoneInterviewOpenApps + phoneInterviewClosedApps;
  const onsiteInterviewTotal =
    onsiteInterviewOpenApps + onsiteInterviewClosedApps;
  const technicalTestTotal = technicalTestOpenApps + technicalTestClosedApps;
  const technicalInterviewTotal =
    technicalInterviewOpenApps + technicalInterviewClosedApps;
  const jobOfferTotal = jobOfferOpenApps + jobOfferClosedApps;

  const statsTable = (
    <table className="applications__stats">
      <thead>
        <tr>
          <th>Steps</th>
          <th>Open Applications</th>
          <th>Closed Applications</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Application Submitted</td>
          <td>{applicationSubmittedOpenApps}</td>
          <td>{applicationSubmittedClosedApps}</td>
          <td>{applicationSubmittedTotal}</td>
        </tr>
        <tr>
          <td>Technical Test</td>
          <td>{technicalTestOpenApps}</td>
          <td>{technicalTestClosedApps}</td>
          <td>{technicalTestTotal}</td>
        </tr>
        <tr>
          <td>Technical Interview</td>
          <td>{technicalInterviewOpenApps}</td>
          <td>{technicalInterviewClosedApps}</td>
          <td>{technicalInterviewTotal}</td>
        </tr>
        <tr>
          <td>Phone Screening</td>
          <td>{phoneScreeningOpenApps}</td>
          <td>{phoneScreeningClosedApps}</td>
          <td>{phoneScreeningTotal}</td>
        </tr>
        <tr>
          <td>Phone Interview</td>
          <td>{phoneInterviewOpenApps}</td>
          <td>{phoneInterviewClosedApps}</td>
          <td>{phoneInterviewTotal}</td>
        </tr>
        <tr>
          <td>Onsite Interview</td>
          <td>{onsiteInterviewOpenApps}</td>
          <td>{onsiteInterviewClosedApps}</td>
          <td>{onsiteInterviewTotal}</td>
        </tr>
        <tr>
          <td>Job Offer</td>
          <td>{jobOfferOpenApps}</td>
          <td>{jobOfferClosedApps}</td>
          <td>{jobOfferTotal}</td>
        </tr>
      </tbody>
    </table>
  );
  return (
    <Layout user={user} loading={loading}>
      <div className="introduction">
        <h4>{`Welcome ${
          user && "given_name" in user ? user.given_name : "Stranger"
        }`}</h4>
        <p>
          {" "}
          {`This is your applications space.`}
          <br />
          {`Here's some stats about your applications:`} <br />
        </p>
        <div>{isLoading["applications"] ? <Spinner /> : statsTable}</div>
        <p>
          {" "}
          You can hover over all navigation menu items but you can only switch
          page to either "Closed Applications" or "Open Applications" in this
          demo. These pages will be fully operational and whatever applications
          you create will only be accessible to you.
        </p>
        <p>
          {" "}
          If something is not behaving as expected or you found a bug, I'm sorry
          for the bad user experience and please{" "}
          <a
            className="mail-me"
            href="mailto:joaomsglds@gmail.com?Subject=Bug%20Alert"
            target="_top"
          >
            report to me by email
          </a>
          .
        </p>
      </div>
    </Layout>
  );
};

// get applications in DB using getInitialProps to fetch from the DB
Applications.getInitialProps = ({ store, isServer }) => {
  const state = store.getState();
  // only fetch data if store is empty due to a manual refresh on the page
  // which renders server side and therefore doesn't have the user authenticated
  if (state.applications.applications.length === 0 && !isServer) {
    // populate state with all applications from DB
    store.dispatch(getApplications());
  }
  return store;
};

export default withAuth(Applications);
