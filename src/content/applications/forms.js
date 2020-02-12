// APPLICATION
export const newApplicationFormFields = [
  { name: "company-name", required: true },
  { name: "job-title", required: true },
  { name: "location", required: true },
  { name: "industry" },
  { name: "source" },
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
  { name: "interviewer-name" },
  { name: "interview-time", type: "datetime-local", required: true },
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
