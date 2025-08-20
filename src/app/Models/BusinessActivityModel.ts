export interface BusinessActivityModel {
  id: string;
  activityName: string;
  isForCompany: boolean;
  isForBranch: boolean;
  status:string,
  selected?: boolean; 
}