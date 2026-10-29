
export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "assessment"
  | "interview"
  | "offer"
  | "rejected";

export type JobApplication = {
  id: number;
  company_name: string;
  job_title: string;
  job_url: string;
  location: string;
  status: ApplicationStatus;
  applied_date: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
};

export type CreateJobApplication = {
  company_name: string;
  job_title: string;
  job_url?: string;
  location?: string;
  status?: ApplicationStatus;
  applied_date?: string | null;
  notes?: string;
};
