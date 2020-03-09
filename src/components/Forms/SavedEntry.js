import DeleteIcon from "@material-ui/icons/Delete";
import RateReviewIcon from "@material-ui/icons/RateReview";
import EditIcon from "@material-ui/icons/Edit";
import { connect } from "react-redux";

import "./SavedEntry.scss";

//ToDo:
// - make the buttons actually pull the information and prefill the form so users can change the entry
// - insert range slider on the form for salary data
// grab data from Resume/Cover Letter using a library and parse it?

const savedEntry = props => {
  const salary =
    props["salary-gross-per-year"] || props["salary-gross-per-month"]
      ? props["salary-gross-per-year"] || props["salary-gross-per-month"]
      : null;

  const salaryData =
    salary === "" || salary ? (
      <div className="entry__list--item">
        <label>
          {props["salary-gross-per-year"]
            ? "Salary Gross Per Year"
            : "Salary Gross Per Month"}
        </label>
        <p>{salary}</p>
      </div>
    ) : null;

  const companyName =
    props["company-name"] === "" || props["company-name"] ? (
      <div className="entry__list--item">
        <label>Company Name</label>
        <p>{props["company-name"]}</p>
      </div>
    ) : null;

  const jobTitle =
    props["job-title"] === "" || props["job-title"] ? (
      <div className="entry__list--item">
        <label>Job Title</label>
        <p>{props["job-title"]}</p>
      </div>
    ) : null;

  const description =
    props.description === "" || props.description ? (
      <div className="entry__list--item">
        <label>Description</label>
        <p>{props.description}</p>
      </div>
    ) : null;

  const universityName =
    props["university-name"] === "" || props["university-name"] ? (
      <div className="entry__list--item">
        <label>University Name</label>
        <p>{props["university-name"]}</p>
      </div>
    ) : null;

  const bootcampName =
    props["bootcamp-name"] === "" || props["bootcamp-name"] ? (
      <div className="entry__list--item">
        <label>Bootcamp Name</label>
        <p>{props["bootcamp-name"]}</p>
      </div>
    ) : null;

  const courseName =
    props["course-name"] === "" || props["course-name"] ? (
      <div className="entry__list--item">
        <label>Course Name</label>
        <p>{props["course-name"]}</p>
      </div>
    ) : null;

  const providerName =
    props["provider-name"] === "" || props["provider-name"] ? (
      <div className="entry__list--item">
        <label>Provider Name</label>
        <p>{props["provider-name"]}</p>
      </div>
    ) : null;

  const degreeName =
    props["degree-name"] === "" || props["degree-name"] ? (
      <div className="entry__list--item">
        <label>Degree Name</label>
        <p>{props["degree-name"]}</p>
      </div>
    ) : null;

  const certificationName =
    props["certification-name"] === "" || props["certification-name"] ? (
      <div className="entry__list--item">
        <label>Certification Name</label>
        <p>{props["certification-name"]}</p>
      </div>
    ) : null;

  const courseHours =
    props["course-hours"] === "" || props["course-hours"] ? (
      <div className="entry__list--item">
        <label>Course Hours</label>
        <p>{props["course-hours"]}</p>
      </div>
    ) : null;

  const benefits =
    props.benefits === "" || props.benefits ? (
      <div className="entry__list--item">
        <label>Benefits</label>
        <p>{props.benefits}</p>
      </div>
    ) : null;

  const mobileNumber =
    props["mobile-number"] === "" || props["mobile-number"] ? (
      <div className="entry__list--item">
        <label>Mobile Number</label>
        <p>{props["mobile-number"]}</p>
      </div>
    ) : null;

  const decisionDeadline =
    props["decision-deadline"] === "" || props["decision-deadline"] ? (
      <div className="entry__list--item">
        <label>Decision Deadline</label>
        <p>{props["decision-deadline"]}</p>
      </div>
    ) : null;

  const linkedIn =
    props.linkedIn === "" || props.linkedIn ? (
      <div className="entry__list--item">
        <label>LinkedIn Profile</label>
        <p>{props.linkedIn}</p>
      </div>
    ) : null;

  const firstName =
    props["first-name"] === "" || props["first-name"] ? (
      <div className="entry__list--item">
        <label>First Name</label>
        <p>{props["first-name"]}</p>
      </div>
    ) : null;

  const lastName =
    props["last-name"] === "" || props["last-name"] ? (
      <div className="entry__list--item">
        <label>Last Name</label>
        <p>{props["last-name"]}</p>
      </div>
    ) : null;

  const interviewerName =
    props["interviewer-name"] === "" || props["interviewer-name"] ? (
      <div className="entry__list--item">
        <label>Interviewer Name</label>
        <p>{props["interviewer-name"]}</p>
      </div>
    ) : null;

  const interviewTime =
    props["interview-time"] === "" || props["interview-time"] ? (
      <div className="entry__list--item">
        <label>Interview Time</label>
        <p>{props["interview-time"]}</p>
      </div>
    ) : null;

  const notes =
    props["notes"] === "" || props["notes"] ? (
      <div className="entry__list--item">
        <label>Notes</label>
        <p>{props["notes"]}</p>
      </div>
    ) : null;

  const source =
    props["source"] === "" || props["source"] ? (
      <div className="entry__list--item">
        <label>Source</label>
        <p>{props["source"]}</p>
      </div>
    ) : null;

  const location =
    props["location"] === "" || props["location"] ? (
      <div className="entry__list--item">
        <label>Location</label>
        <p>{props["location"]}</p>
      </div>
    ) : null;

  const industry =
    props["industry"] === "" || props["industry"] ? (
      <div className="entry__list--item">
        <label>Industry</label>
        <p>{props["industry"]}</p>
      </div>
    ) : null;

  const applicationDate =
    props["application-date"] === "" || props["application-date"] ? (
      <div className="entry__list--item">
        <label>Application Date</label>
        <p>{props["application-date"]}</p>
      </div>
    ) : null;

  // disabled because it's causing an error on the form data collection
  // const resume = props["resume"] ? (
  //   <div className="entry__list--item">
  //     <label>Resumé</label>
  //     <p>{props["resume"]}</p>
  //   </div>
  // ) : null;
  const attire =
    props["attire"] === "" || props["attire"] ? (
      <div className="entry__list--item">
        <label>Attire</label>
        <p>{props["attire"]}</p>
      </div>
    ) : null;

  const durationInMinutes =
    props["duration-in-minutes"] === "" || props["duration-in-minutes"] ? (
      <div className="entry__list--item">
        <label>Duration In Minutes</label>
        <p>{props["duration-in-minutes"]}</p>
      </div>
    ) : null;

  const coverLetter =
    props["cover-letter"] === "" || props["cover-letter"] ? (
      <div className="entry__list--item">
        <label>Cover Letter</label>
        <p>{props["cover-letter"]}</p>
      </div>
    ) : null;

  const startDate =
    props["start-date"] === "" || props["start-date"] ? (
      <div className="entry__list--item">
        <label>Start Date</label>
        <p>{props["start-date"]}</p>
      </div>
    ) : null;

  const endDate =
    props["end-date"] === "" || props["end-date"] ? (
      <div className="entry__list--item">
        <label>End Date</label>
        <p>{props["end-date"]}</p>
      </div>
    ) : null;

  const testType =
    props["test-type"] === "" || props["test-type"] ? (
      <div className="entry__list--item">
        <label>Test Type</label>
        <p>{props["test-type"]}</p>
      </div>
    ) : null;

  const testSubjects =
    props["test-subjects"] === "" || props["test-subjects"] ? (
      <div className="entry__list--item">
        <label>Test Subject(s)</label>
        <p>{props["test-subjects"]}</p>
      </div>
    ) : null;

  const receivedDate =
    props["received-date"] === "" || props["received-date"] ? (
      <div className="entry__list--item">
        <label>Received Date</label>
        <p>{props["received-date"]}</p>
      </div>
    ) : null;

  const jobOfferDate =
    props["job-offer-date"] === "" || props["job-offer-date"] ? (
      <div className="entry__list--item">
        <label>Job Offer Date</label>
        <p>{props["job-offer-date"]}</p>
      </div>
    ) : null;

  const timeToCompleteInMinutes =
    props["time-to-complete-in-minutes"] === "" ||
    props["time-to-complete-in-minutes"] ? (
      <div className="entry__list--item">
        <label>Time To Complete In Minutes</label>
        <p>{props["time-to-complete-in-minutes"]}</p>
      </div>
    ) : null;

  const deliverDeadline =
    props["deliver-deadline"] === "" || props["deliver-deadline"] ? (
      <div className="entry__list--item">
        <label>Deliver Deadline</label>
        <p>{props["deliver-deadline"]}</p>
      </div>
    ) : null;

  const isActive = () => {
    return props.activeSteps[props.entryId] === props.formId;
  };

  return (
    <div
      className={`entry__list--items ${props.pageIdentifier} ${props.formId} ${
        isActive() ? " active" : ""
      }`}
    >
      {firstName}
      {lastName}
      {companyName}
      {providerName}
      {universityName}
      {bootcampName}
      {jobTitle}
      {location}
      {industry}
      {source}
      {applicationDate}
      {interviewerName}
      {interviewTime}
      {degreeName}
      {courseName}
      {certificationName}
      {description}
      {/*resume*/}
      {/*coverLetter*/}
      {salaryData}
      {courseHours}
      {durationInMinutes}
      {benefits}
      {mobileNumber}
      {decisionDeadline}
      {linkedIn}
      {attire}
      {jobOfferDate}
      {startDate}
      {endDate}
      {testType}
      {testSubjects}
      {receivedDate}
      {timeToCompleteInMinutes}
      {deliverDeadline}
      {notes}
      <div className="entry__icons">
        <EditIcon onClick={props.onEditClick} />
        <DeleteIcon onClick={props.onDeleteClick} />
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    activeSteps: state.applications.activeSteps
  };
};

export default connect(mapStateToProps, null)(savedEntry);
