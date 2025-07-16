export interface BusinessActivityModel {
  id: string;
  activityName: string;
  company: string;
  branch: string;
  section: string;
  subSection: string;
  status:string,
  selected?: boolean; 
}