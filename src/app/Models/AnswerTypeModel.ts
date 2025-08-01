export interface AnswerTypeModel {
    id: string;
    answerTypeName: string;
    status:string,
    selected?: boolean;

     
  }
  export interface CompanyAnswerTypeModel{
     id: string;
     companyAnswerTypeName:string;
     answerTypeId:string;
     status:string,
     selected?: boolean;
     
  }