// APPLICATION
export const newApplicationFormFields = [
  { name: "company-name", required: true },
  { name: "job-title", required: true },
  { name: "location", required: true },
  { name: "industry" },
  { name: "source" },
  { name: "job-link" },
  { name: "description", required: true, type: "text-area" },
  { name: "application-date", required: true, type: "date" },
  { name: "notes", type: "text-area" }
];

// STEPS
export const newPhoneScreeningFormFields = [
  { name: "interviewer-name" },
  { name: "interview-time", type: "datetime-local", required: true },
  { name: "duration-in-minutes", type: "number" },
  { name: "notes" }
];

export const newPhoneInterviewFormFields = [
  { name: "interviewer-name" },
  { name: "interview-time", type: "datetime-local", required: true },
  { name: "notes" }
];

export const newOnSiteInterviewFormFields = [
  { name: "interviewer-name" },
  { name: "interview-time", type: "datetime-local", required: true },
  { name: "attire" },
  { name: "notes" }
];

export const newTechnicalTestFormFields = [
  { name: "test-type" },
  { name: "test-subjects" },
  { name: "received-date", type: "date" },
  { name: "time-to-complete-in-minutes", type: "number" },
  { name: "deliver-deadline", type: "date" },
  { name: "notes" }
];

export const newTechnicalInterviewFormFields = [
  { name: "test-type" },
  { name: "test-subjects" },
  { name: "interviewer-name" },
  { name: "interview-time", type: "datetime-local", required: true },
  { name: "duration-in-minutes", type: "number" },
  { name: "notes" }
];

export const newJobOfferFormFields = [
  {
    name: "salary-gross-per-year",
    type: "number",
    min: "1000",
    max: "1000000",
    step: "1000",
    required: true
  },
  { name: "benefits" },
  { name: "job-offer-date", type: "date", required: true },
  { name: "decision-deadline", type: "date" }
];

export default {
  "application-submitted": newApplicationFormFields,
  "phone-screening": newPhoneScreeningFormFields,
  "phone-interview": newPhoneInterviewFormFields,
  "onsite-interview": newOnSiteInterviewFormFields,
  "technical-test": newTechnicalTestFormFields,
  "technical-interview": newTechnicalInterviewFormFields,
  "job-offer": newJobOfferFormFields
};
