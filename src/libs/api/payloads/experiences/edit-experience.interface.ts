export interface EditExperiencePayload {
  experienceId: string;
  companyName?: string;
  companyDescription?: string;
  companyLink?: string;
  companyLinkTitle?: string;
  companyPicture?: string;
  obtainedSkills?: Array<string>;
  startDate?: Date;
  endDate?: Date;
  authorId?: string;
}
