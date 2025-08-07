export interface RoleProgramModel {
  id: string;
  programId: string;
  create: boolean;
  update: boolean;
  view: boolean;
  delete: boolean;
  download: boolean;
  email: boolean;
}

export interface CompanyRoleModel {
  id: string;
  roleId:string;
  companyRoleName:string;
  allLocationAccess: boolean;
  allIssuesAccess: boolean;
  status: boolean;
  companyRolePrograms: RoleProgramModel[];
  selected?: boolean;
}

export interface RoleModel {
  id: string;
  roleName:string;
  allLocationAccess: boolean;
  allIssuesAccess: boolean;
  status: boolean;
  rolePrograms: RoleProgramModel[];
  selected?: boolean;
}



