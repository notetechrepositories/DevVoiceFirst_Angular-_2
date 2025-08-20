export interface IssueStatusModel {
    id: string;
    issueStatus: string;
    status:string,
    selected?: boolean;
  }

  export interface CompanyIssueStatusModel{
     id: string;
     companyIssueStatus:string;
     issueStatusId:string;
     status:string,
     selected?: boolean;
  }