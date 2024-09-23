export interface GetExperienceByIdResponse {
  id: string;
  companyName: string;
  companyDescription: string;
  companyLink: string;
  companyLinkTitle: string;
  companyPicture: string;
  startDate: Date;
  endDate: Date;
  isSelected: boolean;
  obtainedSkills: Array<string>;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  // @TODO
  // experiencePositions
}