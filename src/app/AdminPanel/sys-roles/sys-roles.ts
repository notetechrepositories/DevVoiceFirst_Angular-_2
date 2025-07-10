import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sys-roles',
  imports: [RouterLink,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './sys-roles.html',
  styleUrl: './sys-roles.css'
})
export class SysRoles {
data = [
    {
      roleName:"Admin",
      allLocationAccess:true,
      allIssueAccess:true,
    },
    {
      roleName:"User",
      allLocationAccess:false,
      allIssueAccess:false,
    },
    {
      roleName:"Manager",
      allLocationAccess:true,
      allIssueAccess:true,
    },
    {
      roleName:"Supervisor",
      allLocationAccess:true,
      allIssueAccess:true,
    },
    {
      roleName:"Employee",
      allLocationAccess:false,
      allIssueAccess:false,
    }

  ];

  program= [
    {
      id: "1",
      programName: "Company",
      add: 1,
      edit: 1,
      delete: 0,
      view: 1,
      print: 0,
      export: 1,
      import: 0,
      download: 1,
    },
    {
      id: "2",
      programName: "Roles",
      add: 0,
      edit: 1,
      delete: 1,
      view: 1,
      print: 1,
      export: 0,
      import: 0,
      download: 1,
    },
    {
      id: "3",
      programName: "Employee",
      add: 1,
      edit: 1,
      delete: 1,
      view: 1,
      print: 1,
      export: 1,
      import: 1,
      download: 1,
    },
    {
      id: "4",
      programName: "Report",
      add: 0,
      edit: 0,
      delete: 0,
      view: 1,
      print: 1,
      export: 1,
      import: 0,
      download: 1,
    },
    {
      id: "5",
      programName: "Business Activity",
      add: 1,
      edit: 0,
      delete: 0,
      view: 1,
      print: 0,
      export: 1,
      import: 1,
      download: 0,
    }
  ];

  itemsPerPage = 10;
  currentPage = 1;

  searchTerm: string = '';
  filteredData = [...this.data];

   get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.itemsPerPage);
  }

  get totalPagesArray(): number[] {
    return Array(this.totalPages)
      .fill(0)
      .map((_, i) => i + 1);
  }

  get pagedData() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredData.slice(start, start + this.itemsPerPage);
  }

  onSearch() {
    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item =>
      item.roleName.toLowerCase().includes(term) 
    );
    this.currentPage = 1; // reset to first page
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  // ----------------

  isModalVisible:boolean=false;
  isEditModalVisible:boolean=false;
  roleForm: FormGroup;
  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';

  constructor(private fb: FormBuilder) {

    this.roleForm = this.fb.group({
      roleName: [''],
      allLocationAccess: [false],
      allIssueAccess: [false]
    });
  }

  openModal(){
    this.isModalVisible=true;
    console.log(this.isModalVisible);
  }

  closeModal(){
    this.isModalVisible=false;
    this.isEditModalVisible=false;
    this.roleForm.reset();
  }

  addRole(){
    console.log("addRole");
    console.log(this.roleForm.value);
    this.filteredData.push(this.roleForm.value);
    this.closeModal();
  }

  editRole(item:any){
    console.log(item);
    this.roleForm.patchValue(item);
    this.isEditModalVisible=true;
  }

  saveChanges(){
    console.log(this.roleForm.value);
    // Find the index of the item being edited in filteredData and update it
    const index = this.filteredData.findIndex(
      (item: any) => item.roleName === this.roleForm.value.roleName
    );
    if (index !== -1) {
      this.filteredData[index] = { ...this.roleForm.value };
    } 
    this.closeModal();
  }

  deleteRole(item:any){
    console.log(item);
    this.filteredData = this.filteredData.filter(
      (role: any) => role !== item
    );
  }
}
