interface ITracker {
  id: string;
  user: number;
  name: string;
  filters: ITrackerFilter;
  isPaused: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ITrackerFilter {
  trackerName: string;

  minHourlyRate: number | null;
  maxHourlyRate: number | null;
  minFixedBudget: number | null;
  maxFixedBudget: number | null;

  requiredSkills: string[];
  excludedSkills: string[];
  matchAllWords: string[];
  matchAnyWords: string[];
  excludeAnyWords: string[];

  minClientRating: number | null;
  minClientReviewsCount: number | null;
  minHireRate: number | null;
  minNumOfHires: number | null;
  minTotalJobs: number | null;
  minTotalSpent: number | null;
  minAvgHourlyRate: number | null;

  categories: string[];
  experienceLevel: string[];
  countryOfClient: string[];
  excludedCountryOfClient: string[];

  contractType: "*" | "Hourly" | "FixedPrice";
  hoursToWorkPerWeek?: string;
  featuredJobs?: string;
  oneTimeProject?: string;
  ongoingProject?: string;
  contractToHireProject?: string;

  enterpriseClients: boolean;
  paymentMethodVerified: boolean;
}
