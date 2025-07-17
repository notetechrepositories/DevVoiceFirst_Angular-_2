import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BusinessActivityService } from '../../Service/BusinessActivityService/business-activity';
import { UtilityService } from '../../Service/UtilityService/utility-service';
import { RouterLink } from '@angular/router';
import { AnswerTypeModel } from '../../Models/AnswerTypeModel';

@Component({
  selector: 'app-sys-answer-type',
  imports: [ CommonModule,FormsModule,ReactiveFormsModule,RouterLink ],
  standalone: true,
  templateUrl: './sys-answer-type.html',
  styleUrl: './sys-answer-type.css'
})
export class SysAnswerType {
  data: AnswerTypeModel[] = [];
  filteredData: AnswerTypeModel[] = [];

  itemsPerPage = 10;
  currentPage = 1;
  searchTerm: string = '';
  statusFilter: string = '';
  selectedAnswerTypeIds: string[] = [];
  isAllSelected = false;
  isModalVisible: boolean = false;
  isEditModalVisible: boolean = false;
  answerTypeForm!: FormGroup;
  isEditMode: boolean = false;
  originalItem: any;
  
  answerTypes: any[] = [];
  selectedAnswerTypeId: string | null = null;

  constructor(
    private fb: FormBuilder, 
    private businessActivityService: BusinessActivityService,
    private utilityService: UtilityService
  ) { }

  ngOnInit() {
    this.getAnswerType();
    this.answerTypeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    });
  }

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
      item.name.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  onStatusFilterChange() {
    this.currentPage = 1;
    this.filteredData = this.data.filter(item => {
      if (this.statusFilter === '') return true;
      return Boolean(item.status) === (this.statusFilter === 'true');

    });
    this.updateSelectAllStatus();
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


  openModal(editItem?: AnswerTypeModel) {
    this.isModalVisible = true;
    this.isEditMode = !!editItem;
    this.selectedAnswerTypeId = editItem?.id || null;
    if (editItem) {
      this.originalItem = { ...editItem };
      this.answerTypeForm.patchValue({
        id: editItem.id,
        name: editItem.name,
       
      });
    }
  }

  closeModal() {
    this.isModalVisible = false;
    this.answerTypes = [];
    this.answerTypeForm.reset();
  }

  getAnswerType() {
    this.businessActivityService.getBusinessActivity().subscribe({
      next: res => {
        this.data = res.body.data;
        this.filteredData = [...this.data];
      },
      error: err => { this.utilityService.showError(err.status, err.error?.message || 'Get failed.') }
    });
  }

  //   addBusinessActivity(): void {
  //   const activityObj  = this.answerTypeForm.value;

  //   if (activityObj.activityName?.trim()) {
  //     this.answerTypes.push({
  //       activityName:activityObj.activityName,
  //       company:activityObj.company,
  //       branch: activityObj.branch,
  //       section: activityObj.section,
  //       subSection: activityObj.subSection
  //     });
  //     this.answerTypeForm.reset();
  //   }
  // }

  removeActivity(index: number): void {
    this.answerTypes.splice(index, 1);
  }

  // submitAllActivities() {
  //   const payload = this.answerTypes.map(({ activityName, company, branch, section, subSection }) => ({
  //     activityName,
  //     company: !!company,
  //     branch: !!branch,
  //     section: !!section,
  //     subSection: !!subSection
  //   }));
  //   this.businessActivityService.createBusinessActivity(payload).subscribe({
  //     next:()=>{
  //       this.getBusinessActivity(),
  //         this.closeModal();
  //       },
  //         error: err => {
  //           console.error('Create business activity error:', err);
  //          alert('Failed to submit business activities. Please try again.');
  //         }
  //   });
  // }


  submitActivity() {
    const form = this.answerTypeForm;
    const formValue = form.value;
    const payload = {
      activityName: formValue.activityName,
      company: !!formValue.company,
      branch: !!formValue.branch,
      section: !!formValue.section,
      subSection: !!formValue.subSection
    };
      if(this.answerTypeForm.invalid){
         this.answerTypeForm.markAllAsTouched();
          return;
      }
    if (this.isEditMode) {
      const updatedFields: any = { id: this.selectedAnswerTypeId };

      this.utilityService.setIfDirty(form, 'activityName', updatedFields);
      this.utilityService.setIfDirty(form, 'company', updatedFields);
      this.utilityService.setIfDirty(form, 'branch', updatedFields);
      this.utilityService.setIfDirty(form, 'section', updatedFields);
      this.utilityService.setIfDirty(form, 'subSection', updatedFields);
      // Only send update if any field has changed
      if (Object.keys(updatedFields).length === 1) {
        this.utilityService.warning('No changes detected.');
        return;
      }
      this.businessActivityService.updateBusinessActivity(updatedFields).subscribe({
        next: (res) => {
          const updatedItem = res.body?.data;

          if (updatedItem) {
            const filteredIndex = this.filteredData.findIndex(item => item.id === updatedItem.id);
            if (filteredIndex !== -1) {
              this.filteredData[filteredIndex] = updatedItem;
            }
          }
          this.closeModal();
          this.utilityService.success(res.body?.message || 'Activity updated.');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Update failed.');
        }
      });
    }
    else {
    
      this.businessActivityService.createBusinessActivity(payload).subscribe({
        next: (res) => {
          const newItem = res.body?.data;
          if (newItem) {
            this.filteredData.push(newItem);
          }
          this.closeModal();
          this.utilityService.success(res.body.message);
        },
        error: err => {
          this.utilityService.showError(err.status, err.error.message);
        }
      });
    }


  }





  // openEditModal(item: any) {
  //   this.isEditModalVisible = true;
  //     this.originalItem = { ...item };
  //   this.answerTypeForm.patchValue({
  //     id: item.id,
  //     activityName: item.activityName,
  //     company: item.company ,
  //     branch: item.branch ,
  //     section: item.section ,
  //     subSection: item.subSection 
  //   });
  // }


  // saveChanges() {
  //   const formValue = this.answerTypeForm.value;

  //   // Always include ID for identification
  //   const updatedFields: any = { id: formValue.id };

  //   // Compare with originalItem and include only changed fields
  //   Object.keys(formValue).forEach(key => {
  //     if (formValue[key] !== this.originalItem[key]) {
  //       updatedFields[key] = formValue[key];
  //     }
  //   });

  //   // If no fields changed (only ID present), do nothing
  //   if (Object.keys(updatedFields).length === 1) {
  //     this.closeModal();
  //     return;
  //   }

  //   // Send only changed fields to backend
  //   this.businessActivityService.updateBusinessActivity(updatedFields).subscribe({
  //     next: () => {
  //       this.getBusinessActivity();
  //       this.closeModal();
  //     },
  //     error: err => console.error('Update business activity error:', err)
  //   });
  // }



  async deleteBusinessActivity(): Promise<void> {
    const message = `Delete ${this.selectedAnswerTypeIds.length} business activity(s)`;
    const result = await this.utilityService.confirmDialog(message, 'delete');
    if (result.isConfirmed) {
      this.businessActivityService.deleteBusinessActivity(this.selectedAnswerTypeIds).subscribe({
        next: (res) => {
          const deletedIds: string[] = res.body?.data || [];
          this.filteredData = this.filteredData.filter(item => !deletedIds.includes(item.id));
          this.selectedAnswerTypeIds = [];
          this.isAllSelected = false;
          this.utilityService.success(res.body?.message || 'Deleted successfully.');
        },
        error: (err) => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to delete items.');
        }


      });
      this.selectedAnswerTypeIds = [];
      this.isAllSelected = false;

    }
  }



  updateSelectAllStatus() {
    this.isAllSelected = this.selectedAnswerTypeIds.length === this.pagedData.length;
  }

  toggleSelection(id: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedAnswerTypeIds.includes(id)) {
        this.selectedAnswerTypeIds.push(id);
      }
    } else {
      this.selectedAnswerTypeIds = this.selectedAnswerTypeIds.filter(x => x !== id);
    }

    // this.updateSelectAllStatus();
  }

  toggleSelectAll(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedAnswerTypeIds = this.pagedData.map(x => x.id);
    } else {
      this.selectedAnswerTypeIds = [];
    }

    this.isAllSelected = checked;
  }
  
  async toggleStatus(item: any): Promise<void> {
    const updatedStatus = !item.status;
    const payload = {
      id: item.id,
      status: updatedStatus
    };
    const message = `Are you sure you want to set this role as ${updatedStatus ? 'Active' : 'Inactive'}?`;
    const result = await this.utilityService.confirmDialog(message, 'update');

    if (result.isConfirmed) {

      this.businessActivityService.updateBusinessActivityStatus(payload).subscribe({
        next: () => {
          item.status = updatedStatus;
          this.utilityService.success('Status updated successfully');
        },
        error: err => {
          this.utilityService.showError(err.status, err.error?.message || 'Failed to Update Status.')

        }
      });
    }
  }
}
