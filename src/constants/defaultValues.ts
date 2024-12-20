import {
  contractToHire,
  contractTypes,
  experienceLevels,
  featuredJobs,
  hoursToWorkPerWeek,
  oneTimeProject,
  ongoingProject,
} from "./options";

export const formDefaultValues = {
  feedName: "",
  contractType: contractTypes[0].value,
  minHourlyRate: "",
  maxHourlyRate: "",
  minFixedBudget: "",
  maxFixedBudget: "",
  categories: [],
  experienceLevel: experienceLevels,
  hoursToWorkPerWeek: hoursToWorkPerWeek[0].value,
  requiredSkills: [],
  excludedSkills: [],
  matchAllWords: [],
  matchAnyWords: [],
  excludeAnyWord: [],
  paymentMethodVerified: true,
  minClientRating: 4.5,
  minClientReviewsCount: "",
  minHireRate: 55,
  minNumOfHires: "",
  minTotalJobs: "",
  minTotalSpent: "",
  minAvgHourlyRate: "",
  countryOfClient: [],
  excludedCountryOfClient: [],
  enterpriseClients: false,
  featuredJobs: featuredJobs[0].value,
  oneTimeProject: oneTimeProject[0].value,
  ongoingProject: ongoingProject[0].value,
  contractToHireProject: contractToHire[0].value,
};
