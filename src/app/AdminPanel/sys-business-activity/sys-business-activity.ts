import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { BusinessActivityService } from '../../Service/BusinessActivityService/business-activity';
import { BusinessActivityModel } from '../../Models/BusinessActivityModel';
import { BusinessActivity } from '../../CompanyPanel/business-activity/business-activity';


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
  selectedactivityIds: string[] = [];
  isAllSelected = false;
 
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
      item.activityName.toLowerCase().includes(term)
    );
    this.currentPage = 1; 
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
  businessActivityForm!:FormGroup;
  isEditMode : boolean = false;
  originalItem: any;
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

  openModal(editItem?:BusinessActivityModel){
    this.isModalVisible=true;
    this.isEditMode = !!editItem;
    if(editItem){
      this.originalItem = { ...editItem };
    }
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


submitActivity() {
  const formValue = this.businessActivityForm.value;
 

  const payload = {
    activityName: formValue.activityName,
    company: !!formValue.company,
    branch: !!formValue.branch,
    section: !!formValue.section,
    subSection: !!formValue.subSection
  };

   console.log(payload);

  if (this.isEditMode) {
    
  }
 
  
  else{
     console.log(payload);
    this.businessActivityService.createBusinessActivity(payload).subscribe({
      next: () => {
        this.getBusinessActivity();  // Refresh the list
        this.closeModal();           // Close the modal or form
      },
      error: err => {
        console.error('Create business activity error:', err);
        alert('Failed to submit activity. Please try again.');
      }
    });
  }

  
}


  


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

  

  deleteBusinessActivity(){
    Swal.fire({
      title: 'Are you sure?',
     text: `Delete ${this.selectedactivityIds.length} activities`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(this.selectedactivityIds);
        
        this.businessActivityService.deleteBusinessActivity(this.selectedactivityIds).subscribe({
          next:()=>this.getBusinessActivity(),
          error: err => console.error('Delete role error:', err)
        });
        this.selectedactivityIds = [];
        this.isAllSelected = false;
       
      } 
    });
  }
     


  updateSelectAllStatus() {
  this.isAllSelected = this.selectedactivityIds.length === this.pagedData.length;
}

    toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      if (!this.selectedactivityIds.includes(id)) {
        this.selectedactivityIds.push(id);
      }
    } else {
      this.selectedactivityIds = this.selectedactivityIds.filter(x => x !== id);
    }
  
    // this.updateSelectAllStatus();
  }
  
  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
  
    if (checked) {
      this.selectedactivityIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedactivityIds = [];
    }
  
    this.isAllSelected = checked;
  }
 
}
