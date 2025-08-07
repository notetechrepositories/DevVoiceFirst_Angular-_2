export interface MediaTypeModel{
    id:string;
    description:string;
    status:string;
    selected?: boolean;
    
}
export interface CompanyMediaTypeModel{
     id:string;
    mediaTypeId : string;
    companyDescription: string;
    status:string,
    selected?: boolean;

}