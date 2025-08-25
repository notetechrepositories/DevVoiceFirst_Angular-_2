export interface CountryModel{
    id:string;
    country:string;
    countryCode:string;
    countryIsoCode:string;
    divisionOneLabel:string;
    divisionTwoLabel:string;
    divisionThreeLabel:string;
    status:string;
}

export interface DivisionOneModel{
    id:string;
    divisionOne:string;
    countryId:string;
    status:string
}

export interface DivisionTwoModel{
    id:string;
    divisionOneId:string;
    divisionTwo:string;
    status:string
}

export interface DivisionThreeModel{
    id:string;
    divisionTwoId:string;
    divisionThree:string;
    status:string
}