import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessActivityService } from '../../Service/BusinessActivityService/business-activity';
import { BusinessActivityModel } from '../../Models/BusinessActivityModel';


@Component({
  selector: 'app-sys-business-activity',
  imports: [RouterLink,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './sys-business-activity.html',
  styleUrl: './sys-business-activity.css'
})
export class SysBusinessActivity {
  data: BusinessActivityModel[] = [];
  filteredData: BusinessActivityModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';

 
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

  // onSearch() {
  //   const term = this.searchTerm.toLowerCase();
  //   this.filteredData = this.data.filter(item =>
  //     item.business_activity_name.toLowerCase().includes(term)
  //   );
  //   this.currentPage = 1; // reset to first page
  // }

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
  businessActivityForm!:FormGroup;
  checkIcon = '<i class="fa-solid fa-check text-success"></i>';
  crossIcon = '<i class="fa-solid fa-xmark text-danger"></i>';
  businessActivities: any[] = [];
  
  constructor(private fb:FormBuilder,private businessActivityService:BusinessActivityService){}

  ngOnInit(){
    this.getBusinessActivity();
    this.businessActivityForm = this.fb.group({
      id: [''],
      activityName: [''],
      company: [false],
      branch: [false],
      section: [false],
      subSection: [false]
    });
  }

  openModal(){
    this.isModalVisible=true;
    console.log(this.isModalVisible);
  }

  closeModal(){
    this.isModalVisible=false;
    this.isEditModalVisible=false;
    this.businessActivities=[];
    this.businessActivityForm.reset();
  }
  
  getBusinessActivity(){
    this.businessActivityService.getBusinessActivity().subscribe({
      next:res=>{
        console.log(res.body.data);
        this.data=res.body.data;
        this.filteredData = [...this.data];
      },
        error: err => console.error('Error fetching BusinessActivity:', err)
    });
  }

  addBusinessActivity(): void {
  const activityObj  = this.businessActivityForm.value;

  if (activityObj.activityName?.trim()) {
    this.businessActivities.push({
      activityName:activityObj.activityName,
      company:activityObj.company,
      branch: activityObj.branch,
      section: activityObj.section,
      subSection: activityObj.subSection
    });
    this.businessActivityForm.reset();
  }
}

  removeActivity(index: number): void {
    this.businessActivities.splice(index, 1);
  }

  submitAllActivities() {
    const payload = this.businessActivities.map(({ activityName, company, branch, section, subSection }) => ({
      activityName,
      company: !!company,
      branch: !!branch,
      section: !!section,
      subSection: !!subSection
    }));
    this.businessActivityService.createBusinessActivity(payload).subscribe({
      next:()=>{
        this.getBusinessActivity(),
          this.closeModal();
        },
          error: err => {
            console.error('Create business activity error:', err);
           alert('Failed to submit business activities. Please try again.');
          }
    });
  }

  

originalItem: any;
  openEditModal(item: any) {
    this.isEditModalVisible = true;
      this.originalItem = { ...item };
    this.businessActivityForm.patchValue({
      id: item.id,
      activityName: item.activityName,
      company: item.company ,
      branch: item.branch ,
      section: item.section ,
      subSection: item.subSection 
    });
  }
  

saveChanges() {
  const formValue = this.businessActivityForm.value;

  // Always include ID for identification
  const updatedFields: any = { id: formValue.id };

  // Compare with originalItem and include only changed fields
  Object.keys(formValue).forEach(key => {
    if (formValue[key] !== this.originalItem[key]) {
      updatedFields[key] = formValue[key];
    }
  });

  // If no fields changed (only ID present), do nothing
  if (Object.keys(updatedFields).length === 1) {
    console.log('No changes detected.');
    this.closeModal();
    return;
  }

  // Send only changed fields to backend
  this.businessActivityService.updateBusinessActivity(updatedFields).subscribe({
    next: () => {
      this.getBusinessActivity(); 
      this.closeModal();
    },
    error: err => console.error('Update business activity error:', err)
  });
}

  

  deleteBusinessActivity(id:any){
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.filteredData=this.filteredData.filter(item=>item.id!==id);
      } 
    });
  }

 
}
